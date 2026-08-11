import { NextResponse } from "next/server";
import { guardarArchivo, leerArchivo } from "@/lib/github";
import {
  agregarAnotacion,
  editarAnotacion,
  quitarAnotacion,
  esColor,
  COLOR_POR_DEFECTO,
  ENCABEZADO_ANOTACIONES,
  type Anotacion,
  type Color,
} from "@/lib/anotaciones";
import { RUTA_ANOTACIONES } from "@/lib/libro";

const LIMITE_TEXTO = 500;
const LIMITE_COMENTARIO = 1000;
const REINTENTOS = 4;

/** Las celdas de una tabla Markdown no admiten saltos de línea. */
function limpiar(texto: string, maximo: number): string {
  return texto.replace(/\s+/g, " ").trim().slice(0, maximo);
}

function color(valor: unknown): Color {
  return esColor(valor) ? valor : COLOR_POR_DEFECTO;
}

/**
 * Lee, modifica y guarda `notas/anotaciones.md` reintentando si alguien tocó
 * el fichero mientras tanto.
 *
 * Cada anotación es un commit contra el mismo fichero, así que dos subrayados
 * seguidos —o dos dispositivos a la vez— chocan: GitHub rechaza el segundo
 * porque su `sha` ya no es el de la punta. Reintentar releyendo es lo correcto
 * aquí, y no lo es en el editor de capítulos: allí un conflicto significa dos
 * versiones del mismo texto y hay que preguntar. Aquí las operaciones son
 * independientes entre sí (una fila cada una), así que se pueden reaplicar
 * sobre lo último sin perder nada de nadie.
 */
async function modificar<T>(
  mutar: (contenido: string) => { contenido: string; resultado: T } | null,
  mensaje: string,
): Promise<{ ok: true; resultado: T } | { ok: false; estado: number; error: string }> {
  let ultimoError = "";

  for (let intento = 0; intento < REINTENTOS; intento++) {
    const doc = await leerArchivo(RUTA_ANOTACIONES);
    const base = doc?.contenido ?? ENCABEZADO_ANOTACIONES;

    const cambio = mutar(base);
    if (!cambio) return { ok: false, estado: 409, error: "Esa anotación ya no existe" };

    // Sin cambios reales (una operación repetida por la cola): nada que subir.
    if (cambio.contenido === base) return { ok: true, resultado: cambio.resultado };

    try {
      await guardarArchivo(RUTA_ANOTACIONES, cambio.contenido, mensaje, doc?.sha);
      return { ok: true, resultado: cambio.resultado };
    } catch (e) {
      const msg = (e as Error).message;
      ultimoError = msg;
      const conflicto = msg.includes("GitHub 409") || msg.includes("GitHub 422");
      if (!conflicto) return { ok: false, estado: 500, error: msg };
      // Espera creciente y corta: el conflicto se resuelve releyendo, no
      // insistiendo rápido.
      await new Promise((r) => setTimeout(r, 150 * (intento + 1)));
    }
  }

  return {
    ok: false,
    estado: 503,
    error: `No se pudo guardar tras varios intentos: ${ultimoError}`,
  };
}

/**
 * Crea un subrayado. El `id` lo pone el cliente para poder pintar la marca
 * antes de que esto conteste; si la misma operación llega dos veces (cola que
 * reintenta), la segunda no duplica nada.
 */
export async function POST(req: Request) {
  const cuerpo = (await req.json().catch(() => ({}))) as {
    id?: string;
    ruta?: string;
    texto?: string;
    aparicion?: number;
    comentario?: string;
    color?: string;
  };

  const texto = limpiar(cuerpo.texto ?? "", LIMITE_TEXTO);
  if (!cuerpo.id || !cuerpo.ruta || !texto) {
    return NextResponse.json({ error: "Falta el id, el capítulo o el texto" }, { status: 400 });
  }

  const aparicion =
    Number.isFinite(cuerpo.aparicion) && (cuerpo.aparicion as number) >= 0
      ? Math.floor(cuerpo.aparicion as number)
      : 0;

  const salida = await modificar<Anotacion>((contenido) => {
    const { contenido: nuevo, anotacion } = agregarAnotacion(contenido, {
      id: cuerpo.id!,
      ruta: cuerpo.ruta!,
      texto,
      aparicion,
      comentario: limpiar(cuerpo.comentario ?? "", LIMITE_COMENTARIO),
      color: color(cuerpo.color),
    });
    return { contenido: nuevo, resultado: anotacion };
  }, `Subrayado en ${cuerpo.ruta}`);

  return salida.ok
    ? NextResponse.json({ ok: true, anotacion: salida.resultado })
    : NextResponse.json({ error: salida.error }, { status: salida.estado });
}

/** Cambia comentario y/o color. El texto anclado nunca se toca. */
export async function PUT(req: Request) {
  const { id, comentario, color: colorNuevo } = (await req.json().catch(() => ({}))) as {
    id?: string;
    comentario?: string;
    color?: string;
  };

  if (!id) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  const cambios: { comentario?: string; color?: Color } = {};
  if (comentario !== undefined) cambios.comentario = limpiar(comentario, LIMITE_COMENTARIO);
  if (colorNuevo !== undefined) cambios.color = color(colorNuevo);

  const salida = await modificar<Anotacion>((contenido) => {
    const r = editarAnotacion(contenido, id, cambios);
    return r && { contenido: r.contenido, resultado: r.anotacion };
  }, "Editar anotación");

  return salida.ok
    ? NextResponse.json({ ok: true, anotacion: salida.resultado })
    : NextResponse.json({ error: salida.error }, { status: salida.estado });
}

/** Borrar algo que ya no está se considera hecho: la cola puede reintentar. */
export async function DELETE(req: Request) {
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  const salida = await modificar<true>(
    (contenido) => ({ contenido: quitarAnotacion(contenido, id), resultado: true }),
    "Quitar anotación",
  );

  return salida.ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: salida.error }, { status: salida.estado });
}
