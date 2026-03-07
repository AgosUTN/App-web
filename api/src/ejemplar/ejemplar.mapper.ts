import { EjemplarTableDTO } from "./dtos/ejemplarTable.dto";
import { Ejemplar } from "./ejemplar.entity";

export class EjemplarMapper {
  static toTableDTO(ejemplar: Ejemplar): EjemplarTableDTO {
    return {
      idLibro: ejemplar.miLibro.id!,
      idEjemplar: ejemplar.id,
      estado: ejemplar.getEstado(),
    };
  }
}
