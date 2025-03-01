import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: ["./src/lib/db/schema/*.ts", "./src/lib/db/schema/relations/*.ts"],
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "admin",
    password: "password",
    database: "gestionale",
  },
  // Opzioni aggiuntive per la gestione delle migrazioni
  verbose: true,
  strict: true,
} satisfies Config;
