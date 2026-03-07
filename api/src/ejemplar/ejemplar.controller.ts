import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Ejemplar } from "./ejemplar.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { NotFoundError } from "@mikro-orm/core";
import { EjemplarMapper } from "./ejemplar.mapper.js";

const em = orm.em;

async function altaEjemplarManual(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(Libro, id);

    const idEjemplar = libro.getUltimoCodigoEjemplar() + 1;

    const ejemplar = em.create(Ejemplar, {
      id: idEjemplar,
      miLibro: libro,
    });

    libro.increaseUltimoCodigoEjemplar();
    const ejemplarDTO = EjemplarMapper.toTableDTO(ejemplar);
    await em.flush();

    return res
      .status(201)
      .json({ message: "Ejemplar creado", data: ejemplarDTO });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "No existe el id del libro ingresado" });
    }
    next(error);
  }
}

async function bajaEjemplar(req: Request, res: Response, next: NextFunction) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const idEjemplarRecibida = Number.parseInt(req.params.idEjemplar);
    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      [idEjemplarRecibida, idLibro],
      { populate: ["misLp"] },
    );

    const ejemplarEstado = ejemplar.getEstado();
    switch (ejemplarEstado) {
      case "DISPONIBLE":
        ejemplar.setBajaLogica();
        await em.flush();
        return res.status(200).send({ message: "Ejemplar borrado" });
      case "NUEVO":
        await em.removeAndFlush(ejemplar);
        return res.status(200).send({ message: "Ejemplar borrado" });
      case "ELIMINADO":
        return res
          .status(409)
          .send({
            message: "El ejemplar ya está dado de baja",
            code: "DELETED_EJEMPLAR",
          });
      case "PRESTADO":
        return res
          .status(409)
          .send({
            message: "El ejemplar está prestado",
            code: "BOOKED_EJEMPLAR",
          });
    }
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(200).send({ message: "Ejemplar borrado" }); // 200 para mantener consistencia.
    }
    next(error);
  }
}

async function validarEjemplarPendiente(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const idEjemplar = Number.parseInt(req.params.idEjemplar);
    const ejemplar = await em.findOneOrFail(Ejemplar, [idEjemplar, idLibro], {
      populate: ["misLp.miPrestamo.misLpPrestamo"],
    });
    if (!ejemplar.estasPendiente()) {
      return res
        .status(400)
        .json({ message: "El ejemplar no esta pendiente de devolución" });
    }
    return res
      .status(200)
      .send({ message: "El ejemplar está pendiente de devolución" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).send({ message: "Ejemplar no encontrado" });
    }
    next(error);
  }
}

export { altaEjemplarManual, bajaEjemplar, validarEjemplarPendiente };
