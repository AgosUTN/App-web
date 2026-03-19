import { Router } from "express";
import {
  buscarSocio,
  altaSocio,
  buscarSocios,
  bajaSocio,
  actualizarSocio,
  validarSocio,
} from "./socio.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { socioAltaSchema, socioPatchSchema } from "../schemas/schemas.socio.js";

export const socioRouter = Router();

socioRouter.get("/", buscarSocios);
socioRouter.get(
  "/:id/validate",
  validateInput(schemaParamsId, undefined),
  validarSocio,
);
socioRouter.get("/:id", validateInput(schemaParamsId, undefined), buscarSocio);

socioRouter.post("/", validateInput(undefined, socioAltaSchema), altaSocio);
socioRouter.patch(
  "/:id",
  validateInput(schemaParamsId, socioPatchSchema),
  actualizarSocio,
);
socioRouter.delete("/:id", validateInput(schemaParamsId, undefined), bajaSocio);
