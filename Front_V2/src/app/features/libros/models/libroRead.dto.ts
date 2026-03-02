export interface LibroReadDTO {
  id: number;
  titulo: string;
  isbn: string;
  descripcion: string;
  editorial: {
    id: number;
    nombre: string;
  };

  autor: {
    id: number;
    nombre: string;
  };
}
// Este DTO es para el libro que se muestra en la pantalla de Editar.
// El de Detail es para el modal, y el table para la tabla.
