import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { autorRouter } from "./autor/autor.routes.js";
import { orm, syncSchema } from "./shared/DB/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { editorialRouter } from "./editorial/editorial.routes.js";
import { libroRouter } from "./libro/libro.routes.js";
import { politicaBibliotecaRouter } from "./politicaBiblioteca/politicaBiblioteca.routes.js";
import { politicaSancionRouter } from "./politicaSancion/politicaSancion.routes.js";
import { socioRouter } from "./socio/socio.routes.js";
import { prestamoRouter } from "./prestamo/prestamo.routes.js";
import { handleJsonSyntaxError } from "./middlewares/middleware.handleJsonSyntaxError.js";
import { handleInternalError } from "./middlewares/middleware.handleInternalError.js";
import { sancionRouter } from "./sancion/sancion.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { verifyToken } from "./middlewares/middleware.authentication.js";
import { verifyRol } from "./middlewares/middleware.authorization.js";
import { userRouter } from "./users/user.routes.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(handleJsonSyntaxError);

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/autores", verifyToken, verifyRol("ADMIN"), autorRouter);
app.use("/api/editoriales", verifyToken, verifyRol("ADMIN"), editorialRouter);
app.use("/api/libros", verifyToken, verifyRol("ADMIN"), libroRouter);
app.use(
  "/api/politicaBiblioteca",
  verifyToken,
  verifyRol("ADMIN"),
  politicaBibliotecaRouter,
);
app.use(
  "/api/politicasSancion",
  verifyToken,
  verifyRol("ADMIN"),
  politicaSancionRouter,
);
app.use("/api/socios", verifyToken, verifyRol("ADMIN"), socioRouter);
app.use("/api/prestamos", prestamoRouter);
app.use("/api/sanciones", sancionRouter);
app.use("/api/users", userRouter);

app.use(handleInternalError);

app.use((_, res) => {
  return res.status(404).json({
    message: "Recurso no encontrado",
    code: "NOT_FOUND",
  });
});

await syncSchema(); // Sacar en producción.

httpServer.listen(process.env.API_PORT, () =>
  console.log("Running on port 3000"),
);
