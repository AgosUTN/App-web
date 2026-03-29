import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Socio } from "../socio/socio.entity.js";
import { LockMode, NotFoundError } from "@mikro-orm/core";
import { Prestamo } from "./prestamo.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { PoliticaBiblioteca } from "../politicaBiblioteca/politicaBiblioteca.entity.js";
import { LineaPrestamo } from "../lineaPrestamo/lineaPrestamo.entity.js";
import { Sancion } from "../sancion/sancion.entity.js";
import { addDays, differenceInDays, startOfDay } from "date-fns";
import { PoliticaSancion } from "../politicaSancion/politicaSancion.entity.js";

import { EjemplarPrestamoDTO } from "../ejemplar/dtos/ejemplarPrestamo.dto.js";
import { PrestamoMapper } from "./prestamo.mapper.js";
import { PrestamoWriteDTO } from "./dtos/prestamoRead.dto.js";
import { SOCKET_EVENTS } from "../shared/constants/socketEvents.config.js";
import { CRUD_names } from "../shared/constants/crudNames.config.js";
import { io } from "../app.js";

const em = orm.em;

async function altaPrestamo(req: Request, res: Response, next: NextFunction) {
  try {
    //La mayoría de las validaciones ya se habían hecho en los endpoints de los dos pasos anteriores, se repiten por seguridad.
    //Salvo la validación de ejemplares repetidos y la de exceso de ejemplares que solo se hicieron en el front.

    const ejemplares: EjemplarPrestamoDTO[] = req.body.ejemplares;
    const idSocio = req.body.idSocio;

    const libros = ejemplares.map((e) => e.idLibro);
    const librosUnicos = new Set(libros);
    if (librosUnicos.size !== libros.length) {
      return res.status(400).json({
        message: "No se pueden retirar dos ejemplares del mismo libro",
        code: "DUPLICATED_LIBRO",
      });
    }

    let prestamoWriteDTO: PrestamoWriteDTO = await em.transactional(
      async (em) => {
        const tuples = ejemplares
          .map((e) => `(${e.idEjemplar}, ${e.idLibro})`)
          .join(",");

        const ejemplaresEncontrados = await em
          .createQueryBuilder(Ejemplar, "e")
          .select("*")
          .leftJoinAndSelect("e.miLibro", "l")
          .leftJoinAndSelect("e.misLp", "lp")
          .where(`(e.id, e.mi_libro_id) IN (${tuples})`)
          .andWhere({ bajaLogica: false })
          .setLockMode(LockMode.PESSIMISTIC_WRITE)
          .getResultList();

        // Se bloquean los registros (para lectura "for update") de los ejemplares hasta que termine esta request.
        // Es posible que se de un deadlock pero lo resuelve la BD, se maneja el error.

        if (ejemplares.length != ejemplaresEncontrados.length) {
          throw {
            status: 400,
            message: "Uno de los ejemplares no existe",
            code: "EJEMPLAR_NOT_FOUND",
          };
        }

        const socio = await em.findOneOrFail(Socio, idSocio, {
          populate: ["misPrestamos.misLpPrestamo.miEjemplar.miLibro"],
        });

        for (const ejemplar of ejemplaresEncontrados) {
          if (socio.tenesPendiente(ejemplar.getLibro())) {
            throw {
              status: 400,
              message: "El socio tiene pendiente un ejemplar de ese libro",
              code: "ALREADY_BORROWED_BY_SOCIO",
            };
          }
        }

        for (const ejemplar of ejemplaresEncontrados) {
          if (ejemplar.estasPendiente()) {
            throw {
              status: 400,
              message:
                "Existe un ejemplar que no esta disponible para ser prestado.",
              code: "BORROWED_EJEMPLAR",
            };
          }
        }

        const politicaBiblioteca = await em.findOneOrFail(
          PoliticaBiblioteca,
          1,
        );
        const disponibles =
          politicaBiblioteca.getCantPendientesMaximo() -
          socio.getCantPendientes();
        if (ejemplaresEncontrados.length > disponibles) {
          throw {
            status: 400,
            message:
              "Se recibieron más ejemplares de los que el socio puede retirar",
            code: "EXCEDED_EJEMPLARES",
          };
        }

        const prestamo = em.create(Prestamo, {
          miSocioPrestamo: socio,
          fechaPrestamo: new Date(),
        });
        const hoy = new Date();
        const diasPrestamo = politicaBiblioteca.getDiasPrestamo();
        const fechaDevolucionTeorica = addDays(hoy, diasPrestamo);
        let x = 1;
        for (const ejemplar of ejemplaresEncontrados) {
          const lp = em.create(LineaPrestamo, {
            miEjemplar: ejemplar,
            ordenLinea: x,
            fechaDevolucionTeorica: fechaDevolucionTeorica,
          });
          prestamo.misLpPrestamo.add(lp);
          x++;
        }
        await em.flush();
        return PrestamoMapper.toWriteDTO(prestamo);
      },
    );
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Prestamo });
    return res.status(201).json({
      message: "Préstamo creado",
      data: prestamoWriteDTO,
    });
  } catch (error: any) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ message: error.message, code: error.code });
    }
    if (error.code === "ER_LOCK_DEADLOCK") {
      return res.status(409).json({
        message:
          "Se intentaron realizar dos préstamos en simultáneo con ejemplares iguales",
        code: "DEADLOCK",
      });
    }
    if (error.message?.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca inaccesible" });
    }
    if (error.message?.includes("Socio") && error instanceof NotFoundError) {
      return res
        .status(400)
        .json({ message: "Socio inexistente", code: "SOCIO_NOT_FOUND" });
    }
    next(error);
  }
}

