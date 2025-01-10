import { RowDataPacket } from "mysql2";
import { pool } from "../shared/db/conn.js";

import { Cuota } from "./cuota.entity.js";
import { CuotaMapper } from "./cuota.mapper.js";

const cuotaMapper = new CuotaMapper();

export class cuotaRepository {
  constructor() {}

  public async findAll(): Promise<Cuota[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "select id as cuota_id, mes as cuota_mes, monto as cuota_monto, fechaPago as cuota_fechaPago, recargoAplicado as cuota_recargoAplicado, createdAt as cuota_createdAt, updatedAt as cuota_updatedAt, idSocio as cuota_idSocio, idMetodoPago as cuota_idMetodoPago from cuota"
    );
    return cuotaMapper.toEntities(rows);
  }
  public async findOne(item: { id: string }): Promise<Cuota | undefined> {
    const id = Number.parseInt(item.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      "select select id as cuota_id, mes as cuota_mes, monto as cuota_monto, fechaPago as cuota_fechaPago, recargoAplicado as cuota_recargoAplicado, createdAt as cuota_createdAt, updatedAt as cuota_updatedAt, idSocio as cuota_idSocio, idMetodoPago as cuota_idMetodoPago from cuota where id = ?",
      [id]
    );
    return rows.length > 0 ? cuotaMapper.toEntity(rows[0]) : undefined;
  }
  public async add(id: string, item: Cuota): Promise<Cuota | undefined> {
    throw new Error("Not implemented");
  }
  public async update(id: string, item: Cuota): Promise<Cuota | undefined> {
    throw new Error("Not implemented");
  }

  // No hay delete de cuota, se borra si se borra el Socio.
  // add y update los implemento en el futuro.
}
// Traer el metodo de pago si lo hay, y el socio.
