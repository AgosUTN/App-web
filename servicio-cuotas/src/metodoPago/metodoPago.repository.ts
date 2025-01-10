import { RowDataPacket } from "mysql2";
import { pool } from "../shared/db/conn.js";
import { MetodoPago } from "./metodoPago.entity.js";
import { MetodoPagoMapper } from "./metodoPago.mapper.js";

const metodoPagoMapper = new MetodoPagoMapper();

export class metodoPagoRepository {
  public async findAll(): Promise<MetodoPago[] | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
          id AS metodoPago_id,
          codigo AS metodoPago_codigo,
          activo AS metodoPago_activo,
          createdAt AS metodoPago_createdAt,
          updatedAt AS metodoPago_updatedAt
        FROM metodoPago`
    );
    return metodoPagoMapper.toEntities(rows);
  }
  public async findOne(item: { id: string }): Promise<MetodoPago | undefined> {
    const id = Number.parseInt(item.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
          id AS metodoPago_id,
          codigo AS metodoPago_codigo,
          activo AS metodoPago_activo,
          createdAt AS metodoPago_createdAt,
          updatedAt AS metodoPago_updatedAt
        FROM metodoPago
        WHERE id = ?`,
      id
    );

    return rows.length > 0 ? metodoPagoMapper.toEntity(rows[0]) : undefined;
  }
  public async update(
    id: string,
    item: MetodoPago
  ): Promise<MetodoPago | undefined> {
    // Nota: Si en el futuro no agrego atributos, podria hacer el cambio de estado con un endpoint como POST /metodoPago/1/activar

    const idMetodo = Number.parseInt(id);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(`UPDATE metodoPago SET activo = ? WHERE id = ?`, [
        item.activo,
        idMetodo,
      ]);

      await connection.commit();

      return await this.findOne({ id });
    } catch (error) {
      await connection.rollback();
      throw error; // Propagar el error para manejarlo adecuadamente
    } finally {
      connection.release();
    }
  }
}

// No hay add ni delete, es por migración al seedear la DB. El Admin solo puede activar y desactivar.
