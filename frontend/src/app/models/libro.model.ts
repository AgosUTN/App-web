export interface Libro {
  id?: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  misAutores: number[];
  miEditorial: number;
  cantEjemplares?: number;
  codigoEjemplarActual?: number;
}
export interface LibroGetOne {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  codigoEjemplarActual: number;
  miEditorial: {
    id: number;
    nombre: string;
  };
  misAutores: Array<{
    id: number;
    nombre: string;
    apellido: string;
  }>;
  misEjemplares: Array<{
    id: number;
    miLibro: number;
    fechaIncorporacion: string;
  }>;
}
