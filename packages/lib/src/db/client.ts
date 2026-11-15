import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@shared/env";

import * as schema from "./schema";

let connection: ReturnType<typeof postgres> | undefined;
export function database() {
  if (!env.SUPABASE_DB_URL)
    throw new Error("Set SUPABASE_DB_URL to the Supabase pooler connection URI.");
  connection ??= postgres(env.SUPABASE_DB_URL, {
    connect_timeout: 10,
    idle_timeout: 20,
    max: 3,
    prepare: false,
    ssl: "require",
  });
  return drizzle(connection, { schema });
}
export type Database = ReturnType<typeof database>;
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
