import { RowDataPacket } from "mysql2";
import { pool } from "../shared/db/conn.js";
import { PoliticaCuota } from "./politicaCuota.entity.js";

export class PoliticaCuotaRepository {
  private mapToPolitica(row: RowDataPacket): PoliticaCuota {
    return new PoliticaCuota(
      row.politicaCuota_diaMaximoPago,
      row.politicaCuota_recargoMaximo,
      row.politicaCuota_id,
      row.politicaCuota_createdAt,
      row.politicaCuota_updatedAt
    );
  }
  public async findOne(): Promise<PoliticaCuota | undefined> {
    const [politicaCuota] = await pool.query<RowDataPacket[]>(`
            SELECT 
                id as politicaCuota_id,
                createdAt as politicaCuota_createdAt,
                updatedAt as politicaCuota_updatedAt,
                diaMaximoPago as politicaCuota_diaMaximoPago,
                recargoMaximo as politicaCuota_recargoMaximo
            FROM politicaCuota
            WHERE id = 1
            `);
    if (!politicaCuota[0]) {
      return undefined;
    }
    return this.mapToPolitica(politicaCuota[0]);
  }
  public async update(item: PoliticaCuota): Promise<PoliticaCuota | undefined> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE politicaCuota SET recargoMaximo = ? , 
        diaMaximoPago = ?
        WHERE id = ?`,
        [item.recargoMaximo, item.diaMaximoPago, 1]
      );

      await connection.commit();

      return await this.findOne();
    } catch (error) {
      await connection.rollback();
      throw error; // Propagar el error para manejarlo adecuadamente
    } finally {
      connection.release();
    }
  }
}
