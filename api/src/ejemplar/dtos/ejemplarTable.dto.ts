import { EstadoEjemplar } from "../estadoEjemplar.type";

export interface EjemplarTableDTO {
  idLibro: number;
  idEjemplar: number;
  estado: EstadoEjemplar;
}
