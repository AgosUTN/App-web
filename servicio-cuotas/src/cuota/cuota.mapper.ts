import { RowDataPacket } from "mysql2";
import { mapper } from "../shared/mapper.js";
import { Cuota } from "./cuota.entity.js";

export class CuotaMapper implements mapper<Cuota> {
  toEntity(row: RowDataPacket): Cuota {
    return new Cuota(
      Number.parseInt(row.cuota_idSocio),
      row.idMetodoPago ? Number(row.cuota_idMetodoPago) : null,
      Number.parseInt(row.cuota_mes),
      Number.parseFloat(row.cuota_monto),
      row.fechaPago ? new Date(row.cuota_fechaPago) : null,
      row.recargoAplicado ? Number(row.cuota_recargoAplicado) : null,
      Number.parseInt(row.cuota_id),
      new Date(row.cuota_createdAt),
      new Date(row.cuota_updatedAt)
    );
  }
  toEntities(rows: RowDataPacket[]): Cuota[] {
    return rows.map((row) => this.toEntity(row));
  }
}

// Forma 1 - Recibe array de filas pero devuelve array cuotas.
// Forma 2 - Recibe 1 sola fila, y devuelve 1 sola cuota.
