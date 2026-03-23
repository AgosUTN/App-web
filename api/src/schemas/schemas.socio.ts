import { z } from "zod";

const socioAltaSchema = z
  .object({
    nombre: z.string().min(3).max(50),
    apellido: z.string().max(50),
    domicilio: z.string().max(50),
    telefono: z.string().min(4).max(20),
    email: z.string().email().max(50),
  })
  .strict();

const socioPatchSchema = z
  .object({
    nombre: z.string().min(3).max(50).optional(),
    apellido: z.string().max(50).optional(),
    domicilio: z.string().max(50).optional(),
    telefono: z.string().min(4).max(20).optional(),
  })
  .strict();

export { socioAltaSchema, socioPatchSchema };
