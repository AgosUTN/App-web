import { z } from "zod";

export const libroGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["titulo", "cantprestamos", "id", "autor"]),
    filterValue: z.string().max(15),
  })
  .strict();
