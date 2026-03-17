import { z } from "zod";

export const prestamoGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["fechaPrestamo"]),
    filterValue: z.coerce.number().int().min(0).optional(),
    estado: z.enum(["PENDIENTE", "FINALIZADO"]).optional(),
  })
  .strict();
