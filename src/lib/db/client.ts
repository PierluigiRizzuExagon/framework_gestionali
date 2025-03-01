"use client";

// Questo file è sicuro da importare lato client
// Non contiene importazioni di moduli Node.js nativi

/**
 * Tipo per gli errori del database
 */
export type DbError = {
  message: string;
  code?: string;
};

/**
 * Funzione helper per gestire gli errori del database
 */
export function handleDbError(error: unknown): DbError {
  console.error("Errore del database:", error);

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Si è verificato un errore sconosciuto",
  };
}
