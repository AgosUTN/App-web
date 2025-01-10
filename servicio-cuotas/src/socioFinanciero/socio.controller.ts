import { Request, Response, NextFunction } from "express";
import { socioRepository } from "./socio.repository.js";

const repository = new socioRepository();

async function buscarSocios(req: Request, res: Response) {
  try {
    return res.status(200).json({ data: await repository.findAll() });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}

async function buscarSocio(req: Request, res: Response) {
  try {
    const socio = await repository.findOne({ id: req.params.id });
    if (!socio) {
      return res.status(404).json({ message: "Socio not found" });
    }
    return res.status(200).json({ data: socio });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
export { buscarSocios, buscarSocio };
