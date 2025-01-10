import { Request, Response } from "express";
import { cuotaRepository } from "./cuota.repository.js";

const repository = new cuotaRepository();

async function buscarCuotas(req: Request, res: Response) {
  try {
    return res.status(200).json({ data: await repository.findAll() });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function buscarCuota(req: Request, res: Response) {
  try {
    return res
      .status(200)
      .json({ data: await repository.findOne({ id: req.params.id }) });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}

export { buscarCuotas, buscarCuota };
