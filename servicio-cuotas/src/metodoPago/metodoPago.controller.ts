import { Request, Response } from "express";
import { metodoPagoRepository } from "./metodoPago.repository.js";

const repository = new metodoPagoRepository();

async function buscarMetodos(req: Request, res: Response) {
  try {
    return res.status(200).json({ data: await repository.findAll() });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function buscarMetodo(req: Request, res: Response) {
  try {
    const metodoPago = await repository.findOne({ id: req.params.id });
    if (!metodoPago) {
      return res.status(404).send({ message: "metodoPago no encontrado" });
    }
    res.status(200).json({ data: metodoPago });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function actualizarMetodo(req: Request, res: Response) {
  try {
    const metodo = await repository.update(req.params.id, req.body);

    if (!metodo) {
      return res.status(404).json({ message: "Metodo no encontrado" });
    }

    return res
      .status(200)
      .send({ message: "Metodo de pago actualizado con éxito", data: metodo });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
export { buscarMetodos, buscarMetodo, actualizarMetodo };
