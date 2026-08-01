import { NextResponse } from "next/server";
import { borrarArchivo, guardarArchivo, leerArchivo } from "@/lib/github";
import { contarPalabras } from "@/lib/libro";

function validarRuta(ruta: string | null): string | null {
  if (!ruta) return null;
  // Sin rutas absolutas, sin salir del repo y sin tocar la propia app.
  if (ruta.includes("..") || ruta.startsWith("/") || ruta.startsWith("web/")) return null;
  if (!ruta.endsWith(".md")) return null;
  return ruta;
}

export async function GET(req: Request) {
  const ruta = validarRuta(new URL(req.url).searchParams.get("ruta"));
  if (!ruta) return NextResponse.json({ error: "Ruta no válida" }, { status: 400 });

  try {
    const doc = await leerArchivo(ruta);
    if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json({ ...doc, palabras: contarPalabras(doc.contenido) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const cuerpo = (await req.json().catch(() => ({}))) as {
    ruta?: string;
    contenido?: string;
    sha?: string;
    mensaje?: string;
  };

  const ruta = validarRuta(cuerpo.ruta ?? null);
  if (!ruta || typeof cuerpo.contenido !== "string") {
    return NextResponse.json({ error: "Ruta o contenido no válidos" }, { status: 400 });
  }

  try {
    const { sha } = await guardarArchivo(
      ruta,
      cuerpo.contenido,
      cuerpo.mensaje || `Editar ${ruta} desde el móvil`,
      cuerpo.sha,
    );
    return NextResponse.json({ ok: true, sha, palabras: contarPalabras(cuerpo.contenido) });
  } catch (e) {
    const msg = (e as Error).message;
    // 409 = el fichero cambió desde que se abrió. Mejor avisar que pisar trabajo.
    if (msg.includes("GitHub 409") || msg.includes("GitHub 422")) {
      return NextResponse.json(
        {
          error:
            "Este fichero cambió desde que lo abriste (¿lo editaste en el PC?). Recarga para no perder el otro cambio.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const cuerpo = (await req.json().catch(() => ({}))) as { ruta?: string; sha?: string };
  const ruta = validarRuta(cuerpo.ruta ?? null);
  if (!ruta || !cuerpo.sha) {
    return NextResponse.json({ error: "Ruta o sha no válidos" }, { status: 400 });
  }

  try {
    await borrarArchivo(ruta, cuerpo.sha, `Borrar ${ruta}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
