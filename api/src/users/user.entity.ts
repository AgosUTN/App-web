import { Entity, Property, OneToOne, Cascade } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/DB/baseEntity.entity.js";
import { Socio } from "../socio/socio.entity.js";
import type { Rol } from "../auth/rol.type.js";

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  email!: string;

  @Property()
  password_hash!: string;

  @Property()
  rol!: Rol;

  @Property()
  bajaLogica?: boolean = false;

  @OneToOne(() => Socio, { deleteRule: "cascade", nullable: true }) // Un admin no tiene socio
  miSocio!: Rel<Socio>;

  setBajaLogica(): void {
    this.bajaLogica = true;
  }
}
