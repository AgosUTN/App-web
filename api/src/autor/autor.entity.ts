import {
  Entity,
  Property,
  Collection,
  BeforeDelete,
  EventArgs,
  OneToMany,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";

import { Libro } from "../libro/libro.entity.js";

@Entity()
export class Autor extends BaseEntity {
  @Property({ unique: true })
  nombrecompleto!: string;

  @OneToMany(() => Libro, (libro) => libro.miAutor)
  misLibros = new Collection<Libro>(this);
}
