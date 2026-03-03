import { Entity, Property } from "@mikro-orm/core";

@Entity({
  expression:
    "select l.id, l.titulo, " +
    "(a.nombrecompleto) as autor, " +
    "(count(lp.mi_prestamo_id)) as cantprestamos " +
    "from libro l " +
    "inner join autor a on a.id = l.mi_autor_id " +
    "left join linea_prestamo lp on l.id = lp.mi_ejemplar_mi_libro_id " +
    "group by l.id, l.titulo, autor",
})
export class LibroTable {
  @Property()
  id!: number;

  @Property()
  titulo!: string;

  @Property()
  autor!: string;

  @Property()
  cantprestamos!: number;
}
