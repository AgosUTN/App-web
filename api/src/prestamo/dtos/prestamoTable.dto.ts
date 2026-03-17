import { EstadoPrestamo } from "../prestamoEstado.type";

export interface PrestamoTableDTO {
  id: number;
  idSocio: number;
  fechaCreacion: Date;
  estado: EstadoPrestamo;
  cantlibros: number;
}