async function altaPrestamoDeadlock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const ejemplares: EjemplarPrestamoDTO[] = req.body.ejemplares;
    const idSocio = req.body.idSocio;

    const libros = ejemplares.map((e) => e.idLibro);
    const librosUnicos = new Set(libros);
    if (librosUnicos.size !== libros.length) {
      return res.status(400).json({
        message: "No se pueden retirar dos ejemplares del mismo libro",
        code: "DUPLICATED_LIBRO",
      });
    }

    let prestamoWriteDTO: any;

    await em.transactional(async (em) => {
      const ejemplaresOrdenados =
        req.query.reverse === "true" ? [...ejemplares].reverse() : ejemplares;

      const tuples = ejemplaresOrdenados
        .map((e) => `(${e.idEjemplar}, ${e.idLibro})`)
        .join(",");
      const ejemplaresEncontrados = await em
        .createQueryBuilder(Ejemplar, "e")
        .select("*")
        .leftJoinAndSelect("e.miLibro", "l")
        .leftJoinAndSelect("e.misLp", "lp")
        .where(`(e.id, e.mi_libro_id) IN (${tuples})`)
        .andWhere({ bajaLogica: false })
        .setLockMode(LockMode.PESSIMISTIC_WRITE)
        .getResultList();

      await sleep(10000); // Frena la request para que la otra se tope con el lock

      if (ejemplares.length != ejemplaresEncontrados.length) {
        throw {
          status: 400,
          message: "Uno de los ejemplares no existe",
          code: "EJEMPLAR_NOT_FOUND",
        };
      }

      const socio = await em.findOneOrFail(Socio, idSocio, {
        populate: ["misPrestamos.misLpPrestamo.miEjemplar.miLibro"],
      });

      for (const ejemplar of ejemplaresEncontrados) {
        if (socio.tenesPendiente(ejemplar.getLibro())) {
          throw {
            status: 400,
            message: "El socio tiene pendiente un ejemplar de ese libro",
            code: "ALREADY_BORROWED_BY_SOCIO",
          };
        }
      }

      for (const ejemplar of ejemplaresEncontrados) {
        if (ejemplar.estasPendiente()) {
          throw {
            status: 400,
            message:
              "Existe un ejemplar que no esta disponible para ser prestado.",
            code: "BORROWED_EJEMPLAR",
          };
        }
      }

      const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca, 1);
      const disponibles =
        politicaBiblioteca.getCantPendientesMaximo() -
        socio.getCantPendientes();
      if (ejemplaresEncontrados.length > disponibles) {
        throw {
          status: 400,
          message:
            "Se recibieron más ejemplares de los que el socio puede retirar",
          code: "EXCEDED_EJEMPLARES",
        };
      }

      const prestamo = em.create(Prestamo, {
        miSocioPrestamo: socio,
        fechaPrestamo: new Date(),
      });
      const hoy = new Date();
      const diasPrestamo = politicaBiblioteca.getDiasPrestamo();
      const fechaDevolucionTeorica = addDays(hoy, diasPrestamo);
      let x = 1;
      for (const ejemplar of ejemplaresEncontrados) {
        const lp = em.create(LineaPrestamo, {
          miEjemplar: ejemplar,
          ordenLinea: x,
          fechaDevolucionTeorica: fechaDevolucionTeorica,
        });
        prestamo.misLpPrestamo.add(lp);
        x++;
      }
      await em.flush();
      prestamoWriteDTO = PrestamoMapper.toWriteDTO(prestamo);
    });

    return res.status(201).json({
      message: "Préstamo creado",
      data: prestamoWriteDTO,
    });
  } catch (error: any) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ message: error.message, code: error.code });
    }
    if (error.code === "ER_LOCK_DEADLOCK") {
      return res.status(409).json({
        message:
          "Se intentaron realizar dos préstamos en simultáneo con ejemplares iguales",
        code: "DEADLOCK",
      });
    }
    if (error.message?.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca inaccesible" });
    }
    if (error.message?.includes("Socio") && error instanceof NotFoundError) {
      return res.status(400).json({ message: "Socio inexistente" });
    }
    next(error);
  }
}

