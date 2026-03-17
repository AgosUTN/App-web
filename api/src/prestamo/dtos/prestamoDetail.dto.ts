import { EstadoPrestamo } from "../prestamoEstado.type";

export interface PrestamoDetailDTO {
  id: number;
  fechaPrestamo: Date;
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
  fechaDevolucionTeorica: Date;
  fechaDevolucionReal: Date | null;
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
