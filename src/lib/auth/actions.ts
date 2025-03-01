"use server";

import { signOut as authSignOut } from "@/lib/auth/auth";

/**
 * Esegue il logout dell'utente
 */
export async function signOut() {
  await authSignOut();
  return { success: true };
}
