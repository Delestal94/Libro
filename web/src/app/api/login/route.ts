import { NextResponse } from "next/server";
import { COOKIE, contrasenaCorrecta, crearSesion } from "@/lib/auth";

export async function POST(req: Request) {
  const { contrasena } = (await req.json().catch(() => ({}))) as { contrasena?: string };

  if (!contrasena || !(await contrasenaCorrecta(contrasena))) {
    // Retardo fijo: frena la fuerza bruta sin revelar nada por el tiempo de respuesta.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const { valor, maxAge } = await crearSesion();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, valor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
