import { Router } from "express";

import { validateInput } from "../middlewares/middleware.validateInput.js";

import { verifyToken } from "../middlewares/middleware.authentication.js";
import { cambiarContrasenia } from "./user.controller.js";
import { verifyRol } from "../middlewares/middleware.authorization.js";

export const userRouter = Router();

userRouter.patch(
  "/",
  verifyToken,
  verifyRol("ADMIN", "USER"),
  cambiarContrasenia,
); // Falta validate input
