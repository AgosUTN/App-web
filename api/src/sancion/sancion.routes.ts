import { Router } from "express";
import { buscarSancionesByPage, bajaSancion } from "./sancion.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { sancionGetByPageSchema } from "../schemas/getByPage/sancion.schema.js";

export const sancionRouter = Router({ mergeParams: true });

sancionRouter.get(
  "/",
  validateInput(undefined, undefined, sancionGetByPageSchema),
  buscarSancionesByPage,
);

sancionRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaSancion,
);
