import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Editorial } from "./editorial.entity.js";
import {
  NotFoundError,
  sql,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { editorialCount } from "./editorialCount.entity.js";
import { io } from "../app.js";
import { SOCKET_EVENTS } from "../shared/constants/socketEvents.config.js";
import { CRUD_names } from "../shared/constants/crudNames.config.js";

const em = orm.em;

async function buscarEditoriales(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const editoriales = await em.findAll(editorialCount, {});
    return res.status(200).json({
      message: "Las editoriales encontradas son: PROBANDO DOCKER",
      data: editoriales,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarEditorialesByPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sortOrder = req.query.sortOrder as string;
    const sortColumn = req.query.sortColumn as string;
    const filterValue = req.query.filterValue as string; // Viene siempre, pero puede estar vacío.
    const pageSize = Number(req.query.pageSize as string);
    const pageIndex = Number(req.query.pageIndex as string);

    const offset = pageSize * pageIndex; // Base 0.

    let filter = {}; // Evita like innecesario.
    if (filterValue) {
      filter = { nombre: { $like: `%${filterValue}%` } }; // Mysql no es case sensitive, no hace falta un lower.
    }

    const [editoriales, totalCount] = await em.findAndCount(
      editorialCount,
      filter,
      { limit: pageSize, offset: offset, orderBy: { [sortColumn]: sortOrder } },
    );

    return res.status(200).json({
      message: "Las editoriales encontradas son:",
      data: editoriales,
      total: totalCount,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarEditorial(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = await em.findOneOrFail(Editorial, { id });
    return res
      .status(200)
      .json({ message: "Editorial encontrada", data: editorial });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Editorial inexistente" });
    }
    next(error);
  }
}

async function altaEditorial(req: Request, res: Response, next: NextFunction) {
  try {
    const editorial = em.create(Editorial, req.body);
    await em.flush();
    return res
      .status(201)
      .json({ message: "Editorial creada", data: editorial });
  } catch (error: any) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({
        message: "El nombre de la editorial ya existe",
      });
    }
    next(error);
  }
}

async function actualizarEditorial(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = em.getReference(Editorial, id);
    em.assign(editorial, req.body);
    await em.flush();
    return res.status(200).json({ message: "Editorial actualizada" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaEditorial(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = em.getReference(Editorial, id);
    await em.removeAndFlush(editorial);

    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Editorial });

    return res.status(200).send({ message: "Editorial borrada" });
  } catch (error: any) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "No se puede eliminar una editorial que posea libros",
      });
    }
    next(error);
  }
}
export {
  buscarEditoriales,
  buscarEditorial,
  altaEditorial,
  actualizarEditorial,
  bajaEditorial,
  buscarEditorialesByPage,
};
