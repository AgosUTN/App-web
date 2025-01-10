import { baseEntity } from "../shared/baseEntity.entity.js";

export class Cuota extends baseEntity {
  constructor(
    public idSocio: number,
    public idMetodoPago: number | null,
    public mes: number,
    public monto: number,
    public fechaPago: Date | null,
    public recargoAplicado: number | null,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }
  setFechaPago() {
    this.fechaPago = new Date();
  }
}

// Sistema simple: No usa entidad cuota, calcula estado no moroso del socio en base al último pago.
// Sistema robusto: Usa entidad cuota, necesita job scheduler, solución simple para la primer cuota --> Cobrar proporcional.
// public fechaVencimiento: Date, Innecesaria porque no es dinamica, es siempre la misma. Guardada en politicaBiblioteca.
