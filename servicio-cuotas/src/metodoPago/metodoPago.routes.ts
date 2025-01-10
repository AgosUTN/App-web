import { Router } from "express";
import {
  actualizarMetodo,
  buscarMetodo,
  buscarMetodos,
} from "./metodoPago.controller.js";

export const metodoPagoRouter = Router();

metodoPagoRouter.get("/", buscarMetodos);
metodoPagoRouter.get("/:id", buscarMetodo);
metodoPagoRouter.patch("/:id", actualizarMetodo);
