import { z } from "zod";

const politicaBibliotecaPatchSchema = z
  .object({
    diasSancionMaxima: z.number().int().gt(0).optional(),
    diasPrestamo: z.number().int().gt(0).optional(),
    cantPendientesMaximo: z.number().int().gt(0).optional(),
  })
  .strict();
export { politicaBibliotecaPatchSchema };
