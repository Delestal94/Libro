import "server-only";

import { leerBlob, listarDocumentos } from "./github";
import { contarPalabras, esCapitulo, seccionDe, tituloDe, type Seccion } from "./libro";

export type Doc = {
  ruta: string;
  titulo: string;
  seccion: Seccion;
  palabras: number;
  esCapitulo: boolean;
  contenido: string;
};

/**
 * Carga todo el libro. Un proyecto de escritura son decenas de ficheros, no
 * miles, así que leerlo entero de una vez sale más barato en latencia que
 * encadenar peticiones a medida que se navega.
 */
export async function cargarProyecto(): Promise<Doc[]> {
  const nodos = await listarDocumentos();
  const docs = await Promise.all(
    nodos.map(async (n) => {
      const contenido = await leerBlob(n.sha);
      return {
        ruta: n.path,
        titulo: tituloDe(n.path, contenido),
        seccion: seccionDe(n.path),
        palabras: contarPalabras(contenido),
        esCapitulo: esCapitulo(n.path),
        contenido,
      };
    }),
  );
  return docs;
}

export function capitulos(docs: Doc[]): Doc[] {
  return docs.filter((d) => d.esCapitulo).sort((a, b) => a.ruta.localeCompare(b.ruta, "es"));
}
