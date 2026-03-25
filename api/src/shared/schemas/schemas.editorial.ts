import { z } from "zod";

const editorialAltaSchema = z
  .object({
    nombre: z.string().max(30),
  })
  .strict();

const editorialPatchSchema = z
  .object({
    nombre: z.string().max(30),
  })
  .strict();

export { editorialAltaSchema, editorialPatchSchema };
