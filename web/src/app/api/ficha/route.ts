import { NextResponse } from "next/server";
import { borrarArchivo, guardarArchivo, leerArchivo } from "@/lib/github";
import { TIPOS, componerCabecera, esTipoValido, separarCabecera, slugValido } from "@/lib/fichas";

/** Ruta segura de una ficha, o null si el tipo o el slug no valen. */
function rutaDe(tipo: unknown, slug: unknown): string | null {
  if (typeof tipo !== "string" || !esTipoValido(tipo)) return null;
  if (!slugValido(slug)) return null;
  return `${TIPOS[tipo].carpeta}/${slug}.md`;
}

/**
 * Actualiza los datos técnicos sin tocar el texto, o el texto sin tocar los
 * datos. Van por separado porque se editan en momentos distintos: la ficha de
 * un tirón, el texto poco a poco.
 */
export async function PATCH(req: Request) {
  const cuerpoPeticion = (await req.json().catch(() => ({}))) as {
    tipo?: string;
    slug?: string;
    datos?: Record<string, string>;
    cuerpo?: string;
  };

  const ruta = rutaDe(cuerpoPeticion.tipo, cuerpoPeticion.slug);
  if (!ruta) return NextResponse.json({ error: "Tipo o slug no válidos" }, { status: 400 });

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const actual = separarCabecera(doc.contenido);

    // `datos` sustituye la cabecera entera: así, quitar un campo lo quita de
    // verdad del fichero en vez de dejarlo con el valor vacío.
    const datos = cuerpoPeticion.datos
      ? Object.fromEntries(
          Object.entries(cuerpoPeticion.datos).filter(
            ([, v]) => typeof v === "string" && v.trim(),
          ),
        )
      : actual.datos;

    const texto = componerCabecera(datos, cuerpoPeticion.cuerpo ?? actual.cuerpo);
    const { sha } = await guardarArchivo(
      ruta,
      texto,
      `Actualizar ficha: ${cuerpoPeticion.slug}`,
      doc.sha,
    );

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
  const { tipo, slug } = (await req.json().catch(() => ({}))) as {
    tipo?: string;
    slug?: string;
  };

  const ruta = rutaDe(tipo, slug);
  if (!ruta) return NextResponse.json({ error: "Tipo o slug no válidos" }, { status: 400 });

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    await borrarArchivo(ruta, doc.sha, `Borrar ficha: ${slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
