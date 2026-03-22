import { z } from "zod";

const socioAltaSchema = z
  .object({
    socio: z.object({
      nombre: z.string().max(50),
      apellido: z.string().max(50),
      domicilio: z.string().max(50),
      telefono: z.string().max(20),
    }),
    user: z.object({
      email: z.string().email().max(50),
      password: z.string().max(30),
    }),
  })
  .strict();

const socioPatchSchema = z
  .object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    domicilio: z.string().optional(),
    telefono: z.string().optional(),
  })
  .strict();

export { socioAltaSchema, socioPatchSchema };
