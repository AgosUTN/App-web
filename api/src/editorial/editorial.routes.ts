import { Router } from "express";
import {
  altaEditorial,
  actualizarEditorial,
  bajaEditorial,
  buscarEditorialesByPage,
  buscarEditorial,
} from "./editorial.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  editorialAltaSchema,
  editorialPatchSchema,
} from "../schemas/schemas.editorial.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { editorialGetByPageSchema } from "../schemas/getByPage/editorial.schema.js";
export const editorialRouter = Router();

editorialRouter.get(
  "/byPage",
  validateInput(undefined, undefined, editorialGetByPageSchema),
  buscarEditorialesByPage,
);
editorialRouter.get(
  "/:id",
  validateInput(schemaParamsId, undefined),
  buscarEditorial,
);

editorialRouter.post(
  "/",
  validateInput(undefined, editorialAltaSchema),
  altaEditorial,
);

editorialRouter.patch(
  "/:id",
  validateInput(schemaParamsId, editorialPatchSchema),
  actualizarEditorial,
);
editorialRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaEditorial,
);
