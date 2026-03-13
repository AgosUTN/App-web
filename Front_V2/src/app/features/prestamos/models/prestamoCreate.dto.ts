import { EjemplarPrestamoDTO } from '../../libros/models/ejemplarPrestamo.dto';

export interface PrestamoCreateDTO {
  idSocio: number;
  ejemplares: EjemplarPrestamoDTO[];
}
