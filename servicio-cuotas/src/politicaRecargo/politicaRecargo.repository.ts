import { RowDataPacket } from "mysql2";
import { pool } from "../shared/db/conn.js";
import { Repository } from "../shared/repository.js";
import { PoliticaRecargo } from "./politicaRecargo.entity.js";
import { PoliticaRecargoMapper } from "./politicaRecargo.mapper.js";

const politicaRecargoMapper = new PoliticaRecargoMapper();

export class politicaRepository implements Repository<PoliticaRecargo> {
  public async findAll(): Promise<PoliticaRecargo[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
      diasHasta AS politicaRecargo_diasHasta,
      porcentaje AS politicaRecargo_porcentaje,
      createdAt AS politicaRecargo_createdAt,
      updatedAt AS politicaRecargo_updatedAt
      FROM politicaRecargo`
    );
    return politicaRecargoMapper.toEntities(rows);
  }
  public async findOne(item: {
    id: string;
  }): Promise<PoliticaRecargo | undefined> {
    const diasHasta = Number.parseInt(item.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
          diasHasta AS politicaRecargo_diasHasta,
          porcentaje AS politicaRecargo_porcentaje,
          createdAt AS politicaRecargo_createdAt,
          updatedAt AS politicaRecargo_updatedAt
          FROM politicaRecargo
          WHERE diasHasta = ?`,
      diasHasta
    );

    return rows.length > 0
      ? politicaRecargoMapper.toEntity(rows[0])
      : undefined;
  }

  public async findOneByDays(item: {
    id: string;
  }): Promise<PoliticaRecargo | undefined> {
    const diasHasta = Number.parseInt(item.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
      diasHasta AS politicaRecargo_diasHasta,
      porcentaje AS politicaRecargo_porcentaje,
      createdAt AS politicaRecargo_createdAt,
      updatedAt AS politicaRecargo_updatedAt
      FROM politicaRecargo
      where ? < diasHasta order by diasHasta asc limit 1`,
      diasHasta
    );
    return rows.length > 0
      ? politicaRecargoMapper.toEntity(rows[0])
      : undefined;
  }

  public async update(
    id: string,
    item: PoliticaRecargo
  ): Promise<PoliticaRecargo | undefined> {
    const diasHasta = Number.parseInt(id);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE politicaRecargo SET porcentaje = ? WHERE diasHasta = ?`,
        [item.porcentaje, diasHasta]
      );

      await connection.commit();

      return await this.findOne({ id });
    } catch (error) {
      await connection.rollback();
      throw error; // Propagar el error para manejarlo adecuadamente
    } finally {
      connection.release();
    }
  }

  public async add(
    item: PoliticaRecargo
  ): Promise<PoliticaRecargo | undefined> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `insert into politicaRecargo(diasHasta,porcentaje) values(?,?);`,
        [item.diasHasta, item.porcentaje]
      );

      await connection.commit();

      return await this.findOne({ id: item.diasHasta.toString() });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  public async delete(item: {
    id: string;
  }): Promise<PoliticaRecargo | undefined> {
    const politicaToDelete = await this.findOne(item);
    const diasHasta = Number.parseInt(item.id);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `delete from politicaRecargo where diasHasta = ?;`,
        [diasHasta]
      );

      await connection.commit();

      return politicaToDelete;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
