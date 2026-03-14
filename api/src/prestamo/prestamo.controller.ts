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
import { LockWaitTimeoutException } from "@mikro-orm/core";
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
    /* query con or
    const condiciones = ejemplares.map((e) => ({
      id: e.idEjemplar,
      miLibro: e.idLibro,
    }));
    const ejemplaresEncontrados = await em.find(
      Ejemplar,
      { bajaLogica: false, $or: condiciones },
      { populate: ["miLibro", "misLp"] },
    );
    */
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
      .getResultList();

    // Se bloquean los registros (para lectura "for update") de los ejemplares hasta que termine esta request.
    // Es posible que se de un deadlock pero lo resuelve la BD, se maneja el error.

    if (ejemplares.length != ejemplaresEncontrados.length) {
      return res.status(400).json({
        message: "Uno de los ejemplares no existe",
        code: "EJEMPLAR_NOT_FOUND",
      });
    }

    const socio = await em.findOneOrFail(Socio, idSocio, {
      populate: ["misPrestamos.misLpPrestamo.miEjemplar.miLibro"],
    });
    for (const ejemplar of ejemplaresEncontrados) {
      if (socio.tenesPendiente(ejemplar.getLibro())) {
        return res.status(400).json({
          message: "El socio tiene pendiente un ejemplar de ese libro",
          code: "ALREADY_BORROWED_BY_SOCIO",
        });
      }
    }
    for (const ejemplar of ejemplaresEncontrados) {
      if (ejemplar.estasPendiente()) {
        return res.status(400).json({
          message:
            "Existe un ejemplar que no esta disponible para ser prestado.",
          code: "BORROWED_EJEMPLAR",
        });
      }
    }

    const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca, 1);
    const disponibles =
      politicaBiblioteca.getCantPendientesMaximo() - socio.getCantPendientes();
    if (ejemplaresEncontrados.length > disponibles) {
      return res.status(400).json({
        message:
          "Se recibieron más ejemplares de los que el socio puede retirar",
        code: "EXCEDED_EJEMPLARES",
      });
    }

    const prestamo = em.create(Prestamo, {
      miSocioPrestamo: socio,
      fechaPrestamo: new Date(),
      ordenLinea: 0,
    });
    const hoy = new Date();
    const diasPrestamo = politicaBiblioteca.getDiasPrestamo();
    const fechaDevolucionTeorica = addDays(hoy, diasPrestamo);
    for (const ejemplar of ejemplaresEncontrados) {
      const lp = em.create(LineaPrestamo, {
        miEjemplar: ejemplar,
        ordenLinea: prestamo.getOrdenLinea(),
        fechaDevolucionTeorica: fechaDevolucionTeorica,
      });
      prestamo.misLpPrestamo.add(lp);
    }
    await em.flush();

    const prestamoWriteDTO = PrestamoMapper.toWriteDTO(prestamo);

    return res.status(201).json({
      message: "Prestámo creado",
      data: prestamoWriteDTO,
    });
  } catch (error: any) {
    if (error.code === "ER_LOCK_DEADLOCK") {
      return res.status(409).json({
        message: "Conflicto de concurrencia, reintente.",
        code: "DEADLOCK",
      });
    }
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error.message.includes("Socio") && error instanceof NotFoundError) {
      return res.status(400).json({ message: "Socio inexistente" });
    }
    next(error);
  }
}

async function devolverLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      [req.body.idEjemplar, req.body.idLibro],
      { populate: ["misLp.miPrestamo.misLpPrestamo"] },
    );

    const libro = ejemplar.getLibro();
    const socio = await em.findOneOrFail(Socio, req.body.idSocio);

    if (!ejemplar.estasPendiente()) {
      return res
        .status(400)
        .json({ message: "El ejemplar no esta pendiente de devolución" });
    }

    const hoy = new Date();
    const lpPendiente = ejemplar.getLpPendiente();
    const prestamo = lpPendiente.getPrestamo();

    if (false) {
      // lpPendiente.estasAtrasado()
      let diasSancion = 0;
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
        // quitar comentario diasSancion = politicaSancion.getDiasSancion();
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
        miSocioSancion: socio,
        fechaSancion: hoy,
      });
      console.log(hoy);
      lpPendiente.setFechaDevolucionReal(hoy);

      // Logica ultima LP
      // A pesar de no hacer em.await() la LP de adentro del prestamo esta sincronizada con la lpPendiente, por eso = 0 y no = 1.
      if (prestamo.getCantPendientes() === 0) {
        prestamo.setFinalizado();
      }
      // Fin logica
      await em.flush();
      return res.status(200).json({
        message: "Devolucion registrada y socio sancionado.",
        data: {
          socio: socio,
          diasSancion: diasSancion,
          ejemplar: ejemplar,
          libro: libro,
        },
      });
    }

    lpPendiente.setFechaDevolucionReal(hoy);

    if (prestamo.getCantPendientes() === 0) {
      prestamo.setFinalizado();
    }
    await em.flush();

    return res.status(200).json({
      message: "Se registro la devolución del libro",
      data: {
        libro: libro,
        ejemplar: ejemplar,
        socio: socio,
      },
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error.message.includes("Socio")) {
      return res.status(404).json({ message: "Socio inexistente" }); //Notar que es un 404 porque aca si lo ingresa el usuario
    }
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Ejemplar o libro no encontrado" });
    }
    next(error);
  }
}

