export interface Prestamo {
  id: number;
  fechaPrestamo: Date;
  ordenLinea: number;
  estadoPrestamo: string;
  miSocioPrestamo: number;
  misLpPrestamo: LineaPrestamo[];
}

export interface LineaPrestamo {
  ordenLinea: number;
  fechaDevolucionTeorica: Date;
  fechaDevolucionReal: Date | null;
  miEjemplar: miEjemplar;
}

export interface miEjemplar {
  id: number;
  miLibro: miLibro;
  fechaIncorporacion: Date;
}

export interface miLibro {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  codigoEjemplarActual: number;
  miEditorial: number;
}
