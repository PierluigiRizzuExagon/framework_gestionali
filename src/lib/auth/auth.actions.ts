"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/email/sendgrid";
import { revalidatePath } from "next/cache";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

/**
 * Tipo per il risultato dell'azione di recupero password
 */
type ForgotPasswordResult = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    [key: string]: string[] | undefined;
  };
};

/**
 * Server Action per richiedere il reset della password
 * @param prevState Stato precedente del form
 * @param formData Dati del form
 */
export async function forgotPasswordAction(
  prevState: ForgotPasswordResult | null,
  formData: FormData
): Promise<ForgotPasswordResult> {
  try {
    // Estrai e valida l'email
    const email = formData.get("email") as string;
    const validatedFields = forgotPasswordSchema.safeParse({ email });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Cerca l'utente nel database
    const user = await db.query.users.findFirst({
      where: eq(users.email, validatedFields.data.email),
    });

    // Se l'utente non esiste, non rivelare questa informazione per sicurezza
    if (!user) {
      // Simula un ritardo per prevenire timing attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        message:
          "Se l'email è registrata, riceverai istruzioni per reimpostare la password",
      };
    }

    // Genera un token di reset casuale
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Scade dopo 1 ora

    // Aggiorna l'utente con il token di reset
    await db
      .update(users)
      .set({
        resetToken,
        resetTokenExpiry: resetTokenExpiry.toISOString(),
      })
      .where(eq(users.id, user.id));

    // Invia l'email di reset
    await sendPasswordResetEmail(user.email, resetToken);

    // Revalida il percorso
    revalidatePath("/forgot-password");

    return {
      success: true,
      message:
        "Se l'email è registrata, riceverai istruzioni per reimpostare la password",
    };
  } catch (error) {
    console.error("Errore durante la richiesta di reset password:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Si è verificato un errore",
    };
  }
}

/**
 * Tipo per il risultato dell'azione di reset password
 */
type ResetPasswordResult = {
  success: boolean;
  message?: string;
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    [key: string]: string[] | undefined;
  };
};

/**
 * Server Action per reimpostare la password
 * @param prevState Stato precedente del form
 * @param formData Dati del form
 */
export async function resetPasswordAction(
  prevState: ResetPasswordResult | null,
  formData: FormData
): Promise<ResetPasswordResult> {
  try {
    // Estrai i dati dal form
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Valida i dati
    const validatedFields = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Verifica che il token sia valido
    if (!token) {
      return {
        success: false,
        message:
          "Token mancante. Richiedi un nuovo link per reimpostare la password.",
      };
    }

    // Cerca l'utente con il token di reset
    const user = await db.query.users.findFirst({
      where: eq(users.resetToken, token),
    });

    if (!user) {
      return {
        success: false,
        message:
          "Token non valido. Richiedi un nuovo link per reimpostare la password.",
      };
    }

    // Verifica che il token non sia scaduto
    if (user.resetTokenExpiry) {
      const expiry = new Date(user.resetTokenExpiry);
      if (expiry < new Date()) {
        return {
          success: false,
          message:
            "Token scaduto. Richiedi un nuovo link per reimpostare la password.",
        };
      }
    }

    // Hash della nuova password
    const hashedPassword = await hash(validatedFields.data.password, 10);

    // Aggiorna la password e rimuovi il token di reset
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    // Revalida il percorso
    revalidatePath("/confirm-password");

    return {
      success: true,
      message:
        "Password aggiornata con successo. Ora puoi accedere con la nuova password.",
    };
  } catch (error) {
    console.error("Errore durante il reset della password:", error);
    return {
      success: false,
      message:
        "Si è verificato un errore durante l'elaborazione della richiesta.",
    };
  }
}
