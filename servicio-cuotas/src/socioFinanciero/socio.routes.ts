import { Router } from "express";
import { buscarSocio, buscarSocios } from "./socio.controller.js";

export const socioRouter = Router();

socioRouter.get("/", buscarSocios);
socioRouter.get("/:id", buscarSocio);
