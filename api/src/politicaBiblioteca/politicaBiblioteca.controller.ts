import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { PoliticaBiblioteca } from "./politicaBiblioteca.entity.js";
import { NotFoundError } from "@mikro-orm/core";
import { PoliticaBibliotecaMapper } from "./politicaBiblioteca.mapper.js";

const em = orm.em;

async function buscarPoliticaBiblioteca(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const politica = await em.findOneOrFail(PoliticaBiblioteca, {
      id: 1,
    });
    const politicaDTO = PoliticaBibliotecaMapper.toReadDTO(politica);
    return res.status(200).json({
      message: "La politica de biblioteca actual es: ",
      data: politicaDTO,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(500).json({
        message: "Politica de biblioteca inaccesible",
        code: "SYSTEM_CONFIGURATION_ERROR",
      });
    }
    next(error);
  }
}

async function actualizarPoliticaBiblioteca( // No es cacheada.
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const politica = em.getReference(PoliticaBiblioteca, 1);
    em.assign(politica, req.body);
    await em.flush();
    return res
      .status(200)
      .json({ message: "Politica de biblioteca actualizada" });
  } catch (error: any) {
    next(error);
  }
}

export { buscarPoliticaBiblioteca, actualizarPoliticaBiblioteca };
