import { EstadoSancion } from './estadoSancion.type';

export interface SancionTableDTO {
  id: number;
  idSocio: number;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoSancion;
}
