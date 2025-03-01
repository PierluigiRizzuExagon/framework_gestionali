/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { db, testConnection, getDb, closeDb } from "./index";
import { revalidatePath } from "next/cache";

export { testConnection, getDb, closeDb };

/**
 * Esempio di Server Action per recuperare dati dal database
 */
export async function fetchData(table: string, id?: string) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Impossibile connettersi al database");
    }

    // Implementa la logica per recuperare i dati
    // ...

    return { success: true, data: {} };
  } catch (error) {
    console.error(`Errore durante il recupero dei dati da ${table}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    };
  }
}

/**
 * Esempio di Server Action per salvare dati nel database
 */
export async function saveData(table: string, data: any) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Impossibile connettersi al database");
    }

    // Implementa la logica per salvare i dati
    // ...

    // Revalida il percorso appropriato
    revalidatePath(`/${table}`);

    return { success: true };
  } catch (error) {
    console.error(`Errore durante il salvataggio dei dati in ${table}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    };
  }
}

// Aggiungi qui altre funzioni asincrone che devono essere eseguite sul server
