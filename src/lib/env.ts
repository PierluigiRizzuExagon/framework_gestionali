import { config } from "dotenv";

// Carica le variabili d'ambiente
config();

// Verifica che le variabili essenziali siano definite solo lato server e durante l'esecuzione
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  const requiredEnvVars = [
    "NEXT_PUBLIC_AUTH_SECRET", // Aggiornato per usare la tua variabile
    "NEXT_PUBLIC_DATABASE_HOST",
    "NEXT_PUBLIC_DATABASE_USER",
    "NEXT_PUBLIC_DATABASE_PASSWORD",
    "NEXT_PUBLIC_DATABASE_NAME",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Variabile d'ambiente mancante: ${envVar}`);
    }
  }
}
