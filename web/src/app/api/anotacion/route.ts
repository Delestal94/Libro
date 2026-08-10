import { NextResponse } from "next/server";
import { guardarArchivo, leerArchivo } from "@/lib/github";
import { agregarAnotacion, quitarAnotacion, ENCABEZADO_ANOTACIONES } from "@/lib/anotaciones";
import { RUTA_ANOTACIONES } from "@/lib/libro";

const LIMITE_CITA = 500;
const LIMITE_COMENTARIO = 1000;

/** Las tablas Markdown no admiten saltos de línea dentro de una celda. */
function limpiar(texto: string, maximo: number): string {
  return texto.replace(/\s+/g, " ").trim().slice(0, maximo);
}

/**
 * Guarda un subrayado (o un subrayado con comentario) hecho desde el lector.
 * Es una fila más en `notas/anotaciones.md`, igual que un capítulo nuevo.
 */
export async function POST(req: Request) {
  const { ruta, cita, comentario } = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    cita?: string;
    comentario?: string;
  };

  if (!ruta || !cita || !cita.trim()) {
    return NextResponse.json({ error: "Falta la cita o el capítulo" }, { status: 400 });
  }

  const citaLimpia = limpiar(cita, LIMITE_CITA);
  const comentarioLimpio = limpiar(comentario ?? "", LIMITE_COMENTARIO);

  try {
    const doc = await leerArchivo(RUTA_ANOTACIONES);
    const base = doc?.contenido ?? ENCABEZADO_ANOTACIONES;
    const { contenido, anotacion } = agregarAnotacion(base, {
      ruta,
      cita: citaLimpia,
      comentario: comentarioLimpio,
    });

    await guardarArchivo(
      RUTA_ANOTACIONES,
      contenido,
      comentarioLimpio ? `Comentario en ${ruta}` : `Subrayado en ${ruta}`,
      doc?.sha,
    );

    return NextResponse.json({ ok: true, anotacion });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  try {
    const doc = await leerArchivo(RUTA_ANOTACIONES);
    if (!doc) return NextResponse.json({ error: "No hay anotaciones" }, { status: 404 });

    const contenido = quitarAnotacion(doc.contenido, id);
    await guardarArchivo(RUTA_ANOTACIONES, contenido, "Quitar anotación", doc.sha);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
