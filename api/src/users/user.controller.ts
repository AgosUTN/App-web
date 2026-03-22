import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";

const em = orm.em;

async function cambiarContrasenia(
  req: Request,
  res: Response,
  next: NextFunction,
) {}

export { cambiarContrasenia };