async function buscarPrestamos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Nota: Si se envia un valor de parámetro inexistente, devuelve un 200 con el array vacío.
  try {
    const estadoPrestamo = req.query.estadoPrestamo as string | undefined;

    const prestamos = await em.find(
      Prestamo,
      estadoPrestamo ? { estadoPrestamo } : {},
      { populate: ["misLpPrestamo.miEjemplar.miLibro"] },
    );
    res
      .status(200)
      .json({ message: "Los prestámos encontrados son:", data: prestamos });
  } catch (error: any) {
    next(error);
  }
}
async function buscarPrestamosSocio(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    //No se valida el socio apropósito
    const estadoPrestamo = req.query.estadoPrestamo as string | undefined;
    const idSocio = Number.parseInt(req.params.id);

    const filtros: any = { miSocioPrestamo: idSocio };
    if (estadoPrestamo) {
      filtros.estadoPrestamo = estadoPrestamo;
    }

    const prestamos = await em.find(Prestamo, filtros, {
      populate: ["misLpPrestamo.miEjemplar"],
    });
    res.status(200).json({
      message: "Los prestámos del socio encontrados son:",
      data: prestamos,
    });
  } catch (error: any) {
    next(error);
  }
}
async function buscarEjemplaresPendientesSocio(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const idSocio = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(Socio, idSocio, {
      populate: [
        "misPrestamos.misLpPrestamo.miEjemplar.miLibro.miAutor",
        "misPrestamos.misLpPrestamo.miEjemplar.miLibro.miEditorial",
      ],
    });
    const noDevueltos = socio.getNoDevueltos();
    res.status(200).json({
      message: "Los ejemplares no devueltos del socio son",
      ejemplares: noDevueltos,
    });
  } catch (error: any) {
    next(error);
  }
}

export {
  altaPrestamo,
  devolverLibro,
  buscarPrestamos,
  buscarPrestamosSocio,
  buscarEjemplaresPendientesSocio,
  devolverLibroD,
};

/* 
Desacoplamiento del CU - Devolver un Libro
Funcion 1 Buscar Ejemplar | Bad Request EN EL FRONT 
Funcion 2 Buscar Socio | Bad Request EN EL FRONT
Funcion 3 Validar si el ejemplar esta pendiente o que el Buscar Ejemplar además devuelva el estado | Bad Request en el FRONT si no está pendiente


Función 1 Validar que el ejemplar este pendiente y exista. 
Funcion 2 Validar socio exista

Si estas dos salieron bien, modal de confirmación. Si no, error y muestro el porque.

Funcion 4 Mando id prestamo + numero de linea + IDSOCIO para sancionar,
y actualizo fechaDevolucionReal. Aca está la sanción. Que el ORM traiga el prestamo, y en memoria busco la LP.


*/

// Devolver libro desacoplado

async function devolverLibroD(req: Request, res: Response, next: NextFunction) {
  // Se recibe idPrestamo, idLinea e idSocio.
  // No válido que el ejemplar este pendiente porque eso se hace con una funcion aparte en el controlador de ejemplar.
  try {
    const idPrestamo = Number.parseInt(req.params.id);
    const idLP = Number.parseInt(req.params.idLP);
    const idSocio = req.body.idSocio; // Asumo que está bien porque acaba de ser validado en el Front
    const prestamo = await em.findOneOrFail(
      Prestamo,
      { id: idPrestamo },
      { populate: ["misLpPrestamo"] },
    );

    const hoy = new Date();
    const lpPendiente = prestamo.getLinea(idLP);
    if (!lpPendiente) {
      throw new Error("La linea de préstamo seleccionada no existe");
    }
    // Poner true aca para testear camino alternativo
    if (lpPendiente.estasAtrasado()) {
      let diasSancion = 0;
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
        fechaSancion: hoy,
      });

      lpPendiente.setFechaDevolucionReal(hoy);

      // Logica ultima LP
      // A pesar de no hacer em.await() la LP de adentro del prestamo esta sincronizada con la lpPendiente, por eso = 0 y no = 1.
      if (prestamo.getCantPendientes() === 0) {
        prestamo.setFinalizado();
      }
      // Fin logica

      // diasSancion = 10; Hardcodear esto para testear camino alternativo.
      await em.flush();
      return res.status(200).json({
        message: "Devolucion registrada y socio sancionado.",
        data: {
          socio: idSocio,
          diasSancion: diasSancion,
        },
      });
    }
    // Comentar de aca hasta antes del catch para testear camino alternativo.
    lpPendiente.setFechaDevolucionReal(hoy);

    if (prestamo.getCantPendientes() === 0) {
      prestamo.setFinalizado();
    }
    await em.flush();

    return res.status(200).json({
      message: "Se registro la devolución del libro",
      data: {
        socio: idSocio,
      },
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }
    if (error.message.includes("La linea de préstamo seleccionada no existe")) {
      return res
        .status(404)
        .json({ message: "Línea de Préstamo no encontrada" });
    }
    next(error);
  }
}
