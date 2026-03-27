import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Autor } from "./autor.entity.js";

import {
  NotFoundError,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { AutorTable } from "./autorTable.entity.js";
import { io } from "../app.js";
import { SOCKET_EVENTS } from "../shared/constants/socketEvents.config.js";
import { CRUD_names } from "../shared/constants/crudNames.config.js";
import { AutorMapper } from "./autor.mapper.js";

const em = orm.em;

async function buscarAutoresByPage(
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

    let filter = {};
    if (filterValue) {
      filter = { nombrecompleto: { $like: `%${filterValue}%` } };
    }

    const [autores, totalCount] = await em.findAndCount(AutorTable, filter, {
      limit: pageSize,
      offset: offset,
      orderBy: { [sortColumn]: sortOrder },
    });

    return res.status(200).json({
      message: "Los autores encontrados son:",
      data: autores,
      total: totalCount,
    });
  } catch (error: any) {
    next(error);
  }
}
async function buscaAutor(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = await em.findOneOrFail(
      Autor,
      { id },
      { populate: ["misLibros"] },
    );
    const autorDTO = AutorMapper.toReadDTO(autor);
    return res
      .status(200)
      .json({ message: "Autor encontrado", data: autorDTO });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Autor inexistente" });
    }
    next(error);
  }
}

async function altaAutor(req: Request, res: Response, next: NextFunction) {
  try {
    const autor = em.create(Autor, req.body);
    await em.flush();
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Autor });
    const autorDTO = AutorMapper.toReadDTO(autor);
    return res.status(201).json({ message: "Autor creado", data: autorDTO });
  } catch (error: any) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({
        message: "El nombre del autor ya existe",
        code: "NOMBRE_DUPLICATED",
      });
    }
    next(error);
  }
}

async function actualizarAutor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = em.getReference(Autor, id);
    em.assign(autor, req.body);
    await em.flush();
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Autor });
    return res.status(200).json({ message: "Autor actualizado" });
  } catch (error: any) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({
        message: "El nombre del autor ya existe",
        code: "NOMBRE_DUPLICATED",
      });
    }
    next(error);
  }
}

async function bajaAutor(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = em.getReference(Autor, id);
    await em.removeAndFlush(autor);
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Autor });
    return res.status(200).send({ message: "Autor borrado" });
  } catch (error: any) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "No se puede eliminar un autor que posea libros",
      });
    }
    next(error);
  }
}

export {
  buscarAutoresByPage,
  buscaAutor,
  altaAutor,
  actualizarAutor,
  bajaAutor,
};
