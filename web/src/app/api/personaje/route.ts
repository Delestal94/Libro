import { NextResponse } from "next/server";
import { borrarArchivo, guardarArchivo, leerArchivo } from "@/lib/github";
import { CARPETA, componerCabecera, separarCabecera } from "@/lib/personajes";

function rutaDe(slug: string | undefined | null): string | null {
  if (!slug || slug.includes("/") || slug.includes("..") || !slug.trim()) return null;
  return `${CARPETA}/${slug}.md`;
}

/**
 * Actualiza la ficha técnica sin tocar la biografía, o la biografía sin tocar
 * la ficha. Van por separado porque se editan en momentos distintos: los datos
 * de un tirón, el texto poco a poco.
 */
export async function PATCH(req: Request) {
  const { slug, ficha, cuerpo } = (await req.json().catch(() => ({}))) as {
    slug?: string;
    ficha?: Record<string, string>;
    cuerpo?: string;
  };

  const ruta = rutaDe(slug);
  if (!ruta) return NextResponse.json({ error: "Slug no válido" }, { status: 400 });

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const actual = separarCabecera(doc.contenido);

    // `ficha` sustituye la cabecera entera: así, quitar un campo lo quita de
    // verdad del fichero en vez de dejarlo con el valor vacío.
    const datos = ficha
      ? Object.fromEntries(
          Object.entries(ficha).filter(([, v]) => typeof v === "string" && v.trim()),
        )
      : actual.datos;

    const texto = componerCabecera(datos, cuerpo ?? actual.cuerpo);
    const { sha } = await guardarArchivo(ruta, texto, `Actualizar ficha: ${slug}`, doc.sha);

    return NextResponse.json({ ok: true, sha });
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.includes("GitHub 409") || msg.includes("GitHub 422")) {
      return NextResponse.json(
        { error: "La ficha cambió desde que la abriste. Recarga para no perder el otro cambio." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { slug } = (await req.json().catch(() => ({}))) as { slug?: string };
  const ruta = rutaDe(slug);
  if (!ruta) return NextResponse.json({ error: "Slug no válido" }, { status: 400 });

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    await borrarArchivo(ruta, doc.sha, `Borrar personaje: ${slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
