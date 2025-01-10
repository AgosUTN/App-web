import { Router } from "express";
import { buscarCuota, buscarCuotas } from "./cuota.controller.js";

export const cuotaRouter = Router();

cuotaRouter.get("/", buscarCuotas);
cuotaRouter.get("/:id", buscarCuota);

// Buscar cuota de un socio.
