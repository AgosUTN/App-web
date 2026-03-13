import { EjemplarPrestamoDTO } from "../../ejemplar/dtos/ejemplarPrestamo.dto";

export interface PrestamoCreateDTO {
  idSocio: number;
  ejemplares: EjemplarPrestamoDTO[];
}