async function buscarPrestamosByPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const estado = req.query.estado as string | undefined;
    const sortOrder = req.query.sortOrder as string;
    const sortColumn = req.query.sortColumn as string;
    let filterValue = req.query.filterValue as string;
    const pageSize = Number(req.query.pageSize as string);
    const pageIndex = Number(req.query.pageIndex as string);

    if ((req as any).user.idSocio) {
      filterValue = (req as any).user.idSocio.toString(); // Por seguridad no lo manda el front, se toma el idSocio del payload del token.
    }

    const offset = pageSize * pageIndex;

    let filter = {};
    if (filterValue) {
      Object.assign(filter, { mi_socio_prestamo_id: filterValue });
    }
    if (estado) {
      Object.assign(filter, { estadoPrestamo: estado });
    }
    const [prestamos, total] = await em.findAndCount(Prestamo, filter, {
      limit: pageSize,
      offset: offset,
      orderBy: { [sortColumn]: sortOrder },
      populate: ["misLpPrestamo"],
    });

    const prestamosDTO = PrestamoMapper.toTableDTOList(prestamos);
    res.status(200).json({
      message: "Los prestámos encontrados son:",
      data: prestamosDTO,
      total: total,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarPrestamo(req: Request, res: Response, next: NextFunction) {
  try {
    const idPrestamo = parseInt(req.params.id);
    let idSocioRequest;

    if ((req as any).user.idSocio) {
      idSocioRequest = (req as any).user.idSocio;
    }

    const prestamo = await em.findOneOrFail(Prestamo, idPrestamo, {
      populate: ["miSocioPrestamo.miUser", "misLpPrestamo.miEjemplar.miLibro"],
    });

    if (idSocioRequest && prestamo.miSocioPrestamo.id !== idSocioRequest) {
      return res.status(403).json({
        message: "No tenés acceso al préstamo de otro socio.",
      });
    }

    const prestamoDTO = PrestamoMapper.toDetailDTO(prestamo);

    return res
      .status(200)
      .json({ message: "Préstamo encontrado", data: prestamoDTO });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ message: "Préstamo inexistente" });
    }
    next(err);
  }
}
async function buscarPrestamoByEjemplar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const idEjemplar = parseInt(req.query.idEjemplar as string);
    const idLibro = parseInt(req.query.idLibro as string);

    const lp = await em.findOneOrFail(
      LineaPrestamo,
      { miEjemplar: [idEjemplar, idLibro], fechaDevolucionReal: null },
      { populate: ["miPrestamo"] },
    );

    const prestamo = await em.findOneOrFail(Prestamo, lp.miPrestamo.id!, {
      populate: ["miSocioPrestamo.miUser", "misLpPrestamo.miEjemplar.miLibro"],
    });
    const prestamoDTO = PrestamoMapper.toDetailDTO(prestamo);
    return res
      .status(200)
      .json({ message: "Préstamo encontrado", data: prestamoDTO });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ message: "Préstamo inexistente" });
    }
    next(err);
  }
}

