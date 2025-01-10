import { RowDataPacket } from "mysql2";
import { pool } from "../shared/db/conn.js";
import { Repository } from "../shared/repository.js";
import { SocioFinanciero } from "./socio.entity.js";

import { CuotaMapper } from "../cuota/cuota.mapper.js";
import { SocioMapper } from "./socio.mapper.js";

const cuotaMapper = new CuotaMapper();
const socioMapper = new SocioMapper();

export class socioRepository implements Repository<SocioFinanciero> {
  public async findAll(): Promise<SocioFinanciero[]> {
    // SE USA INNER PORQUE UN SOCIO DEBE TENER CUOTAS
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        c.id as cuota_id,
        c.mes as cuota_mes,
        c.monto as cuota_monto,
        c.fechaPago as cuota_fechaPago,
        c.recargoAplicado as cuota_recargoAplicado,
        c.createdAt as cuota_createdAt,
        c.updatedAt as cuota_updatedAt,
        c.idSocio as cuota_idSocio,
        c.idMetodoPago as cuota_idMetodoPago,
        s.id as socio_id,
        s.createdAt as socio_createdAt,
        s.updatedAt as socio_updatedAt
      FROM socioFinanciero s
      INNER JOIN cuota c ON s.id = c.idSocio`
    );
    // Explicación en detalle en apuntes. Array de objetos "pares clave-valor",clave unica, JS maneja objetos por referencia.

    const sociosMap = new Map<number, SocioFinanciero>();

    // Si no existe en el map el socio lo crea y lo guarda, inicializa un array.
    rows.forEach((row) => {
      if (!sociosMap.has(row.socio_id)) {
        const socio = socioMapper.toEntity(row);
        socio.setCuotas([]);
        sociosMap.set(row.socio_id, socio);
      }
      // Si ya existe el socio o lo acaba de crear, obtiene una REFERENCIA al socio, crea la cuota en base a la fila actual, la guarda adentro del array del socio.
      const socio = sociosMap.get(row.socio_id)!;
      const cuota = cuotaMapper.toEntity(row);
      socio.getCuotas()!.push(cuota); // Cuidado con el !, deberia funcionar en este contexto.
    });

    // Arma un array con los socios financieros del map, desechando el "number" de cada socio, que es una redundancia de su ID.
    return Array.from(sociosMap.values());
  }
  public async findOne(item: {
    id: string;
  }): Promise<SocioFinanciero | undefined> {
    const idSocio = Number.parseInt(item.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `select c.id as cuota_id, c.mes as cuota_mes, 
      c.monto as cuota_monto, c.fechaPago as cuota_fechaPago, 
      c.recargoAplicado as cuota_recargoAplicado, c.createdAt as cuota_createdAt, 
      c.updatedAt as cuota_updatedAt, c.idSocio as cuota_idSocio, c.idMetodoPago as 
      cuota_idMetodoPago, s.id as socio_id, s.createdAt as socio_createdAt, s.updatedAt as socio_updatedAt 
      from socioFinanciero s inner join cuota c on s.id = c.idSocio where s.id = ?`, // Tecnicamente el socio nace con 1 cuota por lo que usamos inner y no left.
      [idSocio]
    );
    if (rows.length === 0) {
      return undefined;
    }
    const cuotas = cuotaMapper.toEntities(rows);
    const socio = socioMapper.toEntity(rows[0]);

    socio.setCuotas(cuotas);
    return socio;
  }

  public async update(
    id: string,
    item: SocioFinanciero
  ): Promise<SocioFinanciero | undefined> {
    throw new Error("Not implemented");
  }
  public async add(
    item: SocioFinanciero
  ): Promise<SocioFinanciero | undefined> {
    throw new Error("Not implemented");
  }
  public async delete(item: {
    id: string;
  }): Promise<SocioFinanciero | undefined> {
    throw new Error("Not implemented");
  }
}
