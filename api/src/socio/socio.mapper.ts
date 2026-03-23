import { Prestamo } from "../prestamo/prestamo.entity";
import { Sancion } from "../sancion/sancion.entity";
import {
  PrestamoSocioDTO,
  SancionSocioDTO,
  SocioDetailDTO,
} from "./dtos/socioDetail.dto";
import { SocioReadDTO } from "./dtos/socioRead.dto";
import { SocioTableDTO } from "./dtos/socioTable.dto";
import { SocioWriteDTO } from "./dtos/socioWrite.dto";
import { Socio } from "./socio.entity";

export class SocioMapper {
  static toWriteDTO(s: Socio): SocioWriteDTO {
    return { id: s.id! };
  }
  static toReadDTO(s: Socio): SocioReadDTO {
    return {
      id: s.id!,
      nombre: s.nombre,
      apellido: s.apellido,
      domicilio: s.domicilio,
      telefono: s.telefono,
      email: s.miUser!.email,
    };
  }
  static toDetailDTO(
    s: Socio,
    pPendientes: Prestamo[],
    sVigentes: Sancion[],
  ): SocioDetailDTO {
    return {
      id: s.id!,
      nombre: s.nombre,
      apellido: s.apellido,
      domicilio: s.domicilio,
      telefono: s.telefono,
      email: s.miUser!.email,
      sancionesVigentes: sVigentes.map((san) => this.toSancionDTO(san)),
      prestamosPendientes: pPendientes.map((p) => this.toPrestamoDTO(p)),
    };
  }
  static toTableDTO(s: Socio): SocioTableDTO {
    return {
      id: s.id!,
      email: s.miUser!.email,
      estado: s.getEstado(),
      cantprestamos: s.misPrestamos.length,
    };
  }

  static toTableDTOList(socios: Socio[]): SocioTableDTO[] {
    return socios.map((s) => this.toTableDTO(s));
  }

  static toSancionDTO(s: Sancion): SancionSocioDTO {
    return {
      id: s.id!,
      libro: s.miLineaPrestamo.miEjemplar.miLibro.titulo,
      fechaFin: s.getFechaFinSancion(),
    };
  }
  static toPrestamoDTO(p: Prestamo): PrestamoSocioDTO {
    return {
      id: p.id!,
      fechaFin: p.getFechaFin(),
    };
  }
}
