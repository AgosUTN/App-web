import { Entity, Property } from "@mikro-orm/core";

@Entity({
  expression:
    "select a.id, a.nombrecompleto, " +
    "(count(l.mi_autor_id)) as cantlibros " +
    "from autor a " +
    "left join libro l on a.id = l.mi_autor_id " +
    "group by a.id, a.nombrecompleto ",
})
export class AutorTable {
  @Property()
  id!: number;

  @Property()
  nombrecompleto!: string;

  @Property()
  cantlibros!: number;
}
