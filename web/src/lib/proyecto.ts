import "server-only";

import { leerBlob, listarDocumentos } from "./github";
import { construirIndice, retroenlaces } from "./enlaces";
import { leerFicha, tipoDeRuta, type Ficha, type TipoFicha } from "./fichas";
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
 * Cada blob se pide a GitHub por su sha, y un sha identifica un contenido para
 * siempre: si no cambió el sha, el texto es idéntico. Eso hace que se puedan
 * guardar sin caducidad y sin miedo a servir algo viejo — al editar un fichero
 * cambia su sha y con él la clave.
 *
 * Existe porque sin esto cada carga de una pantalla pedía los ~110 ficheros
 * del repo uno por uno, y una tarde de recargas seguidas basta para que GitHub
 * corte por límite secundario y la app deje de abrir.
 */
const blobs = new Map<string, string>();
const TOPE_BLOBS = 400;

async function leerBlobCacheado(sha: string): Promise<string> {
  const guardado = blobs.get(sha);
  if (guardado !== undefined) return guardado;

  const contenido = await leerBlob(sha);
  if (blobs.size >= TOPE_BLOBS) {
    // Se tira lo más viejo: un Map conserva el orden de inserción.
    const primero = blobs.keys().next().value;
    if (primero !== undefined) blobs.delete(primero);
  }
  blobs.set(sha, contenido);
  return contenido;
}

/**
 * Carga todo el libro. Un proyecto de escritura son decenas de ficheros, no
 * miles, así que leerlo entero de una vez sale más barato en latencia que
 * encadenar peticiones a medida que se navega.
 *
 * La lista de ficheros sí se pide siempre (una petición): es lo que dice qué
 * shas hay ahora, y por tanto lo que detecta los cambios.
 */
export async function cargarProyecto(): Promise<Doc[]> {
  const nodos = await listarDocumentos();
  const docs = await Promise.all(
    nodos.map(async (n) => {
      const contenido = await leerBlobCacheado(n.sha);
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

/** Fichas de un tipo (personajes, lugares o criaturas), ordenadas por nombre. */
export function fichasDe(docs: Doc[], tipo: TipoFicha): Ficha[] {
  return docs
    .map((d) => leerFicha(d.ruta, d.contenido))
    .filter((f): f is Ficha => f !== null && f.tipo === tipo)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

/** Cuántas fichas hay de cada tipo, para el hub del mundo. */
export function conteoFichas(docs: Doc[]): Record<TipoFicha, number> {
  const conteo = { personajes: 0, lugares: 0, fauna: 0, flora: 0 };
  for (const d of docs) {
    const tipo = tipoDeRuta(d.ruta);
    if (tipo) conteo[tipo]++;
  }
  return conteo;
}

/** Índice de enlaces `[[ ]]` de todo el proyecto. */
export function indiceDe(docs: Doc[]): Map<string, string> {
  return construirIndice(docs);
}

/** Qué documentos enlazan a `ruta`. */
export function backlinks(ruta: string, docs: Doc[]) {
  return retroenlaces(ruta, docs, construirIndice(docs));
}
