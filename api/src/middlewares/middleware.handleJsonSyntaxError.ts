import { Request, Response, NextFunction } from "express";

export function handleJsonSyntaxError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof SyntaxError && "body" in err) {
    console.error(err);
    return res.status(400).json({
      message: "JSON inválido: " + err.message,
      code: "INVALID_JSON",
    });
  }
  next(err);
}
