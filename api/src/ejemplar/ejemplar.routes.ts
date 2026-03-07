import { Router } from "express";
import {
  altaEjemplarManual,
  bajaEjemplar,
  validarEjemplarPendiente,
} from "./ejemplar.controller.js";
import { ejemplarAltaSchema } from "../schemas/schemas.ejemplar.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsIdEjemplar } from "../schemas/schema.paramsId.js";
export const ejemplarRouter = Router({ mergeParams: true });

ejemplarRouter.post(
  "/",
  validateInput(undefined, ejemplarAltaSchema),
  altaEjemplarManual,
);

ejemplarRouter.delete(
  "/:idEjemplar",
  validateInput(schemaParamsIdEjemplar, undefined),
  bajaEjemplar,
);
ejemplarRouter.get(
  "/:idEjemplar/pendiente",
  validateInput(schemaParamsIdEjemplar, undefined),
  validarEjemplarPendiente,
);
