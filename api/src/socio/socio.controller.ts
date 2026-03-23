import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Socio } from "./socio.entity.js";
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { PoliticaBiblioteca } from "../politicaBiblioteca/politicaBiblioteca.entity.js";
import { User } from "../users/user.entity.js";
import bcrypt from "bcrypt";
import { SocioWriteDTO } from "./dtos/socioWrite.dto.js";
import { SocioMapper } from "./socio.mapper.js";
import { io } from "../app.js";
import { SOCKET_EVENTS } from "../shared/constants/socketEvents.config.js";
import { CRUD_names } from "../shared/constants/crudNames.config.js";

const em = orm.em;

async function buscarSociosByPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sortOrder = req.query.sortOrder as string;
    const sortColumn = req.query.sortColumn as string;
    const filterValue = req.query.filterValue as string;
    const pageSize = Number(req.query.pageSize as string);
    const pageIndex = Number(req.query.pageIndex as string);

    const offset = pageSize * pageIndex;

    let filter = {}; // La tabla muestra todos los socios, incluidos los que tienen baja lógica.

    if (filterValue) {
      filter = Object.assign(filter, { id: filterValue });
    }

    const [socios, totalCount] = await em.findAndCount(Socio, filter, {
      limit: pageSize,
      offset: offset,
      orderBy: { [sortColumn]: sortOrder },
      populate: ["miUser", "misPrestamos.misLpPrestamo", "misSanciones"],
    });
    const sociosDTO = SocioMapper.toTableDTOList(socios);

    return res.status(200).json({
      message: "Socios encontrados: ",
      data: sociosDTO,
      total: totalCount,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(
      Socio,
      { id: id, bajaLogica: false }, // Este endpoint no se usa para el socioDetail, por eso bajaLogica false. Se usa para CU retirar libros y el update de socio, donde se quiere que aparezca que el socio no existe si tiene baja lógica.
      { populate: ["miUser"] },
    );
    const socioDTO = SocioMapper.toReadDTO(socio);

    return res.status(200).json({
      message: "Socio encontrado: ",
      data: socioDTO,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Socio no encontrado" });
    }
    next(error);
  }
}

async function buscarSocioDetail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(
      Socio,
      { id: id }, // Puede traer socio con baja lógica.
      {
        populate: [
          "miUser",
          "misPrestamos.misLpPrestamo",
          "misSanciones.miLineaPrestamo.miEjemplar.miLibro",
        ],
      },
    );
    const pPendientes = socio.getPrestamosPendientes();
    const sVigentes = socio.getSancionesVigentes();

    const socioDTO = SocioMapper.toDetailDTO(socio, pPendientes, sVigentes);

    return res.status(200).json({
      message: "Socio encontrado: ",
      data: socioDTO,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Socio no encontrado" });
    }
    next(error);
  }
}

async function altaSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const socioDTO: SocioWriteDTO = await em.transactional(async (em) => {
      let socio = em.create(Socio, {
        nombre: req.body.nombre as string,
        apellido: req.body.apellido as string,
        telefono: req.body.telefono as string,
        domicilio: req.body.domicilio as string,
        bajaLogica: false,
      });

      const password_hash = await bcrypt.hash(
        generateFirstPassword(socio.nombre, socio.telefono),
        10,
      );

      const user = em.create(User, {
        email: req.body.email,
        password_hash: password_hash,
        rol: "USER",
        miSocio: socio,
      });

      socio.setUser(user);

      await em.flush();
      return SocioMapper.toWriteDTO(socio);
    });
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Socio });
    return res.status(201).json({ message: "Socio creado", data: socioDTO });
  } catch (error: any) {
    if (error instanceof UniqueConstraintViolationException) {
      return res
        .status(409)
        .json({ message: "Email ya registrado", code: "DUPLICATED_EMAIL" });
    }
    next(error);
  }
}

async function actualizarSocio(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = em.getReference(Socio, id);
    em.assign(socio, req.body);
    await em.flush();
    return res.status(200).json({ message: "Socio actualizado" });
  } catch (error: any) {
    next(error);
  }
} // No hay columnas modificables que se puedan ver en la grilla, por eso no se invalida cache.

async function bajaSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(Socio, id, {
      populate: ["misPrestamos.misLpPrestamo", "miUser"],
    });

    if (socio.getCantPendientes() > 0) {
      return res.status(409).json({
        message: "No se puede eliminar un socio que tenga libros sin devolver",
      });
    }

    if (socio.misPrestamos.length > 0) {
      socio.setBajaLogica();
      await em.flush();

      io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Socio });
      return res.status(200).send({ message: "Socio dado de baja" });
    } else {
      await em.removeAndFlush(socio);

      io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Socio });
      return res.status(200).send({ message: "Socio borrado" });
    }
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(200).send({ message: "Socio borrado" }); // Por seguridad.
    }
    next(error);
  }
}

async function validarSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(
      Socio,
      { id },
      {
        populate: ["misSanciones", "misPrestamos.misLpPrestamo"],
      },
    );

    if (socio.estasInhabilitado()) {
      return res.status(409).json({
        message: "Socio inhabilitado - Tiene préstamos atrasados",
        code: "DISABLED_SOCIO",
        data: "",
      });
    }
    if (socio.estasSancionado()) {
      const diasSancionado = socio.getDiasSancion();
      return res.status(409).json({
        message: "Socio sancionado",
        code: "SANCTIONED_SOCIO",
        data: diasSancionado,
      });
    }
    const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca, 1);
    const disponibles =
      politicaBiblioteca.getCantPendientesMaximo() - socio.getCantPendientes();

    return res.status(200).json({
      message: "El socio esta habilitado",
      data: disponibles,
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca inaccesible" });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Socio no encontrado" });
    }
    next(error);
  }
}

export {
  buscarSociosByPage,
  buscarSocio,
  altaSocio,
  actualizarSocio,
  bajaSocio,
  validarSocio,
  buscarSocioDetail,
};

function generateFirstPassword(nombre: string, telefono: string): string {
  return nombre.slice(0, 3) + telefono.slice(0, 4);
}
