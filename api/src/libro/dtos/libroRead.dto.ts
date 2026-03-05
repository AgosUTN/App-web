export interface LibroReadDTO {
  id: number;
  titulo: string;
  isbn: string;
  descripcion: string;
  cantejemplares: number;
  editorial: {
    id: number;
    nombre: string;
  };

  autor: {
    id: number;
    nombreCompleto: string;
  };
}
