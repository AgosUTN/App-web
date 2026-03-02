import { EditorialTableDTO } from "./dtos/EditorialTable.dto";
import { editorialCount } from "./editorialCount.entity";

export class EditorialMapper {
  static toTableDTO(editorial: editorialCount): EditorialTableDTO {
    return {
      id: editorial.id,
      nombre: editorial.nombre,
      cantlibros: editorial.cantlibros,
    };
  }
  static toTableDTOList(editoriales: editorialCount[]): EditorialTableDTO[] {
    return editoriales.map((editorial) => this.toTableDTO(editorial));
  }
}
// El mapper usa métodos de clase ya que no necesita que se le inyecte nada y
//  por ende no hay necesidad de que el controlador reciba una instancia.
