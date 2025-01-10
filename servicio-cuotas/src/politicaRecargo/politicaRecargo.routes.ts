import { Router } from "express";
import {
  actualizarPolitica,
  altaPolitica,
  bajaPolitica,
  buscarPolitica,
  buscarPoliticas,
} from "./politicaRecargo.controller.js";

export const politicaRouter = Router();

politicaRouter.get("/", buscarPoliticas);
politicaRouter.get("/buscar", buscarPolitica);
// GET /buscar?id=1
// GET /buscar?dias=30

politicaRouter.patch("/:id", actualizarPolitica);
politicaRouter.put("/", altaPolitica);
politicaRouter.delete("/:id", bajaPolitica);
