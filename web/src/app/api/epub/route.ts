import { marked } from "marked";
import { NextResponse } from "next/server";
import { leerArchivo } from "@/lib/github";
import { cargarProyecto, capitulos } from "@/lib/proyecto";
import { construirEpub } from "@/lib/epub";
import { aSlug } from "@/lib/libro";

/** Lee title/author de metadatos.yaml sin meter un parser de YAML entero. */
function metadatos(yaml: string | null) {
  const campo = (nombre: string) =>
    yaml?.match(new RegExp(`^${nombre}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1]?.trim() || "";

  return {
    titulo: campo("title") || "Sin título",
    autor: campo("author") || "Anónimo",
  };
}

export async function GET() {
  try {
    const [docs, yaml] = await Promise.all([
      cargarProyecto(),
      leerArchivo("metadatos.yaml").catch(() => null),
    ]);

    const caps = capitulos(docs);
    if (!caps.length) {
      return NextResponse.json({ error: "Aún no hay capítulos que exportar" }, { status: 400 });
    }

    const meta = metadatos(yaml?.contenido ?? null);

    const epub = construirEpub(
      meta,
      caps.map((c) => ({
        titulo: c.titulo,
        // El título ya lo pinta la plantilla del capítulo; se quita del cuerpo.
        html: marked.parse(c.contenido.replace(/^#\s+.+$/m, ""), {
          async: false,
          breaks: false,
        }) as string,
      })),
    );

    const nombre = `${aSlug(meta.titulo) || "libro"}.epub`;

    return new NextResponse(Buffer.from(epub), {
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": `attachment; filename="${nombre}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
