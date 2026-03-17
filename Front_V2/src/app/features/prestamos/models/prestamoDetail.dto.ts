import { EstadoPrestamo } from './prestamoEstado.type';

export interface PrestamoDetailDTO {
  id: number;
  fechaPrestamo: string;
  estadoPrestamo: EstadoPrestamo;
  miSocioPrestamo: SocioPrestamoDTO;
  misLpPrestamo: LineaPrestamoDTO[];
}

export interface SocioPrestamoDTO {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface LineaPrestamoDTO {
  ordenLinea: number;
  fechaDevolucionTeorica: string;
  fechaDevolucionReal: string | null;
  miEjemplar: EjemplarPrestamoDTO;
}

export interface EjemplarPrestamoDTO {
  id: number;
  miLibro: LibroPrestamoDTO;
}

export interface LibroPrestamoDTO {
  id: number;
  titulo: string;
}
