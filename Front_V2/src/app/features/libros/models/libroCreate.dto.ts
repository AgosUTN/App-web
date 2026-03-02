export interface LibroCreateDTO {
  titulo: string;
  descripcion: string;
  isbn: string;
  miEditorial: number;
  misAutores: number[];
  cantEjemplares?: number;
}
