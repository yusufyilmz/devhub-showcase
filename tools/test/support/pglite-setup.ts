import { PGlite } from "@electric-sql/pglite";

const database = new PGlite();
await database.exec("select 1");
await database.close();
