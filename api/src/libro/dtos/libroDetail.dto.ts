import { EstadoEjemplar } from "../../ejemplar/estadoEjemplar.type";

export interface LibroDetailDTO {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  ejemplares: { idEjemplar: number; estado: EstadoEjemplar }[];
  editorial: string;
}
