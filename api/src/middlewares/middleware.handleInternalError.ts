import { Request, Response, NextFunction } from "express";

export function handleInternalError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.stack);
  return res.status(500).json({
    message: "Error interno del servidor",
    code: "INTERNAL_ERROR",
  });
}
