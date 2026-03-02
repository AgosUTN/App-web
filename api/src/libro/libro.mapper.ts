import { Libro } from "./libro.entity";

export class LibroMapper {
  static toTableDTO(libro: Libro) {
    return {
      id: libro.id,
      titulo: libro.titulo,
      editorial: {
        id: libro.miEditorial.id,
        nombre: libro.miEditorial.nombre,
      },
      autor: {
        id: libro.misAutores[0].id,
        nombre: libro.misAutores[0].nombre,
      },
    };
  }
  static toTableDTOList(libros: Libro[]) {
    return libros.map((libro) => this.toTableDTO(libro));
  }
}
