import { NextResponse } from "next/server";
import { guardarArchivo, leerArchivo, listarDocumentos } from "@/lib/github";
import { aSlug } from "@/lib/libro";
import { CARPETA, fichaNueva } from "@/lib/personajes";

/** Crea un personaje. El fichero se llama por el nombre; la ficha va vacía. */
export async function POST(req: Request) {
  const { nombre, ficha } = (await req.json().catch(() => ({}))) as {
    nombre?: string;
    ficha?: Record<string, string>;
  };

  if (!nombre?.trim()) {
    return NextResponse.json({ error: "Hace falta un nombre" }, { status: 400 });
  }

  const slug = aSlug(nombre);
  if (!slug) {
    return NextResponse.json(
      { error: "Ese nombre no da un nombre de fichero válido" },
      { status: 400 },
    );
  }

  const ruta = `${CARPETA}/${slug}.md`;

  try {
    const docs = await listarDocumentos();
    if (docs.some((d) => d.path === ruta)) {
      return NextResponse.json({ error: "Ya existe un personaje con ese nombre" }, { status: 409 });
    }

    // Sólo se guardan los campos con algo escrito.
    const limpios = Object.fromEntries(
      Object.entries(ficha ?? {}).filter(([, v]) => typeof v === "string" && v.trim()),
    );

    await guardarArchivo(ruta, fichaNueva(nombre.trim(), limpios), `Crear personaje: ${nombre}`);
    return NextResponse.json({ ok: true, ruta, slug });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** Devuelve el contenido bruto de una ficha, para editarla. */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug || slug.includes("/") || slug.includes("..")) {
    return NextResponse.json({ error: "Slug no válido" }, { status: 400 });
  }

  try {
    const doc = await leerArchivo(`${CARPETA}/${slug}.md`);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
