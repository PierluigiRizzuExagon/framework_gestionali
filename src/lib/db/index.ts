import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Carica le variabili d'ambiente

// Configurazione della connessione al database
const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "password",
  database: "gestionale",
  ssl: process.env.DATABASE_SSL === "true" ? {} : undefined,
});

// Inizializzazione del client Drizzle con lo schema e il parametro mode richiesto
export const db = drizzle(connection, {
  schema,
  mode: "default",
});

// Funzione di utilità per verificare la connessione al database
export async function testConnection() {
  try {
    const [result] = await connection.query("SELECT 1 as test");
    return { success: true, result };
  } catch (error) {
    console.error("Errore di connessione al database:", error);
    return { success: false, error };
  }
}

/**
 * Ottiene una connessione al database MySQL
 */
export async function getDb() {
  try {
    console.log(
      "Tentativo di connessione al database con i seguenti parametri:"
    );
    console.log(`Host: ${process.env.DATABASE_HOST}`);
    console.log(`Port: ${process.env.DATABASE_PORT}`);
    console.log(`User: ${process.env.DATABASE_USERNAME}`);
    console.log(`Database: ${process.env.DATABASE_NAME}`);

    return db;
  } catch (error) {
    console.error("Errore durante la connessione al database:", error);
    return null;
  }
}

/**
 * Chiude la connessione al database
 */
export async function closeDb() {
  if (connection) {
    await connection.end();
  }
}
