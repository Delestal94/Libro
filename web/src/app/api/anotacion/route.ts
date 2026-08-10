import { NextResponse } from "next/server";
import { guardarArchivo, leerArchivo } from "@/lib/github";
import {
  agregarAnotacion,
  quitarAnotacion,
  editarAnotacion,
  ENCABEZADO_ANOTACIONES,
  COLORES,
  type Color,
} from "@/lib/anotaciones";
import { RUTA_ANOTACIONES } from "@/lib/libro";

const LIMITE_CITA = 500;
const LIMITE_COMENTARIO = 1000;

/** Las tablas Markdown no admiten saltos de línea dentro de una celda. */
function limpiar(texto: string, maximo: number): string {
  return texto.replace(/\s+/g, " ").trim().slice(0, maximo);
}

function colorValido(valor: unknown): Color {
  return typeof valor === "string" && (COLORES as readonly string[]).includes(valor)
    ? (valor as Color)
    : "dorado";
}

/**
 * Guarda un subrayado (o un subrayado con comentario) hecho desde el lector.
 * Es una fila más en `notas/anotaciones.md`, igual que un capítulo nuevo.
 */
export async function POST(req: Request) {
  const { ruta, cita, comentario, color } = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    cita?: string;
    comentario?: string;
    color?: string;
  };

  if (!ruta || !cita || !cita.trim()) {
    return NextResponse.json({ error: "Falta la cita o el capítulo" }, { status: 400 });
  }

  const citaLimpia = limpiar(cita, LIMITE_CITA);
  const comentarioLimpio = limpiar(comentario ?? "", LIMITE_COMENTARIO);
  const colorElegido = colorValido(color);

  try {
    const doc = await leerArchivo(RUTA_ANOTACIONES);
    const base = doc?.contenido ?? ENCABEZADO_ANOTACIONES;
    const { contenido, anotacion } = agregarAnotacion(base, {
      ruta,
      cita: citaLimpia,
      comentario: comentarioLimpio,
      color: colorElegido,
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

/** Cambia el comentario y/o el color de una anotación ya guardada. */
export async function PUT(req: Request) {
  const { id, comentario, color } = (await req.json().catch(() => ({}))) as {
    id?: string;
    comentario?: string;
    color?: string;
  };

  if (!id) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  try {
    const doc = await leerArchivo(RUTA_ANOTACIONES);
    if (!doc) return NextResponse.json({ error: "No hay anotaciones" }, { status: 404 });

    const cambios: { comentario?: string; color?: Color } = {};
    if (comentario !== undefined) cambios.comentario = limpiar(comentario, LIMITE_COMENTARIO);
    if (color !== undefined) cambios.color = colorValido(color);

    const resultado = editarAnotacion(doc.contenido, id, cambios);
    if (!resultado) return NextResponse.json({ error: "Esa anotación ya no existe" }, { status: 409 });

    await guardarArchivo(RUTA_ANOTACIONES, resultado.contenido, "Editar anotación", doc.sha);

    return NextResponse.json({ ok: true, anotacion: resultado.anotacion });
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
