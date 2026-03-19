import { Entity, ManyToOne, Property, DateType, Rel } from "@mikro-orm/core";
import { Socio } from "../socio/socio.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { addDays, differenceInDays, isAfter, isBefore } from "date-fns";
import { EstadoSancion } from "./estadoSancion.type.js";

@Entity()
export class Sancion extends BaseEntity {
  @Property({ type: DateType })
  fechaSancion = new Date(); // Si pones ? despues typescript da error en los métodos. Como parche lo pongo en el alta.

  @Property()
  diasSancion!: number;

  @Property({ type: DateType, nullable: true })
  fechaRevocacion?: Date;

  @ManyToOne(() => Socio, { deleteRule: "cascade" })
  miSocioSancion!: Rel<Socio>;

  getFechaFinSancion(): Date {
    return addDays(this.fechaSancion, this.diasSancion);
  }

  estasVigente(): boolean {
    if (this.fechaRevocacion) {
      return false;
    } else {
      const hoy = new Date();

      return isAfter(this.getFechaFinSancion(), hoy);
    }
  }
  getDiasSancion(): number {
    return this.diasSancion;
  }

  getDiasSancionRestantes(): number {
    const hoy = new Date();
    return differenceInDays(this.getFechaFinSancion(), hoy);
  }

  getEstado(): EstadoSancion {
    const hoy = new Date();

    if (this.fechaRevocacion) {
      return "REVOCADA";
    } else if (isAfter(this.getFechaFinSancion(), hoy)) {
      return "VIGENTE";
    } else {
      return "FINALIZADA";
    }
  }
}
