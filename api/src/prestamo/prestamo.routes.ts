import { Router } from "express";

import {
  buscarPrestamo,
  buscarPrestamosByPage,
  devolverLibro,
  altaPrestamo,
  altaPrestamoDeadlock,
} from "./prestamo.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  devolverLibroParams,
  devolverLibroRequest,
} from "../schemas/schemas.casosDeUso.js";
import { prestamoAltaSchema } from "../schemas/schemas.prestamo.js";
import { deadlockTestSchema } from "../schemas/testConcurrencia.schema.js";
import { prestamoGetByPageSchema } from "../schemas/getByPage/prestamo.schema.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";

export const prestamoRouter = Router({ mergeParams: true });

prestamoRouter.get(
  "/:id/detail",
  validateInput(schemaParamsId, undefined),
  buscarPrestamo,
);
prestamoRouter.get(
  "/",
  validateInput(undefined, undefined, prestamoGetByPageSchema),
  buscarPrestamosByPage,
);
prestamoRouter.post(
  "/deadlockTest",
  validateInput(undefined, prestamoAltaSchema, deadlockTestSchema),
  altaPrestamoDeadlock,
);
prestamoRouter.post(
  "/",
  validateInput(undefined, prestamoAltaSchema),
  altaPrestamo,
);

prestamoRouter.patch(
  "/:id/lineas/:idLP/devolver",
  validateInput(devolverLibroParams, devolverLibroRequest),
  devolverLibro,
);
