import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: process.env.API_DB_NAME,
  driver: MySqlDriver,
  //type: "mysql",// Version 6 en adelante no necesario.
  clientUrl: `mysql://${process.env.API_DB_USER}:${process.env.API_DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.API_DB_NAME}`, // "mysql://dsw:dsw@mysql:3306/TpORM" cambiar localhost por mysql para docker.
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //never in production
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*
  await generator.dropSchema();
  await generator.createSchema();
*/
  await generator.updateSchema();
};
