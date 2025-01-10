import { RowDataPacket } from "mysql2";
import { mapper } from "../shared/mapper.js";
import { MetodoPago } from "./metodoPago.entity.js";

export class MetodoPagoMapper implements mapper<MetodoPago> {
  toEntity(row: RowDataPacket): MetodoPago {
    return new MetodoPago(
      row.metodoPago_codigo,
      row.metodoPago_activo === 1,
      Number.parseInt(row.metodoPago_id),
      new Date(row.metodoPago_createdAt),
      new Date(row.metodoPago_updatedAt)
    );
  }
  toEntities(rows: RowDataPacket[]): MetodoPago[] {
    return rows.map((row) => this.toEntity(row));
  }
}
