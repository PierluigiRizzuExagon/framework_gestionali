import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

// Percorsi pubblici che non richiedono autenticazione
const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
  // Escludi completamente le rotte di API di autenticazione dal middleware
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await auth();
  const { pathname } = request.nextUrl;

  console.log(`Middleware eseguito per il percorso: ${pathname}`);
  console.log(`Stato sessione:`, session ? "Autenticato" : "Non autenticato");

  // Verifica se il percorso è pubblico
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Se l'utente non è autenticato e il percorso non è pubblico, reindirizza al login
  if (!session && !isPublicPath) {
    console.log(`Reindirizzamento a /login da ${pathname}`);

    // Salva l'URL originale come parametro di query per reindirizzare dopo il login
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(url);
  }

  // Se l'utente è autenticato e sta cercando di accedere a una pagina di autenticazione,
  // reindirizza alla dashboard
  if (session && isPublicPath) {
    console.log(
      `Utente già autenticato, reindirizzamento a /dashboard da ${pathname}`
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configura il middleware per essere eseguito su tutte le rotte tranne quelle statiche e le API di auth
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     * - api/auth (auth API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)",
  ],
};
