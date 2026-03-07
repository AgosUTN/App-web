import { EjemplarTableDTO } from './ejemplarTable.dto';

export interface LibroDetailDTO {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  ejemplares: EjemplarTableDTO[];
  editorial: string;
}
