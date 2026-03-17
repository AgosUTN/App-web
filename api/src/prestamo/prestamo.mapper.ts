import { PrestamoDetailDTO } from "./dtos/prestamoDetail.dto";
import { PrestamoWriteDTO } from "./dtos/prestamoRead.dto";
import { PrestamoTableDTO } from "./dtos/prestamoTable.dto";
import { Prestamo } from "./prestamo.entity";

export class PrestamoMapper {
  static toWriteDTO(prestamo: Prestamo): PrestamoWriteDTO {
    return {
      id: prestamo.id!,
    };
  }

  static toTableDTO(prestamo: Prestamo): PrestamoTableDTO {
    return {
      id: prestamo.id!,
      idSocio: prestamo.miSocioPrestamo.id!,
      fechaCreacion: prestamo.fechaPrestamo,
      estado: prestamo.estadoPrestamo!,
      cantlibros: prestamo.misLpPrestamo.length,
    };
  }
  static toTableDTOList(prestamos: Prestamo[]): PrestamoTableDTO[] {
    return prestamos.map(PrestamoMapper.toTableDTO);
  }

  static toDetailDTO(prestamo: Prestamo): PrestamoDetailDTO {
    return {
      id: prestamo.id!,
      fechaPrestamo: prestamo.fechaPrestamo,
      estadoPrestamo: prestamo.estadoPrestamo!,
      miSocioPrestamo: {
        id: prestamo.miSocioPrestamo.id!,
        nombre: prestamo.miSocioPrestamo.nombre,
        apellido: prestamo.miSocioPrestamo.apellido,
        email: prestamo.miSocioPrestamo.email,
        telefono: prestamo.miSocioPrestamo.telefono,
      },
      misLpPrestamo: prestamo.misLpPrestamo.map((lp) => ({
        ordenLinea: lp.ordenLinea,
        fechaDevolucionTeorica: lp.fechaDevolucionTeorica,
        fechaDevolucionReal: lp.fechaDevolucionReal ?? null,
        miEjemplar: {
          id: lp.miEjemplar.id!,
          miLibro: {
            id: lp.miEjemplar.miLibro.id!,
            titulo: lp.miEjemplar.miLibro.titulo,
          },
        },
      })),
    };
  }
}
