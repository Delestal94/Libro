import { NextResponse } from "next/server";
import { construirIndice, enlacesRotos, retroenlaces } from "@/lib/enlaces";
import { cargarProyecto } from "@/lib/proyecto";

/**
 * Todo lo que el editor necesita saber sobre enlaces del documento abierto.
 * Va en una llamada aparte para no retrasar la apertura del editor: primero se
 * ve el texto, y los retroenlaces aparecen medio segundo después.
 */
export async function GET(req: Request) {
  const ruta = new URL(req.url).searchParams.get("ruta") ?? "";

  try {
    const docs = await cargarProyecto();
    const indice = construirIndice(docs);
    const actual = docs.find((d) => d.ruta === ruta);

    return NextResponse.json({
      documentos: docs.map((d) => ({ ruta: d.ruta, titulo: d.titulo })),
      indice: [...indice.entries()],
      retroenlaces: ruta ? retroenlaces(ruta, docs, indice) : [],
      rotos: actual ? enlacesRotos(actual.contenido, indice) : [],
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
