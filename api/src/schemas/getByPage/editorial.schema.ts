import { z } from "zod";

export const editorialGetByPageSchema = z
  .object({
    pageIndex: z.coerce.number().int().min(0), // Lo transforma a número. Los que vienen en req.body ya son numeros.
    pageSize: z.coerce.number().int().min(1),
    sortOrder: z.enum(["asc", "desc"]),
    sortColumn: z.enum(["nombre", "cantlibros", "id"]),
    filterValue: z.string().max(15), // Puede estar vacio, pero mínimo  viene el query param con value "", por eso no es opcional.
  })
  .strict();
