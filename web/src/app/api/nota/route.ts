import { NextResponse } from "next/server";
import { anexar } from "@/lib/github";
import { RUTA_INBOX } from "@/lib/libro";

/**
 * Captura rápida: una nota con fecha al final de notas/inbox.md.
 * Pensado para escribir en treinta segundos y cerrar el móvil.
 */
export async function POST(req: Request) {
  const { texto } = (await req.json().catch(() => ({}))) as { texto?: string };

  if (!texto || !texto.trim()) {
    return NextResponse.json({ error: "La nota está vacía" }, { status: 400 });
  }

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const hora = ahora.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const entrada = `\n## ${fecha} · ${hora}\n\n${texto.trim()}\n`;

  try {
    await anexar(
      RUTA_INBOX,
      entrada,
      `Nota rápida ${fecha} ${hora}`,
      "# Inbox\n\n> Capturas rápidas desde el móvil. Lo que sobreviva a releerse, sube a la biblia.\n",
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
