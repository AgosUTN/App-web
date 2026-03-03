import {
  Entity,
  ManyToMany,
  Property,
  Collection,
  ManyToOne,
  Rel,
  OneToMany,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";

import { Autor } from "../autor/autor.entity.js";
import { Editorial } from "../editorial/editorial.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";

@Entity()
export class Libro extends BaseEntity {
  @Property({ unique: true })
  titulo!: string;

  @Property()
  descripcion!: string;

  @Property({ unique: true })
  isbn!: string;

  @Property() //Evaluar condiciones de carrera.
  ultimoCodigoEjemplar = 0;

  @ManyToOne(() => Autor, { nullable: false }) // Nota: No voy a usar el error de Mysql. Zod valida que no venga vacío.
  miAutor!: Rel<Autor>;

  @ManyToOne(() => Editorial, { nullable: false })
  miEditorial!: Rel<Editorial>;

  @OneToMany(() => Ejemplar, (ejemplar) => ejemplar.miLibro, {})
  misEjemplares = new Collection<Ejemplar>(this);

  // Metodos

  getUltimoCodigoEjemplar(): number {
    return this.ultimoCodigoEjemplar;
  }

  increaseUltimoCodigoEjemplar(): void {
    this.ultimoCodigoEjemplar++;
  }

  fuistePrestado(): boolean {
    let i = 0;
    let rta = false;
    while (i < this.misEjemplares.length && rta != true) {
      rta = this.misEjemplares[i].fuistePrestado();
      i++;
    }
    return rta;
  }
  getId(): number | undefined {
    return this.id;
  }
}
