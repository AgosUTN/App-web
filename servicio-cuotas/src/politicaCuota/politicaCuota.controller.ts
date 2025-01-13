import { Request, Response } from "express";

import { PoliticaCuotaRepository } from "./politicaCuota.repository.js";

const repository = new PoliticaCuotaRepository();

async function buscarPoliticaCuota(req: Request, res: Response) {
  try {
    const politicaCuota = await repository.findOne();
    if (!politicaCuota) {
      return res.status(500).send({ message: "PoliticaCuota inaccesible" });
    }
    res.status(200).json({ data: politicaCuota });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function actualizarPoliticaCuota(req: Request, res: Response) {
  try {
    const politicaCuota = await repository.update(req.body);

    if (!politicaCuota) {
      return res.status(500).json({ message: "PoliticaCuota inaccesible" });
    }

    return res.status(200).send({
      message: "PoliticaCuota actualizada con éxito",
      data: politicaCuota,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
export { buscarPoliticaCuota, actualizarPoliticaCuota };
