import {
  Entity,
  ManyToOne,
  Property,
  DateType,
  OneToMany,
  Collection,
  Cascade,
} from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { Socio } from "../socio/socio.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { LineaPrestamo } from "../lineaPrestamo/lineaPrestamo.entity.js";

import { Libro } from "../libro/libro.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import type { EstadoPrestamo } from "./prestamoEstado.type.js";

@Entity()
export class Prestamo extends BaseEntity {
  @Property({ columnType: "datetime" })
  fechaPrestamo = new Date();
  @Property()
  ordenLinea = 0;
  @Property()
  estadoPrestamo?: EstadoPrestamo = "PENDIENTE";

  @ManyToOne(() => Socio, { deleteRule: "cascade" })
  miSocioPrestamo!: Rel<Socio>;

  @OneToMany(() => LineaPrestamo, (lp) => lp.miPrestamo, {})
  misLpPrestamo = new Collection<LineaPrestamo>(this);

  tenesPendiente(libro: Libro): boolean {
    let i = 0;
    let rta = false;
    while (rta != true && i < this.misLpPrestamo.length) {
      rta = this.misLpPrestamo[i].tenesPendiente(libro);
      i++;
    }
    return rta;
  }
  getOrdenLinea(): number {
    this.ordenLinea++;
    return this.ordenLinea;
  }
  getCantPendientes(): number {
    let contador = 0;
    for (const lp of this.misLpPrestamo) {
      if (lp.estasPendiente()) {
        contador++;
      }
    }
    return contador;
  }
  estasAtrasado(): boolean {
    let i = 0;
    let rta = false;
    while (rta != true && i < this.misLpPrestamo.length) {
      rta = this.misLpPrestamo[i].estasAtrasado();
      i++;
    }
    return rta;
  }
  getNoDevueltos(): Ejemplar[] {
    const noDevueltos = [];
    for (const lp of this.misLpPrestamo) {
      if (lp.estasPendiente()) {
        const ejemplar = lp.getEjemplar();
        noDevueltos.push(ejemplar);
      }
    }
    return noDevueltos;
  }
  estasPendiente(): boolean {
    return this.estadoPrestamo === "PENDIENTE";
  }
  setFinalizado(): void {
    this.estadoPrestamo = "FINALIZADO";
  }
  getLinea(id: number): LineaPrestamo | undefined {
    return this.misLpPrestamo.find((lp) => lp.ordenLinea === id);
  }

  getFechaFin(): Date {
    return this.misLpPrestamo[0].getFechaDevolucionTeorica();
    // Nota: Originalmente no se puso la fecha de devolución teórica directamente
    // en el préstamo porque contemplé la posbilidad de definir distintos días de retorno según que tan famoso/prestado era el libro.
    // Por eso ahora se recurre a este parche, no es una buena redundancia.
  }
}
