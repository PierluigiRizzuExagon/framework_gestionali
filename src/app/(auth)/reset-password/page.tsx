"use client";

import { resetPasswordAction } from "@/lib/auth/auth.actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function ResetPasswordPage() {
  // Ottieni il token dall'URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  // Integrazione con Server Action
  const [actionState, formAction] = useActionState(resetPasswordAction, null);

  // Configurazione di React Hook Form
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Se non c'è un token, mostra un messaggio di errore
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Link non valido</h1>
            <p className="mt-2 text-gray-600">
              Il link per reimpostare la password non è valido o è scaduto.
            </p>
            <div className="mt-6">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-800"
              >
                Richiedi un nuovo link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se l'operazione è riuscita, mostra un messaggio di successo
  if (actionState?.success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Password aggiornata</h1>
            <div className="p-4 mt-4 text-green-700 bg-green-100 rounded-md">
              <p>{actionState.message}</p>
            </div>
            <div className="mt-6">
              <Link
                href="/login"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Accedi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reimposta la password</h1>
          <p className="mt-2 text-gray-600">Inserisci la tua nuova password</p>
        </div>

        <div className="space-y-6">
          <form action={formAction} className="space-y-6">
            {/* Campo nascosto per il token */}
            <input type="hidden" name="token" value={token} />

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nuova password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Conferma password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
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
                {isSubmitting
                  ? "Aggiornamento in corso..."
                  : "Reimposta password"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Torna alla pagina di login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
