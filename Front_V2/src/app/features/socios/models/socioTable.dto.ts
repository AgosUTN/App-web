import { EstadoSocio } from './estadoSocio.type';

export interface SocioTableDTO {
  id: number;
  email: string;
  estado: EstadoSocio;
  cantprestamos: number;
}
