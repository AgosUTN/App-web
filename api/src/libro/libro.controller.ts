import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Libro } from "./libro.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { LibroMapper } from "./libro.mapper.js";
import { LibroTable } from "./libroTable.entity.js";
import { io } from "../app.js";
import { SOCKET_EVENTS } from "../shared/constants/socketEvents.config.js";
import { CRUD_names } from "../shared/constants/crudNames.config.js";
const em = orm.em;

async function buscarLibrosByPage(
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
      filter = { nombre: { $like: `%${filterValue}%` } };
    }

    const [libros, totalCount] = await em.findAndCount(LibroTable, filter, {
      limit: pageSize,
      offset: offset,
      orderBy: { [sortColumn]: sortOrder },
    });

    return res.status(200).json({
      message: "Los libros encontrados son:",
      data: libros,
      total: totalCount,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscaLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(
      Libro,
      { id },
      { populate: ["miAutor", "miEditorial", "misEjemplares"] },
    );
    return res.status(200).json({ message: "Libro encontrado", data: libro });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Libro inexistente" });
    }
    next(error);
  }
}

async function altaLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const { cantEjemplares, ...libroData } = req.body;
    const libro = em.create(Libro, libroData);

    for (let i = 0; i < cantEjemplares; i++) {
      em.create(Ejemplar, {
        id: i + 1,
        miLibro: libro,
      });
    }

    await em.flush();

    return res.status(201).json({ message: "Libro creado", data: libro });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      if (error.message.includes("libro_mis_autores_autor_id_foreign")) {
        return res.status(400).json({
          message: "Se ingreso el id de algún autor que no existe",
          code: "INVALID_ID_REFERENCE",
        });
      }
      if (error.message.includes("libro_mi_editorial_id_foreign")) {
        return res.status(400).json({
          message: "El id de editorial ingresado no existe",
          code: "INVALID_ID_REFERENCE",
        });
      }
    }
    if (error instanceof UniqueConstraintViolationException) {
      if (error.message.includes("libro.libro_isbn_unique")) {
        return res.status(409).json({
          message: "El ISBN del Libro ya existe",
          code: "ISBN_DUPLICATE",
        });
      }
      if (error.message.includes("libro.libro_titulo_unique")) {
        return res.status(409).json({
          message: "El Titulo del Libro ya existe",
          code: "TITULO_DUPLICATE",
        });
      }
    }
    next(error);
  }
}
async function actualizarLibro(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const libroActualizar = em.getReference(Libro, id);

    em.assign(libroActualizar, req.body);
    await em.flush();
    return res.status(200).json({ message: "Libro actualizado" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(Libro, id, {
      populate: ["misEjemplares.misLp"],
    });

    //Validacion puede moverse a beforeDelete. (En ese caso, dejar un getReference aca).
    if (libro.fuistePrestado()) {
      return res.status(409).json({
        message: "No puede borrarse un libro que haya sido prestado",
      });
    }

    await em.removeAndFlush(libro);
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, { crud: CRUD_names.Libro });
    return res.status(200).json({ message: "Libro eliminado" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(200).json({ message: "Libro eliminado" }); // Para mantener la consistencia.
    }
    next(error);
  }
}

export {
  buscaLibro,
  altaLibro,
  actualizarLibro,
  bajaLibro,
  buscarLibrosByPage,
};
