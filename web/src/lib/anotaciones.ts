/**
 * Subrayados y comentarios sobre el manuscrito.
 *
 * Se guardan como una tabla Markdown más, igual que las pistas o la
 * cronología: `notas/anotaciones.md` es la fuente de verdad, versionada con
 * el libro, y esto sólo le pone una cara decente.
 *
 * ## Cómo se ancla una anotación al texto
 *
 * El primer intento guardaba sólo la cita y la buscaba en la página. Era
 * frágil por definición: si la frase aparecía dos veces se marcaba la
 * equivocada, y cualquier diferencia de espacios la hacía desaparecer sin
 * avisar.
 *
 * Ahora una anotación son **dos datos**: el texto exacto ya normalizado, y
 * **cuál de sus apariciones** dentro del capítulo es (`aparicion`, contando
 * desde 0). Con eso la resolución es determinista y no adivina nada:
 *
 * - Lo normal es que una frase larga aparezca una sola vez → `aparicion` 0.
 * - Para un «—Ya.» repetido veinte veces, el número dice exactamente cuál.
 * - Si el capítulo cambia y el texto ya no está, la anotación no se pierde:
 *   queda **huérfana**, visible en la lista, para decidir qué hacer con ella.
 *
 * La normalización (colapsar todo espacio en blanco a un espacio simple) es
 * la misma en los dos lados — al crear y al pintar — y es lo que permite que
 * el markdown del manuscrito siga partiendo los párrafos en varias líneas
 * para editarlos cómodo sin que eso afecte a las marcas.
 */

import { anadirFila, extraerTabla, reemplazarTabla, type Tabla } from "./tablas.ts";

export const COLORES = ["dorado", "rosa", "verde", "celeste", "naranja"] as const;
export type Color = (typeof COLORES)[number];
export const COLOR_POR_DEFECTO: Color = "dorado";

export function esColor(valor: unknown): valor is Color {
  return typeof valor === "string" && (COLORES as readonly string[]).includes(valor);
}

export type Anotacion = {
  id: string;
  ruta: string;
  /** El texto marcado, con los espacios ya colapsados. */
  texto: string;
  /** Cuál de las apariciones de `texto` en el capítulo es ésta, desde 0. */
  aparicion: number;
  comentario: string;
  color: Color;
  fecha: string;
};

export const CABECERAS_ANOTACIONES = [
  "Id",
  "Capítulo",
  "Texto",
  "Comentario",
  "Color",
  "Aparición",
  "Fecha",
];

export const ENCABEZADO_ANOTACIONES = `# Anotaciones

> Subrayados y comentarios hechos desde el lector.
>
> Cada fila apunta a un trozo de un capítulo por su texto y por **cuál de sus
> apariciones** es (desde 0). Si el capítulo se reescribe y ese texto deja de
> existir, la anotación no se borra: se queda huérfana y el lector la enseña
> aparte.

`;

