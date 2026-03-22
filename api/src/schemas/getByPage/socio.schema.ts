import { z } from "zod";

export const socioGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["id"]),
    filterValue: z.string().max(50),
  })
  .strict();
