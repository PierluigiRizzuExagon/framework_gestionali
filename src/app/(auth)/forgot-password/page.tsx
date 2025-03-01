"use client";

import { forgotPasswordAction } from "@/lib/auth/auth.actions";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  // Integrazione con Server Action
  const [actionState, formAction] = useActionState(forgotPasswordAction, null);

  // Configurazione di React Hook Form
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "p.rizzu@exagonch.com",
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Password dimenticata</h1>
          <p className="mt-2 text-gray-600">
            Inserisci la tua email per ricevere un link di reset
          </p>
        </div>

        <div className="space-y-6">
          {/* Messaggio di successo */}
          {actionState?.success && actionState?.message && (
            <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
              {actionState.message}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Messaggio di errore generale */}
            {actionState?.message && !actionState?.success && (
              <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
                {actionState.message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Invio in corso..." : "Invia link di reset"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Torna alla pagina di login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
