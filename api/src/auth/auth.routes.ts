import { Router } from "express";
import { logOut, loguearUsuario, verificarToken } from "./auth.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaLogin } from "../shared/schemas/schemas.auth.js";
import { verifyToken } from "../middlewares/middleware.authentication.js";

export const authRouter = Router();

//authRouter.post("/admin", crearUsuarioADMIN);

authRouter.post(
  "/login",
  validateInput(undefined, schemaLogin),
  loguearUsuario,
); // ENDPOINT PÚBLICO.
authRouter.post("/logout", logOut); // ENDPOINT PÚBLICO.
authRouter.get("/verify", verifyToken, verificarToken);
