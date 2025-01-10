import { RowDataPacket } from "mysql2";

export interface mapper<T> {
  toEntity(row: RowDataPacket): T;
  toEntities(rows: RowDataPacket[]): T[];
}
// El toEntities podria ponerse en una clase abstracta que sea heredada por cada mapper, pero no quiero sumar abstracciones.
