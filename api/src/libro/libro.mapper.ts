import { LibroDetailDTO } from "./dtos/libroDetail.dto";
import { LibroReadDTO } from "./dtos/libroRead.dto";
import { Libro } from "./libro.entity";

export class LibroMapper {
  static toReadDTO(libro: Libro, cant: number): LibroReadDTO {
    return {
      id: libro.id!,
      titulo: libro.titulo,
      isbn: libro.isbn,
      descripcion: libro.descripcion,
      cantejemplares: cant,
      editorial: {
        id: libro.miEditorial.id!,
        nombre: libro.miEditorial.nombre,
      },

      autor: {
        id: libro.miAutor.id!,
        nombreCompleto: libro.miAutor.nombrecompleto,
      },
    };
  }
  static toDetailDTO(libro: Libro): LibroDetailDTO {
    return {
      titulo: libro.titulo,
      descripcion: libro.descripcion,
      isbn: libro.isbn,
      ejemplares: libro.misEjemplares.getItems().map((ejemplar) => ({
        idEjemplar: ejemplar.id,
        estado: ejemplar.getEstado(),
      })),
      editorial: libro.miEditorial.nombre,
    };
  }
}
// El mapper usa métodos de clase ya que no necesita que se le inyecte nada y
//  por ende no hay necesidad de que el controlador reciba una instancia.
