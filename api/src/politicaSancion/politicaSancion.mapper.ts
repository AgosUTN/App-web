import { PoliticaSancionReadDTO } from "./dtos/politicaSancionRead.dto";
import { PoliticaSancion } from "./politicaSancion.entity";

export class PoliticaSancionMapper {
  static toReadDTO(politica: PoliticaSancion): PoliticaSancionReadDTO {
    return {
      diasHasta: politica.diasHasta,
      diasSancion: politica.diasSancion,
    };
  }
  static toReadDTOList(politicas: PoliticaSancion[]): PoliticaSancionReadDTO[] {
    return politicas.map((p) => this.toReadDTO(p));
  }
}
