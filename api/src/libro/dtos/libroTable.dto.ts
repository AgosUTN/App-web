export interface LibroTableDTO {
  id: number;
  titulo: string;

  editorial: {
    id: number;
    nombre: string;
  };

  autor: {
    id: number;
    nombre: string;
  };
}
