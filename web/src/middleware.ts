import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, sesionValida } from "@/lib/auth";

/** Todo está protegido salvo el propio login y los recursos estáticos. */
const PUBLICO = ["/login", "/api/login", "/manifest.webmanifest", "/icono.svg", "/sw.js"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLICO.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  if (await sesionValida(req.cookies.get(COOKIE)?.value)) {
    return NextResponse.next();
  }

  // Las llamadas de API responden 401 en vez de redirigir, para que el cliente
  // distinga "sesión caducada" de "la respuesta es una página de login".
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = pathname === "/" ? "" : `?destino=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
