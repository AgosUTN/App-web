import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

const dbHost = process.env.DB_HOST ?? "localhost";

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: process.env.API_DB_NAME, //?? "apiDB",
  driver: MySqlDriver,

  clientUrl: `mysql://${process.env.API_DB_USER}:${process.env.API_DB_PASSWORD}@${dbHost}:${process.env.DB_PORT}/${process.env.API_DB_NAME}`, //`mysql://${process.env.API_DB_USER}:${process.env.API_DB_PASSWORD}@${dbHost}:${process.env.DB_PORT}/${process.env.API_DB_NAME}`,   `mysql://${process.env.API_DB_USER ?? "root"}:${process.env.API_DB_PASSWORD ?? "root"}@${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "3306"}/${process.env.API_DB_NAME ?? "apiDB"}`,
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
