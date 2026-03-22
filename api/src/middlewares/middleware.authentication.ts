import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Token requerido", code: "INVALID_TOKEN" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Token inválido", code: "INVALID_TOKEN" });
  }
}
