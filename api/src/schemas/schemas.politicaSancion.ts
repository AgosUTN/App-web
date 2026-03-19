import { z } from "zod";

export const politicaSancionAltaSchema = z
  .object({
    diasHasta: z.number().int().gt(0),
    diasSancion: z.number().int().gt(-1), // Debe ser mayor a 0, pero lo valido en el controlador por ser regla de negocio.
  })
  .strict();

export const politicaSancionPatchSchema = z
  .object({
    diasSancion: z.number().int().gt(0).optional(),
  })
  .strict();
