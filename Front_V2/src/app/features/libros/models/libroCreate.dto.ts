export interface LibroCreateDTO {
  titulo: string;
  descripcion: string;
  isbn: string;
  miEditorial: number;
  miAutor: number;
  cantEjemplares?: number;
}
