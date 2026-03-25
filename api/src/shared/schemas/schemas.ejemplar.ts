import { z } from "zod";

const ejemplarAltaSchema = z //  No body.
  .object({})
  .strict();

const ejemplarQuerySchema = z
  .object({
    idSocio: z.coerce.number().int().min(0),
  })
  .strict();

export { ejemplarAltaSchema, ejemplarQuerySchema };
