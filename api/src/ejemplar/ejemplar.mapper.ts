import { EjemplarCartDTO } from "./dtos/ejemplarCart.dto";
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
  static toCartDTO(ejemplar: Ejemplar): EjemplarCartDTO {
    return {
      idEjemplar: ejemplar.id,
      idLibro: ejemplar.miLibro.id!,
      nombreLibro: ejemplar.miLibro.titulo,
    };
  }
}
