import { LibroDetailDTO } from "./dtos/libroDetail.dto";
import { LibroReadDTO } from "./dtos/libroRead.dto";
import { LibroWriteDTO } from "./dtos/libroWrite.dto";
import { Libro } from "./libro.entity";

export class LibroMapper {
  static toReadDTO(libro: Libro): LibroReadDTO {
    return {
      id: libro.id!,
      titulo: libro.titulo,
      isbn: libro.isbn,
      descripcion: libro.descripcion,
      cantejemplares: libro.misEjemplares.length,
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
      id: libro.id!,
      titulo: libro.titulo,
      descripcion: libro.descripcion,
      isbn: libro.isbn,
      ejemplares: libro.misEjemplares.getItems().map((ejemplar) => ({
        idEjemplar: ejemplar.id,
        idLibro: ejemplar.miLibro.id!,
        estado: ejemplar.getEstado(),
      })),
      editorial: libro.miEditorial.nombre,
    };
  }
  static toWriteDTO(libro: Libro): LibroWriteDTO {
    return {
      id: libro.id!,
      titulo: libro.titulo,
      descripcion: libro.descripcion,
      isbn: libro.isbn,
      cantejemplares: libro.misEjemplares.length,
      autor: libro.miAutor.id!,
      editorial: libro.miEditorial.id!,
    };
  }
}
// El mapper usa métodos de clase ya que no necesita que se le inyecte nada y
//  por ende no hay necesidad de que el controlador reciba una instancia.
