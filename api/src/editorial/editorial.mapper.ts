import { EditorialReadDTO } from "./dtos/editorialRead.dto";
import { Editorial } from "./editorial.entity";

export class EditorialMapper {
  static toReadDTO(editorial: Editorial): EditorialReadDTO {
    return {
      id: editorial.id!,
      nombre: editorial.nombre,
    };
  }
}
