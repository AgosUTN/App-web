import { Router } from "express";
import {
  buscaLibro,
  altaLibro,
  actualizarLibro,
  bajaLibro,
  buscarLibrosByPage,
  buscaLibroDetail,
} from "./libro.controller.js";
import { ejemplarRouter } from "../ejemplar/ejemplar.routes.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../shared/schemas/schema.paramsId.js";
import {
  libroAltaSchema,
  libroPatchSchema,
} from "../shared/schemas/schemas.libro.js";
import { libroGetByPageSchema } from "../shared/schemas/getByPage/libro.schema.js";

export const libroRouter = Router();

libroRouter.get(
  "/",
  validateInput(undefined, undefined, libroGetByPageSchema),
  buscarLibrosByPage,
);
libroRouter.get(
  "/:id/detail",
  validateInput(schemaParamsId, undefined),
  buscaLibroDetail,
);
libroRouter.get("/:id", validateInput(schemaParamsId, undefined), buscaLibro);
libroRouter.post("/", validateInput(undefined, libroAltaSchema), altaLibro);

libroRouter.patch(
  "/:id",
  validateInput(schemaParamsId, libroPatchSchema),
  actualizarLibro,
);
libroRouter.delete("/:id", validateInput(schemaParamsId, undefined), bajaLibro);

libroRouter.use("/:id/ejemplares", ejemplarRouter); //La validación se hace en ejemplarRouter. IMPORTANTE EL USE.
