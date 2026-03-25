import { Router } from "express";

import {
  buscarPrestamo,
  buscarPrestamosByPage,
  devolverLibro,
  altaPrestamo,
  altaPrestamoDeadlock,
  buscarPrestamoByEjemplar,
} from "./prestamo.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  devolverLibroParams,
  devolverLibroRequest,
  getByEjemplarSchema,
} from "../shared/schemas/schemas.prestamo.js";
import { prestamoAltaSchema } from "../shared/schemas/schemas.prestamo.js";
import { deadlockTestSchema } from "../shared/schemas/testConcurrencia.schema.js";
import { prestamoGetByPageSchema } from "../shared/schemas/getByPage/prestamo.schema.js";
import { schemaParamsId } from "../shared/schemas/schema.paramsId.js";
import { verifyToken } from "../middlewares/middleware.authentication.js";
import { verifyRol } from "../middlewares/middleware.authorization.js";

export const prestamoRouter = Router({ mergeParams: true });

prestamoRouter.get(
  "/:id/detail",
  verifyToken,
  verifyRol("ADMIN", "USER"),
  validateInput(schemaParamsId, undefined),
  buscarPrestamo,
);
prestamoRouter.get(
  "/detail",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(undefined, undefined, getByEjemplarSchema),
  buscarPrestamoByEjemplar,
);
prestamoRouter.get(
  "/",
  verifyToken,
  verifyRol("ADMIN", "USER"),
  validateInput(undefined, undefined, prestamoGetByPageSchema),
  buscarPrestamosByPage,
);
prestamoRouter.post(
  "/deadlockTest",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(undefined, prestamoAltaSchema, deadlockTestSchema),
  altaPrestamoDeadlock,
);
prestamoRouter.post(
  "/",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(undefined, prestamoAltaSchema),
  altaPrestamo,
);

prestamoRouter.patch(
  "/:id/lineas/:idLP/devolver",
  verifyToken,
  verifyRol("ADMIN"),
  validateInput(devolverLibroParams, devolverLibroRequest),
  devolverLibro,
);

// Cuando cree lo del user, quizás cree nuevos endpoints.
