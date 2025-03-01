"use client";

import { signIn, signOut } from "next-auth/react";
import { LoginFormData } from "@/lib/validations/auth";

/**
 * Funzione client per il login
 */
export async function clientLogin(data: LoginFormData) {
  return signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });
}

/**
 * Funzione client per il logout
 */
export async function clientLogout(callbackUrl = "/login") {
  return signOut({ callbackUrl });
}
