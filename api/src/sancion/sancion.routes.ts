import { Router } from "express";
import {
  buscarSanciones,
  buscarSancion,
  bajaSancion,
} from "./sancion.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";

export const sancionRouter = Router({ mergeParams: true });

sancionRouter.get("/", buscarSanciones);

sancionRouter.get(
  "/:id",
  validateInput(schemaParamsId, undefined),
  buscarSancion,
);
sancionRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaSancion,
);
