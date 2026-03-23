export interface SocioDetailDTO {
  id: number;
  nombre: string;
  apellido: string;
  domicilio: string;
  telefono: string;
  email: string;
  sancionesVigentes: SancionSocioDTO[];
  prestamosPendientes: PrestamoSocioDTO[];
}

export interface SancionSocioDTO {
  id: number; // No se muestra
  libro: string;
  fechaFin: Date;
}
export interface PrestamoSocioDTO {
  id: number;
  fechaFin: Date;
}
