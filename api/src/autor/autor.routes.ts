import { Router } from "express";
import {
  buscarAutoresByPage,
  buscaAutor,
  altaAutor,
  actualizarAutor,
  bajaAutor,
} from "./autor.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { autorAltaSchema, autorPatchSchema } from "../schemas/schemas.autor.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { autorGetByPageSchema } from "../schemas/getByPage/autor.schema.js";
export const autorRouter = Router();

autorRouter.get(
  "/",
  validateInput(undefined, undefined, autorGetByPageSchema),
  buscarAutoresByPage,
);
autorRouter.get("/:id", validateInput(schemaParamsId, undefined), buscaAutor);
autorRouter.post("/", validateInput(undefined, autorAltaSchema), altaAutor);
autorRouter.patch(
  "/:id",
  validateInput(schemaParamsId, autorPatchSchema),
  actualizarAutor,
);
autorRouter.delete("/:id", validateInput(schemaParamsId, undefined), bajaAutor);
