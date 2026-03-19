import { Router } from "express";

import {
  actualizarPoliticaBiblioteca,
  buscarPoliticaBiblioteca,
} from "./politicaBiblioteca.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { politicaBibliotecaPatchSchema } from "../schemas/schemas.politicaBiblioteca.js";

export const politicaBibliotecaRouter = Router();

politicaBibliotecaRouter.get("/", buscarPoliticaBiblioteca);

politicaBibliotecaRouter.patch(
  "/",
  validateInput(undefined, politicaBibliotecaPatchSchema),
  actualizarPoliticaBiblioteca,
);
