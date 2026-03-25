import { z } from "zod";

const autorAltaSchema = z
  .object({
    nombrecompleto: z.string(),
  })
  .strict();

const autorPatchSchema = z
  .object({
    nombrecompleto: z.string().max(100).optional(),
  })
  .strict();

export { autorAltaSchema, autorPatchSchema };
