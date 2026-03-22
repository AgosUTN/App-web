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

    let filter = { bajaLogica: false };

    if (filterValue) {
      filter = Object.assign(filter, { nombre: { $like: `%${filterValue}%` } });
    }

    const [socios, totalCount] = await em.findAndCount(Socio, filter, {
      limit: pageSize,
      offset: offset,
      orderBy: { [sortColumn]: sortOrder },
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
    const socio = await em.findOneOrFail(Socio, { id: id, bajaLogica: false });
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

async function altaSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const socioDTO: SocioWriteDTO = await em.transactional(async (em) => {
      let socio = em.create(Socio, req.body.socio);

      const password_hash = await bcrypt.hash(req.body.user.password, 10);

      const user = em.create(User, {
        email: req.body.user.email,
        password_hash: password_hash,
        rol: "USER",
        miSocio: socio,
      });

      socio.setUser(user);

      await em.flush();
      return SocioMapper.toWriteDTO(socio);
    });

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
}

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
      socio.setBajaLogica(); // Le da baja lógica al usuario también.
      await em.flush();
      return res.status(200).send({ message: "Socio dado de baja" });
    } else {
      await em.removeAndFlush(socio);
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
};
