import { NextResponse } from "next/server";
import sessionMiddleware from "./middleware/session";
import adminMiddleware from "./middleware/admin";

// Rutas que necesitan admin
const adminRoutes = ["/api/crearAdmin", "/api/registroAdmin"];

// Rutas que necesitan sesión (pero no necesariamente admin)
const protectedRoutes = ["/api/review", "/api/crearAdmin", "/api/registroAdmin"];

export function middleware(req) {
  const url = req.nextUrl.pathname;

  // Ejecutar protección por sesión solo si la ruta requiere
  if (protectedRoutes.some((r) => url.startsWith(r))) {
    const sessionResponse = sessionMiddleware(req);
    if (sessionResponse && sessionResponse.status >= 400) {
      return sessionResponse; // si hay error, lo retornamos
    }
  }

  // Ejecutar admin solo si la ruta requiere
  if (adminRoutes.some((r) => url.startsWith(r))) {
    const adminResponse = adminMiddleware(req);
    if (adminResponse) return adminResponse;
  }

  return NextResponse.next(); // si todo bien, pasa
}

// Configuración de Next.js
export const config = {
  matcher: ["/api/:path*"], // aplica a todas las rutas API
};
