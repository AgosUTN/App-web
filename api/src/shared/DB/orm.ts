import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

const dbHost = process.env.DB_HOST ?? "localhost"; // Necesario para Jest

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: process.env.API_DB_NAME,
  driver: MySqlDriver,
  clientUrl: `mysql://${process.env.API_DB_USER}:${process.env.API_DB_PASSWORD}@${dbHost}:${process.env.DB_PORT}/${process.env.API_DB_NAME}`,
  highlighter: new SqlHighlighter(),
  debug: true,
});

/*
  schemaGenerator: {
    //never in production
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },

*/
/*
export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();

  await generator.dropSchema();
  await generator.createSchema();

  await generator.updateSchema();
};
*/
