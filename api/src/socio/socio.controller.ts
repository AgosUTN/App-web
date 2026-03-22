import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Socio } from "./socio.entity.js";
import { NotFoundError } from "@mikro-orm/core";
import { PoliticaBiblioteca } from "../politicaBiblioteca/politicaBiblioteca.entity.js";

const em = orm.em;

async function buscarSocios(req: Request, res: Response, next: NextFunction) {
  try {
    const socios = await em.find(Socio, {});
    return res.status(200).json({
      message: "Socios encontrados: ",
      data: socios,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(Socio, { id });
    return res.status(200).json({
      message: "Socio encontrado: ",
      data: socio,
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
    const socioCreado = em.create(Socio, req.body);
    await em.flush();
    return res.status(201).json({ message: "Socio creado", data: socioCreado });
  } catch (error: any) {
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
      socio.setBajaLogica();
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
  buscarSocios,
  buscarSocio,
  altaSocio,
  actualizarSocio,
  bajaSocio,
  validarSocio,
};
