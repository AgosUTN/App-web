import { z } from "zod";

export const sancionGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["fechaSancion"]), // Considerar fechaFin (requiere otro query)
    filterValue: z.coerce.number().int().min(0).optional(),
    estado: z.enum(["REVOCADA", "VIGENTE", "FINALIZADA"]).optional(),
  })
  .strict();
