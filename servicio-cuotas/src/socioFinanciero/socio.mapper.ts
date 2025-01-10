import { RowDataPacket } from "mysql2";
import { SocioFinanciero } from "./socio.entity.js";
import { mapper } from "../shared/mapper.js";

export class SocioMapper implements mapper<SocioFinanciero> {
  toEntity(row: RowDataPacket): SocioFinanciero {
    return new SocioFinanciero(
      null,
      Number.parseInt(row.socio_id),
      new Date(row.socio_createdAt),
      new Date(row.socio_updatedAt)
    );
  }
  toEntities(rows: RowDataPacket[]): SocioFinanciero[] {
    return rows.map((row) => this.toEntity(row));
  }
}
