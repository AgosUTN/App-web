import { z } from "zod";

export const prestamoAltaSchema = z
  .object({
    idSocio: z.number().int().gt(0),
    ejemplares: z
      .array(
        z.object({
          idEjemplar: z.number().int().gt(0),
          idLibro: z.number().int().gt(0),
        }),
      )
      .min(1),
  })
  .strict();
