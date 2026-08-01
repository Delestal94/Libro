/**
 * Enlaces `[[entre documentos]]`.
 *
 * La sintaxis es la de un wiki y se guarda tal cual en el Markdown: el fichero
 * sigue leyéndose sin la app. Un enlace apunta a un documento por su título o
 * por su nombre de fichero, sin distinguir mayúsculas ni acentos, porque nadie
 * escribe "Frieren" igual dos veces a las dos de la mañana.
 */

const PATRON = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export type Enlace = {
  /** Lo que se escribió dentro de los corchetes. */
  destino: string;
  /** Texto a mostrar, si se usó la forma `[[destino|texto]]`. */
  texto: string;
};

export function normalizarClave(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Todos los enlaces de un texto, sin repetir destinos. */
export function extraerEnlaces(markdown: string): Enlace[] {
  const vistos = new Map<string, Enlace>();
  for (const m of markdown.matchAll(PATRON)) {
    const destino = m[1].trim();
    if (!destino) continue;
    const clave = normalizarClave(destino);
    if (!vistos.has(clave)) vistos.set(clave, { destino, texto: (m[2] ?? destino).trim() });
  }
  return [...vistos.values()];
}

export type DocIndexable = { ruta: string; titulo: string };

/**
 * Índice de claves → ruta. Se indexa por título y por nombre de fichero, así
 * que `[[premisa]]` y `[[Premisa]]` llegan al mismo sitio.
 */
export function construirIndice(docs: DocIndexable[]): Map<string, string> {
  const indice = new Map<string, string>();
  for (const d of docs) {
    const nombre = (d.ruta.split("/").pop() ?? "").replace(/\.md$/, "");
    // El nombre de fichero puede llevar prefijo numérico: 03-la-torre -> la torre
    const sinNumero = nombre.replace(/^\d+[-_]/, "");
    for (const clave of [d.titulo, nombre, sinNumero, d.ruta]) {
      const k = normalizarClave(clave);
      // El primero gana: los documentos vienen ordenados y así el resultado
      // no depende de cuál se procesó antes.
      if (k && !indice.has(k)) indice.set(k, d.ruta);
    }
  }
  return indice;
}

export function resolver(destino: string, indice: Map<string, string>): string | null {
  return indice.get(normalizarClave(destino)) ?? null;
}

export type Retroenlace = {
  desde: string;
  tituloDesde: string;
  contexto: string;
};

/** Qué documentos enlazan a `ruta`, con la frase donde lo hacen. */
export function retroenlaces(
  ruta: string,
  docs: { ruta: string; titulo: string; contenido: string }[],
  indice: Map<string, string>,
): Retroenlace[] {
  const salida: Retroenlace[] = [];

  for (const d of docs) {
    if (d.ruta === ruta) continue;

    for (const linea of d.contenido.split(/\r?\n/)) {
      let apunta = false;
      for (const m of linea.matchAll(PATRON)) {
        if (resolver(m[1].trim(), indice) === ruta) {
          apunta = true;
          break;
        }
      }
      if (!apunta) continue;

      salida.push({
        desde: d.ruta,
        tituloDesde: d.titulo,
        contexto: linea.replace(PATRON, (_, dest, txt) => txt ?? dest).trim().slice(0, 200),
      });
      break; // una entrada por documento: la lista es para navegar, no para contar
    }
  }

  return salida;
}

/** Enlaces que no apuntan a ningún documento: candidatos a crear. */
export function enlacesRotos(
  contenido: string,
  indice: Map<string, string>,
): string[] {
  return extraerEnlaces(contenido)
    .filter((e) => !resolver(e.destino, indice))
    .map((e) => e.destino);
}

/**
 * Sustituye `[[...]]` por HTML antes de pasar el texto a Markdown.
 * Los rotos se marcan aparte para que se vean y se puedan crear.
 */
export function enlacesAHtml(markdown: string, indice: Map<string, string>): string {
  return markdown.replace(PATRON, (_, destinoBruto, textoBruto) => {
    const destino = String(destinoBruto).trim();
    const texto = escapar(String(textoBruto ?? destino).trim());
    const ruta = resolver(destino, indice);
    return ruta
      ? `<a class="enlace-wiki" href="/editar/${encodeURI(ruta)}">${texto}</a>`
      : `<span class="enlace-roto" title="Aún no existe">${texto}</span>`;
  });
}

function escapar(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
