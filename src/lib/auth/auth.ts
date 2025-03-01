import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { AuthResult } from "./types";

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

/**
 * Funzione per autenticare un utente
 * @param email Email dell'utente
 * @param password Password dell'utente
 * @returns Risultato dell'autenticazione
 */
export async function authenticate(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Errore durante l'autenticazione:", error);
    return {
      success: false,
      error: new Error("Credenziali non valide. Riprova."),
    };
  }
}
