import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function checkConnection() {
  try {
    console.log("Tentativo di connessione al database...");
    console.log({
      host: process.env.NEXT_PUBLIC_DATABASE_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_DATABASE_PORT || "3306"),
      user: process.env.NEXT_PUBLIC_DATABASE_USER,
      password: process.env.NEXT_PUBLIC_DATABASE_PASSWORD,
      database: process.env.NEXT_PUBLIC_DATABASE_NAME,
    });

    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DATABASE_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_DATABASE_PORT || "3306"),
      user: process.env.NEXT_PUBLIC_DATABASE_USER,
      password: process.env.NEXT_PUBLIC_DATABASE_PASSWORD,
      database: process.env.NEXT_PUBLIC_DATABASE_NAME,
    });

    console.log("Connessione riuscita!");

    // Verifica le tabelle
    const [tables] = await connection.query("SHOW TABLES");
    console.log("Tabelle nel database:");
    console.table(tables);

    // Chiudi la connessione
    await connection.end();
  } catch (error) {
    console.error("Errore durante la connessione al database:", error);
  }
}

// Esegui la funzione
checkConnection();
