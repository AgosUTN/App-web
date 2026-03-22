import { SocioReadDTO } from "./dtos/socioRead.dto";
import { SocioTableDTO } from "./dtos/socioTable.dto";
import { SocioWriteDTO } from "./dtos/socioWrite.dto";
import { Socio } from "./socio.entity";

export class SocioMapper {
  static toWriteDTO(s: Socio): SocioWriteDTO {
    return { id: s.id! };
  }
  static toReadDTO(s: Socio): SocioReadDTO {
    return { id: s.id! };
  }
  static toTableDTO(s: Socio): SocioTableDTO {
    return { id: s.id! };
  }

  static toTableDTOList(socios: Socio[]): SocioTableDTO[] {
    return socios.map((s) => this.toTableDTO(s));
  }
}
