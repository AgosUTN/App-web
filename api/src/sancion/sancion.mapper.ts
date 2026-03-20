import { SancionTableDTO } from "./dtos/sancionTable.dto";
import { Sancion } from "./sancion.entity";

export class SancionMapper {
  static toTableDTO(s: Sancion): SancionTableDTO {
    return {
      id: s.id!,
      idSocio: s.miSocioSancion.id!,
      titulo: s.miLineaPrestamo.miEjemplar.miLibro.titulo,
      fechaInicio: s.fechaSancion,
      fechaFin: s.getFechaFinSancion(),
      estado: s.getEstado(),
    };
  }
  static toTableDTOList(sanciones: Sancion[]): SancionTableDTO[] {
    return sanciones.map((s) => this.toTableDTO(s));
  }
}
