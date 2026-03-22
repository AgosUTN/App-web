import { z } from "zod";

export const schemaLogin = z
  .object({ email: z.string(), password: z.string() })
  .strict();
