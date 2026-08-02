import "server-only";

import { leerBlob, listarDocumentos } from "./github";
import { construirIndice, retroenlaces } from "./enlaces";
import { esPersonaje, leerPersonaje, type Personaje } from "./personajes";
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

/** Fichas de personaje, ordenadas por nombre. */
export function personajes(docs: Doc[]): Personaje[] {
  return docs
    .filter((d) => esPersonaje(d.ruta))
    .map((d) => leerPersonaje(d.ruta, d.contenido))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

/** Índice de enlaces `[[ ]]` de todo el proyecto. */
export function indiceDe(docs: Doc[]): Map<string, string> {
  return construirIndice(docs);
}

/** Qué documentos enlazan a `ruta`. */
export function backlinks(ruta: string, docs: Doc[]) {
  return retroenlaces(ruta, docs, construirIndice(docs));
}
