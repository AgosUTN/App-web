import { Router } from "express";
import { buscarSancionesByPage, bajaSancion } from "./sancion.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { sancionGetByPageSchema } from "../schemas/getByPage/sancion.schema.js";
import { verifyToken } from "../middlewares/middleware.authentication.js";
import { verifyRol } from "../middlewares/middleware.authorization.js";

export const sancionRouter = Router({ mergeParams: true });

sancionRouter.get(
  "/",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(undefined, undefined, sancionGetByPageSchema),
  buscarSancionesByPage,
);

sancionRouter.delete(
  "/:id",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(schemaParamsId, undefined),
  bajaSancion,
);
