import { z } from "zod";

export const psGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["diasHasta", "diasSancion"]),
    filterValue: z.coerce.number().min(-1),
  })
  .strict();
