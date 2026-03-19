import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { PoliticaSancion } from "./politicaSancion.entity.js";
import { NotFoundError } from "@mikro-orm/core";
import { SOCKET_EVENTS } from "../shared/constants/socketEvents.config.js";
import { CRUD_names } from "../shared/constants/crudNames.config.js";
import { io } from "../app.js";
import { PoliticaSancionMapper } from "./politicaSancion.mapper.js";

const em = orm.em;

async function buscarPoliticasSancion(
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
      filter = { diasHasta: filterValue };
    }

    const [politicas, totalCount] = await em.findAndCount(
      PoliticaSancion,
      filter,
      {
        limit: pageSize,
        offset: offset,
        orderBy: { [sortColumn]: sortOrder },
      },
    );

    const politicasDTO = PoliticaSancionMapper.toReadDTOList(politicas);

    return res.status(200).json({
      message: "Las politicas de sanción encontradas son: ",
      data: politicasDTO,
      total: totalCount,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = await em.findOneOrFail(PoliticaSancion, id);

    const politicaDTO = PoliticaSancionMapper.toReadDTO(politica);

    return res
      .status(200)
      .json({ message: "Politica encontrada", data: politicaDTO });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Politica de sanción no encontrada" });
    }
    next(error);
  }
}

async function altaPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.body.diasSancion === 0) {
      return res.status(409).json({
        message: "La sanción debe ser de al menos un día.",
        code: "ZERO_DAYS",
      });
    }
    const politica = em.create(PoliticaSancion, req.body);
    await em.flush();
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, {
      crud: CRUD_names.PoliticaSancion,
    });
    const politicaDTO = PoliticaSancionMapper.toReadDTO(politica);
    return res
      .status(201)
      .json({ message: "Politica de sanción creada", data: politicaDTO });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Ya existe una politica de sanción con esa cantidad de dias hasta",
        code: "DUPLICATED_POLITICA",
      });
    }
    next(error);
  }
}

async function actualizarPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = em.getReference(PoliticaSancion, id);
    em.assign(politica, req.body);
    await em.flush();
    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, {
      crud: CRUD_names.PoliticaSancion,
    });

    return res.status(200).json({ message: "Politica de sanción actualizada" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = em.getReference(PoliticaSancion, id);
    await em.removeAndFlush(politica);

    io.emit(SOCKET_EVENTS.CACHE_INVALIDATE, {
      crud: CRUD_names.PoliticaSancion,
    });

    return res.status(200).json({ message: "Política eliminada" });
  } catch (error: any) {
    next(error);
  }
}

export {
  buscarPoliticasSancion,
  buscarPoliticaSancion,
  altaPoliticaSancion,
  actualizarPoliticaSancion,
  bajaPoliticaSancion,
};
