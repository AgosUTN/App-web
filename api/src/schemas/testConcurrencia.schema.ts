import { z } from "zod";

export const deadlockTestSchema = z
  .object({
    reverse: z.coerce.boolean(),
  })
  .strict();
