import { ZodError, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateInput(
  schemaParams?: ZodObject<any>,
  schemaBody?: ZodObject<any>,
  schemaQuery?: ZodObject<any>,
) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (schemaParams) {
        req.params = schemaParams.parse(req.params);
      }

      if (schemaBody) {
        req.body = schemaBody.parse(req.body);
      }

      if (schemaQuery) {
        req.query = schemaQuery.parse(req.query);
      }

      next(); // Si no hay error se sigue el flujo.
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: error.message,
          code: "VALIDATION_ERROR",
        });
      }

      next(error); // Si no es error de Zod, se lo pasa al HandleInternalError.
    }
  };
}

// El uso de una high order function es "opcional", pero queda más legible. Lo puedo explicar mejor en la defensa.
