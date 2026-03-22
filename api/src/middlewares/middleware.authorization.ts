import { Request, Response, NextFunction } from "express";
import { Rol } from "../auth/rol.type";

export function verifyRol(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = (req as any).user.rol;
    if (!roles.includes(rol)) {
      return res.status(403).json({ message: "Permiso denegado" });
    }
    next();
  };
}
