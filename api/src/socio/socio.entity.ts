import {
  Entity,
  Property,
  Collection,
  OneToMany,
  Rel,
  OneToOne,
} from "@mikro-orm/core";
import { Prestamo } from "../prestamo/prestamo.entity.js";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Sancion } from "../sancion/sancion.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { User } from "../users/user.entity.js";
@Entity()
export class Socio extends BaseEntity {
  @Property()
  nombre!: string;
  @Property()
  apellido!: string;
  @Property()
  email!: string;
  @Property()
  domicilio!: string;
  @Property()
  telefono!: string;
  @Property()
  bajaLogica: boolean = false;

  @OneToMany(() => Prestamo, (prestamo) => prestamo.miSocioPrestamo)
  misPrestamos = new Collection<Prestamo>(this);

  @OneToMany(() => Sancion, (sancion) => sancion.miSocioSancion)
  misSanciones = new Collection<Sancion>(this);

  @OneToOne(() => User, (user) => user.miSocio, { nullable: true })
  miUser?: Rel<User>;

  estasInhabilitado(): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misPrestamos.length && rta != true) {
      if (this.misPrestamos[i].estasPendiente()) {
        rta = this.misPrestamos[i].estasAtrasado();
      }
      i++;
    }
    return rta;
  }

  estasSancionado(): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misSanciones.length && rta != true) {
      rta = this.misSanciones[i].estasVigente();
      i++;
    }
    return rta;
  }

  getDiasSancion(): number {
    let acumulador = 0;

    for (const sancion of this.misSanciones) {
      if (sancion.estasVigente()) {
        acumulador += sancion.getDiasSancionRestantes();
      }
    }

    return acumulador;
  }

  tenesPendiente(libro: Libro): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misPrestamos.length && rta != true) {
      if (this.misPrestamos[i].estasPendiente()) {
        rta = this.misPrestamos[i].tenesPendiente(libro);
      }
      i++;
    }

    return rta;
  }

  getCantPendientes(): number {
    let acumulador = 0;
    for (const prestamo of this.misPrestamos) {
      if (prestamo.estasPendiente()) {
        acumulador += prestamo.getCantPendientes();
      }
    }
    return acumulador;
  }
  getNoDevueltos(): Ejemplar[] {
    const noDevueltos = [];
    for (const prestamo of this.misPrestamos) {
      if (prestamo.estasPendiente()) {
        const noDevueltosPrestamo = prestamo.getNoDevueltos();
        noDevueltos.push(...noDevueltosPrestamo);
      }
    }
    return noDevueltos;
  }

  setBajaLogica(): void {
    this.bajaLogica = true;

    if (this.miUser) {
      this.miUser.setBajaLogica();
    }
  }
}
