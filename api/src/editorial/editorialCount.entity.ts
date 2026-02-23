// Entidad virtual.

import { Entity, Property } from "@mikro-orm/core";

@Entity({
  expression:
    "select e.id, e.nombre, " +
    "(count(l.mi_editorial_id)) as cantlibros " +
    "from editorial e " +
    "left join libro l on e.id = l.mi_editorial_id " +
    "group by e.id ",
})
export class editorialCount {
  @Property()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  cantlibros!: number;
}
// Se paso de cantLibros a cantlibros porque si no MikroOrm al momento de usar el string "cantLibros"
//  en la clave del orderBy, lo separa en cant_libros y no se encuentra la columna.
