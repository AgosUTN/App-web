import { RowDataPacket } from "mysql2";
import { mapper } from "../shared/mapper.js";
import { PoliticaRecargo } from "./politicaRecargo.entity.js";

export class PoliticaRecargoMapper implements mapper<PoliticaRecargo> {
  toEntity(row: RowDataPacket): PoliticaRecargo {
    return new PoliticaRecargo(
      Number.parseInt(row.politicaRecargo_diasHasta),
      Number.parseFloat(row.politicaRecargo_porcentaje),
      row.politicaRecargo_createdAt
        ? new Date(row.politicaRecargo_createdAt)
        : undefined,
      row.politicaRecargo_updatedAt
        ? new Date(row.politicaRecargo_updatedAt)
        : undefined
    ); // Lo de las fechas es necesario por un error raro de mapeo.
  }
  toEntities(rows: RowDataPacket[]): PoliticaRecargo[] {
    return rows.map((row) => this.toEntity(row));
  }
}
