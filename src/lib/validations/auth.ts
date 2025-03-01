import { z } from "zod";

/**
 * Schema di validazione per il login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Inserisci un indirizzo email valido")
    .min(1, "L'email è obbligatoria"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .max(100, "La password non può superare i 100 caratteri"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema di validazione per il recupero password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Inserisci un indirizzo email valido")
    .min(1, "L'email è obbligatoria"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema di validazione per il reset della password
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri")
      .max(100, "La password non può superare i 100 caratteri"),
    confirmPassword: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
