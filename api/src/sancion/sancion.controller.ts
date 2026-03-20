import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Sancion } from "./sancion.entity.js";

import { NotFoundError } from "@mikro-orm/core";
import { EstadoSancion } from "./estadoSancion.type.js";
import { SancionMapper } from "./sancion.mapper.js";

const em = orm.em;

async function buscarSancionesByPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const estado = req.query.estado as EstadoSancion | undefined;
    const sortOrder = req.query.sortOrder as string;
    const sortColumn = req.query.sortColumn as string;
    const filterValue = req.query.filterValue as string;
    const pageSize = Number(req.query.pageSize as string);
    const pageIndex = Number(req.query.pageIndex as string);

    const offset = pageSize * pageIndex;

    let filter = {};
    if (filterValue) {
      Object.assign(filter, { mi_socio_sancion_id: filterValue }); // ver
    }

    let sanciones: Sancion[] = [];
    let total: number = 0;

    if (estado) {
      switch (estado) {
        case "FINALIZADA": {
          const qb = buildSancionesFinalizadasQuery(
            filterValue,
            pageSize,
            offset,
          );
          sanciones = await qb.getResultList();
          total = await qb.getCount();
          break;
        }
        case "REVOCADA": {
          Object.assign(filter, { fechaRevocacion: { $ne: null } });

          [sanciones, total] = await em.findAndCount(Sancion, filter, {
            limit: pageSize,
            offset: offset,
            orderBy: { [sortColumn]: sortOrder },
            populate: ["miLineaPrestamo.miEjemplar.miLibro", "miSocioSancion"],
          });
          break;
        }
        case "VIGENTE": {
          const qb = buildSancionesVigentesQuery(filterValue, pageSize, offset);
          sanciones = await qb.getResultList();
          total = await qb.getCount();
          break;
        }
      }
    } else {
      [sanciones, total] = await em.findAndCount(Sancion, filter, {
        limit: pageSize,
        offset: offset,
        orderBy: { [sortColumn]: sortOrder },
        populate: ["miLineaPrestamo.miEjemplar.miLibro", "miSocioSancion"],
      });
    }
    const sancionesDTO = SancionMapper.toTableDTOList(sanciones);

    res.status(200).json({
      message: "Las sanciones encontradas son:",
      data: sancionesDTO,
      total: total,
    });
  } catch (error: any) {
    next(error);
  }
}

async function bajaSancion(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const sancion = em.getReference(Sancion, id);

    em.assign(sancion, { fechaRevocacion: new Date() });
    await em.flush();

    return res.status(200).json({ message: "Sancion revocada" });
  } catch (error: any) {
    next(error);
  }
}

export { buscarSancionesByPage, bajaSancion };

// Solución intermedia. No ensucia tanto el controller y no obliga a tener que crear un sancion repository.

function buildSancionesFinalizadasQuery(
  filterValue: string,
  pageSize: number,
  offset: number,
) {
  return em
    .createQueryBuilder(Sancion, "s")
    .select("*")
    .joinAndSelect("s.miLineaPrestamo", "lp")
    .joinAndSelect("lp.miEjemplar", "e")
    .joinAndSelect("e.miLibro", "l")
    .joinAndSelect("s.miSocioSancion", "soc")
    .where({ fechaRevocacion: null })
    .andWhere("NOW() >= DATE_ADD(s.fecha_sancion, INTERVAL s.dias_sancion DAY)")
    .andWhere(filterValue ? { miSocioSancion: filterValue } : {})
    .limit(pageSize)
    .offset(offset);
}

function buildSancionesVigentesQuery(
  filterValue: string,
  pageSize: number,
  offset: number,
) {
  return em
    .createQueryBuilder(Sancion, "s")
    .select("*")
    .joinAndSelect("s.miLineaPrestamo", "lp")
    .joinAndSelect("lp.miEjemplar", "e")
    .joinAndSelect("e.miLibro", "l")
    .joinAndSelect("s.miSocioSancion", "soc")
    .where({ fechaRevocacion: null })
    .andWhere("NOW() < DATE_ADD(s.fecha_sancion, INTERVAL s.dias_sancion DAY)")
    .andWhere(filterValue ? { miSocioSancion: filterValue } : {})
    .limit(pageSize)
    .offset(offset);
}
