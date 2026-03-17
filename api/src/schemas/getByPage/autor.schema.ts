import { z } from "zod";

export const autorGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["nombrecompleto", "cantlibros", "id"]),
    filterValue: z.string().max(100),
  })
  .strict();
