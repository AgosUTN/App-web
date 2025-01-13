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

async function pagarCuota(req: Request, res: Response) {
  try {
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}

export { buscarCuotas, buscarCuota };

// CU PAGAR CUOTA

/*
1 - Validar que exista socio
2 - Validar que tenga una cuota pendiente
3 - Encontrar la cuota más antigua sin pago
4 - Si existe más de una cuota sin pagar, aplicar recargo correspondiente
5 - Registrar pago

*/
