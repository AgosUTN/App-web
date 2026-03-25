import { Router } from "express";
import {
  altaEjemplarManual,
  bajaEjemplar,
  validarEjemplarParaPrestamo,
  validarEjemplarPendiente,
} from "./ejemplar.controller.js";
import {
  ejemplarAltaSchema,
  ejemplarQuerySchema,
} from "../shared/schemas/schemas.ejemplar.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsIdEjemplar } from "../shared/schemas/schema.paramsId.js";
export const ejemplarRouter = Router({ mergeParams: true });

ejemplarRouter.get(
  "/:idEjemplar/loanable",
  validateInput(schemaParamsIdEjemplar, undefined, ejemplarQuerySchema),
  validarEjemplarParaPrestamo,
); // Usa como query param el idSocio.

ejemplarRouter.get(
  "/:idEjemplar/pendiente",
  validateInput(schemaParamsIdEjemplar, undefined),
  validarEjemplarPendiente,
);

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
