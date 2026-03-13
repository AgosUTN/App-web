import { Router } from "express";

import {
  buscarPrestamos,
  buscarPrestamosSocio,
  buscarEjemplaresPendientesSocio,
  devolverLibroD,
  altaPrestamo,
} from "./prestamo.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  devolverLibroParams,
  devolverLibroRequest,
} from "../schemas/schemas.casosDeUso.js";
import { prestamoAltaSchema } from "../schemas/schemas.prestamo.js";
export const prestamoRouter = Router({ mergeParams: true });

prestamoRouter.post(
  "/",
  validateInput(undefined, prestamoAltaSchema),
  altaPrestamo,
);

// prestamoRouter.patch("/devolverLibro", devolverLibro);  DEPRECADO.

// Rutas nuevas/ desacopladas

prestamoRouter.get("/", (req, res, next) => {
  // Puede venir desde /socios/:id/prestamos o desde /prestamos.
  const { id } = req.params as { id?: string };
  if (id) {
    return buscarPrestamosSocio(req, res, next);
  }
  return buscarPrestamos(req, res, next);
});
prestamoRouter.get(
  "/listarEjemplaresPendientes",
  buscarEjemplaresPendientesSocio,
); // Podria moverse a ejemplares quizas. (Actualmente esta anidada a socio) No hay query params, no tiene sentido.

prestamoRouter.patch(
  "/:id/lineas/:idLP/devolver",
  validateInput(devolverLibroParams, devolverLibroRequest),
  devolverLibroD,
); // Linea préstamo no tiene controlador ni rutas, por eso el endpoint este.

/* Query Params para buscarPrestamos y buscarPrestamosSocio:
/prestamos?estadoPrestamo=Pendiente
/prestamos?estadoPrestamo=Finalizado
*/
