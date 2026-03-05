import { EjemplarTableDTO } from './ejemplarTable.dto';

export interface LibroDetailDTO {
  titulo: string;
  descripcion: string;
  isbn: string;
  ejemplares: EjemplarTableDTO[];
  editorial: string;
}
