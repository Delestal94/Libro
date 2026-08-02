import { NextResponse } from "next/server";
import { guardarArchivo, leerArchivo } from "@/lib/github";
import { anadirFila, extraerTabla, reemplazarTabla } from "@/lib/tablas";

/** Solo se manipulan las tablas de estos dos documentos. */
const PERMITIDOS: Record<string, string[]> = {
  "biblia/pistas.md": ["Pista", "Sembrada en", "Recogida en", "Estado"],
  "biblia/cronologia.md": ["Cuándo", "Qué ocurre", "Capítulo", "Lector"],
};

export async function POST(req: Request) {
  const { ruta, fila } = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    fila?: string[];
  };

  if (!ruta || !PERMITIDOS[ruta] || !Array.isArray(fila)) {
    return NextResponse.json({ error: "Petición no válida" }, { status: 400 });
  }

  try {
    const doc = await leerArchivo(ruta);
    const base = doc?.contenido ?? "";
    const nuevo = anadirFila(base, fila.map(String), PERMITIDOS[ruta]);
    await guardarArchivo(ruta, nuevo, `Añadir fila a ${ruta}`, doc?.sha);
    return NextResponse.json({ ok: true, tabla: extraerTabla(nuevo) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** Actualiza una celda concreta: sirve para cambiar el estado de una pista. */
export async function PATCH(req: Request) {
  const { ruta, indiceFila, indiceColumna, valor } = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    indiceFila?: number;
    indiceColumna?: number;
    valor?: string;
  };

  if (
    !ruta ||
    !PERMITIDOS[ruta] ||
    typeof indiceFila !== "number" ||
    typeof indiceColumna !== "number" ||
    typeof valor !== "string"
  ) {
    return NextResponse.json({ error: "Petición no válida" }, { status: 400 });
  }

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const tabla = extraerTabla(doc.contenido);
    if (!tabla?.filas[indiceFila]) {
      return NextResponse.json({ error: "Esa fila ya no existe" }, { status: 409 });
    }

    const filas = tabla.filas.map((f, i) =>
      i === indiceFila ? f.map((c, j) => (j === indiceColumna ? valor : c)) : f,
    );
    const nuevo = reemplazarTabla(doc.contenido, { ...tabla, filas });
    await guardarArchivo(ruta, nuevo, `Actualizar ${ruta}`, doc.sha);

    return NextResponse.json({ ok: true, tabla: extraerTabla(nuevo) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** Sustituye una fila entera. */
export async function PUT(req: Request) {
  const { ruta, indiceFila, fila } = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    indiceFila?: number;
    fila?: string[];
  };

  if (!ruta || !PERMITIDOS[ruta] || typeof indiceFila !== "number" || !Array.isArray(fila)) {
    return NextResponse.json({ error: "Petición no válida" }, { status: 400 });
  }

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const tabla = extraerTabla(doc.contenido);
    if (!tabla?.filas[indiceFila]) {
      return NextResponse.json({ error: "Esa fila ya no existe" }, { status: 409 });
    }

    const nueva = fila.map(String).slice(0, tabla.cabeceras.length);
    while (nueva.length < tabla.cabeceras.length) nueva.push("");

    const filas = tabla.filas.map((f, i) => (i === indiceFila ? nueva : f));
    const nuevo = reemplazarTabla(doc.contenido, { ...tabla, filas });
    await guardarArchivo(ruta, nuevo, `Editar fila de ${ruta}`, doc.sha);

    return NextResponse.json({ ok: true, tabla: extraerTabla(nuevo) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** Borra una fila. */
export async function DELETE(req: Request) {
  const { ruta, indiceFila } = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    indiceFila?: number;
  };

  if (!ruta || !PERMITIDOS[ruta] || typeof indiceFila !== "number") {
    return NextResponse.json({ error: "Petición no válida" }, { status: 400 });
  }

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const tabla = extraerTabla(doc.contenido);
    if (!tabla?.filas[indiceFila]) {
      return NextResponse.json({ error: "Esa fila ya no existe" }, { status: 409 });
    }

    const filas = tabla.filas.filter((_, i) => i !== indiceFila);
    const nuevo = reemplazarTabla(doc.contenido, { ...tabla, filas });
    await guardarArchivo(ruta, nuevo, `Quitar fila de ${ruta}`, doc.sha);

    return NextResponse.json({ ok: true, tabla: extraerTabla(nuevo) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
