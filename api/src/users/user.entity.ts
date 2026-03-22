import { Entity, Property, OneToOne, Rel } from "@mikro-orm/core";

import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Socio } from "../socio/socio.entity.js";
import { Rol } from "../auth/rol.type.js";

@Entity()
export class User extends BaseEntity {
  @Property() // Falta unique true
  email!: string;

  @Property()
  password_hash!: string;

  @Property()
  rol!: Rol;

  @Property()
  bajaLogica?: boolean = false;

  @OneToOne(() => Socio)
  miSocio!: Rel<Socio>;

  setBajaLogica(): void {
    this.bajaLogica = true;
  }
}
