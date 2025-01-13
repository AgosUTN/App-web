import { Router } from "express";
import {
  buscarPoliticaCuota,
  actualizarPoliticaCuota,
} from "./politicaCuota.controller.js";

export const politicaCuotaRouter = Router();

politicaCuotaRouter.get("/", buscarPoliticaCuota);
politicaCuotaRouter.patch("/", actualizarPoliticaCuota);
