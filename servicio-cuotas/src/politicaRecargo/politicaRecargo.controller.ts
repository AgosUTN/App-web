import { Request, Response } from "express";
import { politicaRepository } from "./politicaRecargo.repository.js";

const repository = new politicaRepository();

async function buscarPoliticas(req: Request, res: Response) {
  try {
    return res.status(200).json({ data: await repository.findAll() });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function buscarPolitica(req: Request, res: Response) {
  try {
    const { id, dias } = req.query;
    if (id) {
      const politica = await repository.findOne({ id: id as string });
      if (!politica)
        return res.status(404).json({ message: "Politica no encontrada" });
      return res.status(200).json({ data: politica });
    } else if (dias) {
      const politica = await repository.findOneByDays({ id: dias as string });
      if (!politica)
        return res.status(404).json({ message: "Politica no encontrada" });
      return res.status(200).json({ data: politica });
    }
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function actualizarPolitica(req: Request, res: Response) {
  try {
    const politica = await repository.update(req.params.id, req.body);

    if (!politica) {
      return res.status(404).json({ message: "Politica no encontrada" });
    }

    return res
      .status(200)
      .send({ message: "Politica actualizada con éxito", data: politica });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function altaPolitica(req: Request, res: Response) {
  try {
    const politica = await repository.add(req.body);
    return res
      .status(201)
      .send({ message: "Politica creada con éxito", data: politica });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Ya existe una politica de recargo con esa cantidad de dias hasta",
      });
    }
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}
async function bajaPolitica(req: Request, res: Response) {
  try {
    const politica = await repository.delete({ id: req.params.id });
    return res
      .status(200)
      .send({ message: "Politica eliminada con éxito", data: politica });
  } catch (error: any) {
    return res.status(500).json({ message: "ERROR INTERNO", error: error });
  }
}

export {
  buscarPoliticas,
  buscarPolitica,
  actualizarPolitica,
  altaPolitica,
  bajaPolitica,
};