async function devolverLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const idPrestamo = Number.parseInt(req.params.id);
    const idLP = Number.parseInt(req.params.idLP);

    const idSocio = req.body.idSocio;
    const idEjemplar = req.body.idEjemplar;
    const idLibro = req.body.idLibro;

    const socio = await em.findOneOrFail(Socio, { id: idSocio });
    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      { id: idEjemplar, miLibro: idLibro, bajaLogica: false },
      { populate: ["misLp.miPrestamo.misLpPrestamo"] },
    );

    if (!ejemplar.estasPendiente()) {
      return res.status(409).json({
        message: "El ejemplar no esta pendiente de devolución",
        code: "EJEMPLAR_NOT_PENDING",
      });
    }
    const prestamo = await em.findOneOrFail(
      Prestamo,
      { id: idPrestamo },
      {
        populate: [
          "miSocioPrestamo.miUser",
          "misLpPrestamo.miEjemplar.miLibro",
        ],
      },
    );
    const hoy = new Date();
    const lpPendiente = prestamo.getLinea(idLP);
    if (!lpPendiente) {
      throw Object.assign(new Error("La línea préstamo no existe"), {
        code: "LP_NOT_FOUND",
      });
    }

    let diasSancion = 0;
    if (lpPendiente.estasAtrasado()) {
      const diasAtraso = differenceInDays(
        hoy,
        lpPendiente.getFechaDevolucionTeorica(),
      );

      const politicaSancion = await em
        .createQueryBuilder(PoliticaSancion)
        .orderBy({ diasHasta: "ASC" })
        .where({ diasHasta: { $gt: diasAtraso } })
        .getSingleResult();

      if (politicaSancion) {
        diasSancion = politicaSancion.getDiasSancion();
      }
      if (!politicaSancion) {
        const politicaBiblioteca = await em.findOneOrFail(
          PoliticaBiblioteca,
          1,
        );
        diasSancion = politicaBiblioteca.getDiasSancionMaxima();
      }

      em.create(Sancion, {
        diasSancion: diasSancion,
        miSocioSancion: idSocio,
        fechaSancion: hoy, // hoy new Date("2026-01-01")
        miLineaPrestamo: lpPendiente,
      });
    }

    lpPendiente.setFechaDevolucionReal(hoy);

    if (prestamo.getCantPendientes() === 0) {
      prestamo.setFinalizado();
    }

    await em.flush();
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Prestamo });
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Sancion });

    const prestamoDTO = PrestamoMapper.toDetailDTO(prestamo);

    return res.status(200).json({
      message: lpPendiente.estasAtrasado()
        ? "Devolución registrada y socio sancionado."
        : "Devolución registrada correctamente.",
      data: { prestamo: prestamoDTO, diasSancion: diasSancion }, // 0 si no fue sancionado, regla de negocio.
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: "Una entidad no fue encontrada",
        code: "ENTITY_NOT_FOUND",
      });
    }

    next(error);
  }
}

export {
  altaPrestamo,
  buscarPrestamo,
  buscarPrestamosByPage,
  buscarPrestamoByEjemplar,
  devolverLibro,
  altaPrestamoDeadlock,
};
