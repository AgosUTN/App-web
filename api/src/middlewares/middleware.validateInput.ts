import { ZodError, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateInput(
  schemaReq?: ZodObject<any, any>,
  schemaBody?: ZodObject<any, any>,
) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (schemaReq) {
        schemaReq.parse(req.params);
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Request params inválidos: " + error.message,
          code: "VALIDATION_ERROR",
        });
      }
      next(error); // Pasa el error a handleInternalError
    }
    try {
      if (schemaBody) {
        schemaBody.parse(req.body);
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Request body inválido: " + error.message,
          codigo: "VALIDATION_ERROR",
        });
      }
      next(error);
    }
    next(); // Si no hay error en la validación, sigue flujo.
  };
}

// El uso de una high order function es "opcional", pero queda más legible. Lo puedo explicar mejor en la defensa.
