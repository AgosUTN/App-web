import { Router } from "express";
import {
  buscarPoliticasSancion,
  altaPoliticaSancion,
  buscarPoliticaSancion,
  bajaPoliticaSancion,
  actualizarPoliticaSancion,
} from "./politicaSancion.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import {
  politicaSancionAltaSchema,
  politicaSancionPatchSchema,
} from "../schemas/schemas.politicaSancion.js";
import { psGetByPageSchema } from "../schemas/getByPage/politicaSancion.schema.js";
export const politicaSancionRouter = Router();

politicaSancionRouter.get(
  "/",
  validateInput(undefined, undefined, psGetByPageSchema),
  buscarPoliticasSancion,
);
politicaSancionRouter.get(
  "/:id",
  validateInput(schemaParamsId, undefined),
  buscarPoliticaSancion,
);

politicaSancionRouter.post(
  "/",
  validateInput(undefined, politicaSancionAltaSchema),
  altaPoliticaSancion,
);

politicaSancionRouter.patch(
  "/:id",
  validateInput(schemaParamsId, politicaSancionPatchSchema),
  actualizarPoliticaSancion,
);

politicaSancionRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaPoliticaSancion,
);
