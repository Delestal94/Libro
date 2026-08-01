import { NextResponse } from "next/server";
import { leerBlob, listarDocumentos } from "@/lib/github";
import { tituloDe } from "@/lib/libro";

export type Coincidencia = {
  ruta: string;
  titulo: string;
  linea: number;
  texto: string;
};

/** Sin acentos y en minúsculas, para que "torre ambar" encuentre "Torre Ámbar". */
function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ coincidencias: [] });

  const aguja = normalizar(q);

  try {
    const docs = await listarDocumentos();
    const contenidos = await Promise.all(
      docs.map(async (d) => ({ ruta: d.path, texto: await leerBlob(d.sha) })),
    );

    const coincidencias: Coincidencia[] = [];
    for (const { ruta, texto } of contenidos) {
      const lineas = texto.split(/\r?\n/);
      for (let i = 0; i < lineas.length; i++) {
        if (normalizar(lineas[i]).includes(aguja)) {
          coincidencias.push({
            ruta,
            titulo: tituloDe(ruta, texto),
            linea: i + 1,
            texto: lineas[i].trim().slice(0, 200),
          });
          if (coincidencias.length >= 100) break;
        }
      }
      if (coincidencias.length >= 100) break;
    }

    return NextResponse.json({ coincidencias });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
