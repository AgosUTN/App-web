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

export const getByEjemplarSchema = z
  .object({
    idEjemplar: z.coerce.number().int().gt(0),
    idLibro: z.coerce.number().int().gt(0),
  })
  .strict();

export const devolverLibroRequest = z
  .object({
    idSocio: z.number().int().gt(0),
    idEjemplar: z.number().int().gt(0),
    idLibro: z.number().int().gt(0),
  })
  .strict();

export const devolverLibroParams = z
  .object({
    id: z.coerce.number().int().gt(0),
    idLP: z.coerce.number().int().gt(0),
  })
  .strict();
