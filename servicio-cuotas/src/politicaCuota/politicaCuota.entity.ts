import { baseEntity } from "../shared/baseEntity.entity.js";

export class PoliticaCuota extends baseEntity {
  constructor(
    public diaMaximoPago: number, // Dia del mes hasta el que podes pagar considerado a tiempo.
    public recargoMaximo: number,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }
  getDiasMaximo(): number {
    return this.diaMaximoPago;
  }
  getRecargoMaximo(): number {
    return this.recargoMaximo;
  }
}
