import { baseEntity } from "../shared/baseEntity.entity.js";

export class MetodoPago extends baseEntity {
  constructor(
    public codigo: string, // Por ahora no modificable.
    public activo: boolean = true,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  desactivar() {
    this.activo = false;
  }

  activar() {
    this.activo = true;
  }
}
// Quite el update timeStamp de los metodos porque lo hace la DB.