/** Colapsa todo espacio en blanco a un espacio simple. La usan los dos lados. */
export function normalizarTexto(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Cuántas veces aparece `aguja` en `pajar`, contando solapadas como distintas. */
export function contarApariciones(pajar: string, aguja: string): number {
  if (!aguja) return 0;
  let n = 0;
  let i = pajar.indexOf(aguja);
  while (i !== -1) {
    n++;
    i = pajar.indexOf(aguja, i + 1);
  }
  return n;
}

/**
 * Dónde empieza la aparición número `aparicion` de `aguja`, o -1 si no llega
 * a haber tantas. Si el texto se editó y quedan menos apariciones de las que
 * había, se devuelve la última: es más útil marcar el sitio parecido que no
 * marcar nada, y la alternativa —perder la anotación— es peor.
 */
export function posicionDeAparicion(pajar: string, aguja: string, aparicion: number): number {
  if (!aguja) return -1;
  const posiciones: number[] = [];
  let i = pajar.indexOf(aguja);
  while (i !== -1) {
    posiciones.push(i);
    if (posiciones.length > aparicion) break;
    i = pajar.indexOf(aguja, i + 1);
  }
  if (!posiciones.length) return -1;
  return posiciones[Math.min(aparicion, posiciones.length - 1)];
}

// --- Lectura y escritura de la tabla ---------------------------------------

/**
 * Las columnas se buscan por nombre, nunca por posición: así una tabla escrita
 * por una versión anterior (sin `Color`, sin `Aparición`, con `Cita` en vez de
 * `Texto`) se sigue leyendo, y se migra sola al escribir en ella.
 */
function indices(cabeceras: string[]) {
  const de = (...nombres: string[]) => {
    for (const n of nombres) {
      const i = cabeceras.indexOf(n);
      if (i !== -1) return i;
    }
    return -1;
  };
  return {
    id: de("Id"),
    ruta: de("Capítulo", "Capitulo"),
    texto: de("Texto", "Cita"),
    comentario: de("Comentario"),
    color: de("Color"),
    aparicion: de("Aparición", "Aparicion"),
    fecha: de("Fecha"),
  };
}

const celda = (fila: string[], i: number) => (i === -1 ? "" : (fila[i] ?? ""));

export function extraerAnotaciones(contenido: string): Anotacion[] {
  const tabla = extraerTabla(contenido);
  if (!tabla) return [];
  const idx = indices(tabla.cabeceras);

  return tabla.filas
    .map((f) => {
      const color = celda(f, idx.color);
      const aparicion = Number.parseInt(celda(f, idx.aparicion), 10);
      return {
        id: celda(f, idx.id),
        ruta: celda(f, idx.ruta),
        texto: normalizarTexto(celda(f, idx.texto)),
        aparicion: Number.isFinite(aparicion) && aparicion >= 0 ? aparicion : 0,
        comentario: celda(f, idx.comentario),
        color: esColor(color) ? color : COLOR_POR_DEFECTO,
        fecha: celda(f, idx.fecha),
      };
    })
    .filter((a) => a.id && a.ruta && a.texto);
}

/** Reescribe la tabla con las columnas de hoy, conservando lo que hubiera. */
function migrar(contenido: string): string {
  const tabla = extraerTabla(contenido);
  if (!tabla) return contenido;
  if (CABECERAS_ANOTACIONES.every((c, i) => tabla.cabeceras[i] === c)) return contenido;

  const anotaciones = extraerAnotaciones(contenido);
  const nueva: Tabla = {
    cabeceras: CABECERAS_ANOTACIONES,
    filas: anotaciones.map(aFila),
  };
  return reemplazarTabla(contenido, nueva);
}

function aFila(a: Anotacion): string[] {
  return [a.id, a.ruta, a.texto, a.comentario, a.color, String(a.aparicion), a.fecha];
}

export type DatosNuevos = {
  id: string;
  ruta: string;
  texto: string;
  aparicion: number;
  comentario: string;
  color: Color;
};

/**
 * Añade una anotación. Si ya existe uno con ese `id` no hace nada y devuelve
 * la que había: la operación es idempotente a propósito, porque el cliente
 * reintenta desde una cola y un reintento no puede acabar en dos subrayados.
 */
export function agregarAnotacion(
  contenido: string,
  datos: DatosNuevos,
): { contenido: string; anotacion: Anotacion } {
  const base = migrar(contenido);

  const yaEsta = extraerAnotaciones(base).find((a) => a.id === datos.id);
  if (yaEsta) return { contenido: base, anotacion: yaEsta };

  const anotacion: Anotacion = {
    id: datos.id,
    ruta: datos.ruta,
    texto: normalizarTexto(datos.texto),
    aparicion: datos.aparicion,
    comentario: normalizarTexto(datos.comentario),
    color: esColor(datos.color) ? datos.color : COLOR_POR_DEFECTO,
    fecha: new Date().toISOString(),
  };

  return {
    contenido: anadirFila(base, aFila(anotacion), CABECERAS_ANOTACIONES),
    anotacion,
  };
}

/** Cambia comentario y/o color. El texto anclado no se toca nunca. */
export function editarAnotacion(
  contenido: string,
  id: string,
  cambios: { comentario?: string; color?: Color },
): { contenido: string; anotacion: Anotacion } | null {
  const base = migrar(contenido);
  const tabla = extraerTabla(base);
  if (!tabla) return null;

  const idx = indices(tabla.cabeceras);
  const n = tabla.filas.findIndex((f) => celda(f, idx.id) === id);
  if (n === -1) return null;

  const fila = [...tabla.filas[n]];
  if (cambios.comentario !== undefined && idx.comentario !== -1) {
    fila[idx.comentario] = normalizarTexto(cambios.comentario);
  }
  if (cambios.color !== undefined && idx.color !== -1) {
    fila[idx.color] = esColor(cambios.color) ? cambios.color : COLOR_POR_DEFECTO;
  }

  const filas = tabla.filas.map((f, i) => (i === n ? fila : f));
  const nuevo = reemplazarTabla(base, { ...tabla, filas });
  const anotacion = extraerAnotaciones(nuevo).find((a) => a.id === id) ?? null;

  return anotacion ? { contenido: nuevo, anotacion } : null;
}

/** Quitar algo que ya no está no es un error: la cola puede reintentar. */
export function quitarAnotacion(contenido: string, id: string): string {
  const tabla = extraerTabla(contenido);
  if (!tabla) return contenido;
  const idx = indices(tabla.cabeceras);
  return reemplazarTabla(contenido, {
    ...tabla,
    filas: tabla.filas.filter((f) => celda(f, idx.id) !== id),
  });
}
