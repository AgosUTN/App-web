import { Cuota } from "../cuota/cuota.entity.js";
import { baseEntity } from "../shared/baseEntity.entity.js";

export class SocioFinanciero extends baseEntity {
  constructor(
    public misCuotas: null | Cuota[] = [], // Si bien al finalizar el Alta socio debe tener 1 cuota, en el mientras tanto no tiene.
    id: number, // No es opcional el ID porque lo crea el otro servicio.
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  setCuotas(cuotas: Cuota[]) {
    this.misCuotas = cuotas;
  }
  getCuotas(): Cuota[] | null {
    return this.misCuotas;
  }
}
