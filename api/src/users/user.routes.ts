import { Router } from "express";
import {
  crearUsuarioADMIN,
  crearUsuarioUSER,
  logOut,
  loguearUsuario,
  verificarToken,
} from "./user.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaLogin } from "../schemas/schemas.user.js";
import { verifyToken } from "../middlewares/middleware.authentication.js";

export const userRouter = Router();

userRouter.post("/user", crearUsuarioUSER);
userRouter.post("/admin", crearUsuarioADMIN);
userRouter.post(
  "/login",
  validateInput(undefined, schemaLogin),
  loguearUsuario,
); // ENDPOINT PÚBLICO.
userRouter.post("/logout", logOut);
userRouter.get("/verify", verifyToken, verificarToken);
