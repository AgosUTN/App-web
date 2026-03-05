export type EstadoEjemplar = 'PRESTADO' | 'ELIMINADO' | 'DISPONIBLE';

export interface EjemplarTableDTO {
  idEjemplar: number;
  estado: EstadoEjemplar;
}
