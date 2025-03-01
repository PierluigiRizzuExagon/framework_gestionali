/**
 * Questi handler sono forniti da NextAuth.js per gestire le richieste di autenticazione.
 *
 * GET: Gestisce le richieste per ottenere la sessione dell'utente e altre operazioni di lettura
 * POST: Gestisce le richieste per login, logout e altre operazioni di scrittura
 *
 * Vengono importati dalla configurazione di NextAuth definita in @/lib/auth/auth
 * e poi esportati qui per essere utilizzati come API route di Next.js.
 *
 * Questo file è necessario per il funzionamento di NextAuth e deve essere posizionato
 * in questo percorso specifico (api/auth/[...nextauth]/route.ts) per gestire tutte
 * le richieste di autenticazione sotto il path /api/auth/*.
 */
import { handlers } from "@/lib/auth/auth";

export const { GET, POST } = handlers;
