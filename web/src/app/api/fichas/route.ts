import { NextResponse } from "next/server";
import { guardarArchivo, listarDocumentos } from "@/lib/github";
import { aSlug } from "@/lib/libro";
import { TIPOS, esTipoValido, fichaNueva, slugValido } from "@/lib/fichas";

/** Crea una ficha del tipo indicado. */
export async function POST(req: Request) {
  const { tipo, nombre, datos } = (await req.json().catch(() => ({}))) as {
    tipo?: string;
    nombre?: string;
    datos?: Record<string, string>;
  };

  if (!tipo || !esTipoValido(tipo)) {
    return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
  }
  if (!nombre?.trim()) {
    return NextResponse.json({ error: "Hace falta un nombre" }, { status: 400 });
  }

  const slug = aSlug(nombre);
  if (!slugValido(slug)) {
    return NextResponse.json(
      { error: "Ese nombre no da un nombre de fichero válido" },
      { status: 400 },
    );
  }

  const ruta = `${TIPOS[tipo].carpeta}/${slug}.md`;

  try {
    const docs = await listarDocumentos();
    if (docs.some((d) => d.path === ruta)) {
      return NextResponse.json(
        { error: `Ya existe un ${TIPOS[tipo].singular} con ese nombre` },
        { status: 409 },
      );
    }

    // Sólo se guardan los campos con algo escrito.
    const limpios = Object.fromEntries(
      Object.entries(datos ?? {}).filter(([, v]) => typeof v === "string" && v.trim()),
    );

    await guardarArchivo(
      ruta,
      fichaNueva(tipo, nombre.trim(), limpios),
      `Crear ${TIPOS[tipo].singular}: ${nombre}`,
    );
    return NextResponse.json({ ok: true, ruta, slug });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
