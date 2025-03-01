import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function initTables() {
  try {
    console.log("Tentativo di connessione al database...");

    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DATABASE_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_DATABASE_PORT || "3306"),
      user: process.env.NEXT_PUBLIC_DATABASE_USER,
      password: process.env.NEXT_PUBLIC_DATABASE_PASSWORD,
      database: process.env.NEXT_PUBLIC_DATABASE_NAME,
    });

    console.log("Connessione riuscita! Creazione delle tabelle...");

    // Crea la tabella roles
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabella 'roles' creata.");

    // Crea la tabella permissions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabella 'permissions' creata.");

    // Crea la tabella role_permissions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id VARCHAR(128) NOT NULL,
        permission_id VARCHAR(128) NOT NULL,
        PRIMARY KEY (role_id, permission_id)
      )
    `);
    console.log("Tabella 'role_permissions' creata.");

    // Crea la tabella users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id VARCHAR(128),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabella 'users' creata.");

    // Crea la tabella notifications
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        user_id VARCHAR(128),
        role_id VARCHAR(128),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabella 'notifications' creata.");

    // Verifica le tabelle create
    const [tables] = await connection.query("SHOW TABLES");
    console.log("Tabelle nel database:");
    console.table(tables);

    // Chiudi la connessione
    await connection.end();
    console.log("Inizializzazione completata con successo!");
  } catch (error) {
    console.error("Errore durante l'inizializzazione delle tabelle:", error);
  }
}

// Esegui la funzione
initTables();
