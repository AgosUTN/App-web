import { PrestamoWriteDTO } from "./dtos/prestamoRead.dto";
import { Prestamo } from "./prestamo.entity";

export class PrestamoMapper {
  static toWriteDTO(prestamo: Prestamo): PrestamoWriteDTO {
    return {
        id: prestamo.id!
    }
  }
}
