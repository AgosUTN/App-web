import { Router } from "express";
import {
  buscarSocio,
  altaSocio,
  buscarSociosByPage,
  bajaSocio,
  actualizarSocio,
  validarSocio,
  buscarSocioDetail,
} from "./socio.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { socioAltaSchema, socioPatchSchema } from "../schemas/schemas.socio.js";
import { socioGetByPageSchema } from "../schemas/getByPage/socio.schema.js";
import { verifyToken } from "../middlewares/middleware.authentication.js";
import { verifyRol } from "../middlewares/middleware.authorization.js";

export const socioRouter = Router();

socioRouter.get(
  "/",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(undefined, undefined, socioGetByPageSchema),
  buscarSociosByPage,
);
socioRouter.get(
  "/:id/validate",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(schemaParamsId, undefined),
  validarSocio,
);
socioRouter.get(
  "/:id/detail",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(schemaParamsId, undefined),
  buscarSocioDetail,
);
socioRouter.get(
  "/:id",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(schemaParamsId, undefined),
  buscarSocio,
);

socioRouter.post(
  "/",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(undefined, socioAltaSchema),
  altaSocio,
);
socioRouter.patch(
  "/:id",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(schemaParamsId, socioPatchSchema),
  actualizarSocio,
);
socioRouter.delete(
  "/:id",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(schemaParamsId, undefined),
  bajaSocio,
);
