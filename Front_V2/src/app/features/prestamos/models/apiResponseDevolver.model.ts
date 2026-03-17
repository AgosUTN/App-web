import { PrestamoDetailDTO } from './prestamoDetail.dto';

export interface apiResponseDevolver {
  message: string;
  data: { prestamo: PrestamoDetailDTO; diasSancion: number };
}
