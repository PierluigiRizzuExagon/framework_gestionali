import { DefaultSession } from "next-auth";
import { AuthError } from "next-auth";

// Estendi i tipi di next-auth
declare module "next-auth" {
  /**
   * Estende l'interfaccia User di next-auth
   */
  interface User {
    role?: {
      id: string;
      name: string;
    } | null;
    permissions?: string[];
  }

  /**
   * Estende l'interfaccia Session di next-auth
   */
  interface Session {
    user: {
      id: string;
      role?: {
        id: string;
        name: string;
      } | null;
      permissions?: string[];
    } & DefaultSession["user"];
  }

  /**
   * Estende l'interfaccia JWT di next-auth
   * In Next-Auth v5, JWT è definito all'interno del modulo "next-auth"
   */
  interface JWT {
    id: string;
    role?: {
      id: string;
      name: string;
    } | null;
    permissions?: string[];
  }
}

/**
 * Tipo per i risultati dell'autenticazione
 */
export type AuthResult = {
  success: boolean;
  message?: string;
  error?: Error | AuthError;
};

/**
 * Tipo per gli errori di validazione del form
 */
export type FormErrors =
  | {
      email?: string[];
      password?: string[];
      error?: string;
    }
  | undefined;
