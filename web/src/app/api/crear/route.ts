import { NextResponse } from "next/server";
import { guardarArchivo, listarDocumentos } from "@/lib/github";
import { aSlug, siguienteNumeroCapitulo } from "@/lib/libro";

/**
 * Crea un documento nuevo. Para el manuscrito numera solo, de modo que los
 * capítulos mantengan el orden por nombre de fichero sin pensar en ello.
 */
export async function POST(req: Request) {
  const { titulo, seccion } = (await req.json().catch(() => ({}))) as {
    titulo?: string;
    seccion?: string;
  };

  if (!titulo?.trim()) {
    return NextResponse.json({ error: "Hace falta un título" }, { status: 400 });
  }

  const carpeta = seccion === "biblia" || seccion === "notas" ? seccion : "manuscrito";
  const slug = aSlug(titulo) || "sin-titulo";

  try {
    const docs = await listarDocumentos();
    const rutas = docs.map((d) => d.path);

    const nombre =
      carpeta === "manuscrito" ? `${siguienteNumeroCapitulo(rutas)}-${slug}.md` : `${slug}.md`;
    const ruta = `${carpeta}/${nombre}`;

    if (rutas.includes(ruta)) {
      return NextResponse.json({ error: "Ya existe un documento con ese nombre" }, { status: 409 });
    }

    await guardarArchivo(ruta, `# ${titulo.trim()}\n\n`, `Crear ${ruta}`);
    return NextResponse.json({ ok: true, ruta });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
