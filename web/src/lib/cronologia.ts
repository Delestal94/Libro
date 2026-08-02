/**
 * Interpretación de la cronología para dibujarla.
 *
 * El campo «Cuándo» es texto libre a propósito —escribir "hace unos trescientos
 * años" no debería requerir aprenderse un formato—. Aquí se intenta deducir un
 * número para ordenar y espaciar los sucesos; lo que no se entiende **no se
 * inventa**: va a un grupo aparte, "sin situar", en el orden en que lo escribiste.
 */

export type Conocimiento = "sabe" | "sospecha" | "ignora" | "desconocido";

export type Suceso = {
  indice: number;
  cuando: string;
  que: string;
  capitulo: string;
  lector: string;
  /** Año deducido, o null si el texto no permitía deducirlo. */
  anio: number | null;
  /** Número de capítulo deducido, para el orden del lector. */
  numCapitulo: number | null;
  conocimiento: Conocimiento;
};

const NEGATIVO = /\b(a\.?\s?c\.?|antes de cristo|a\.?\s?e\.?\s?c\.?|hace)\b/i;

/**
 * Deduce un año del texto. Devuelve null antes que adivinar: una línea del
 * tiempo con fechas inventadas es peor que una con huecos declarados.
 */
export function deducirAnio(texto: string): number | null {
  const t = texto.trim();
  if (!t) return null;

  // Fecha completa tipo 1200-03-15: el día y el mes afinan el orden dentro del año.
  const iso = t.match(/(-?\d{1,6})-(\d{1,2})(?:-(\d{1,2}))?/);
  if (iso) {
    const anio = Number(iso[1]);
    const mes = Math.min(12, Math.max(1, Number(iso[2])));
    const dia = iso[3] ? Math.min(31, Math.max(1, Number(iso[3]))) : 1;
    return anio + (mes - 1) / 12 + (dia - 1) / 372;
  }

  // Cualquier otra cosa: el primer número que aparezca.
  const num = t.match(/-?\d+(?:[.,]\d+)?/);
  if (!num) return null;

  const valor = Number(num[0].replace(",", "."));
  if (!Number.isFinite(valor)) return null;

  // "hace 300 años" y "300 a.C." apuntan hacia atrás.
  const haciaAtras = NEGATIVO.test(t);
  return haciaAtras ? -Math.abs(valor) : valor;
}

export function deducirCapitulo(texto: string): number | null {
  const m = texto.match(/\d+/);
  return m ? Number(m[0]) : null;
}

export function interpretarConocimiento(texto: string): Conocimiento {
  const t = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (!t) return "desconocido";
  if (/(^|\b)(no|nada|ni idea|ignora|oculto|secreto)\b/.test(t)) return "ignora";
  if (/sospech|intuye|duda|cree|quiza|pista/.test(t)) return "sospecha";
  if (/(^|\b)(si|sabe|lo sabe|revelado|conocido|claro)\b/.test(t)) return "sabe";
  return "desconocido";
}

export function interpretarFilas(filas: string[][]): Suceso[] {
  return filas.map((f, indice) => ({
    indice,
    cuando: f[0] ?? "",
    que: f[1] ?? "",
    capitulo: f[2] ?? "",
    lector: f[3] ?? "",
    anio: deducirAnio(f[0] ?? ""),
    numCapitulo: deducirCapitulo(f[2] ?? ""),
    conocimiento: interpretarConocimiento(f[3] ?? ""),
  }));
}

export type Orden = "mundo" | "lector";

/**
 * Ordena por uno de los dos relojes. Los sucesos que no se pueden situar en el
 * eje elegido quedan al final, conservando el orden en que se escribieron.
 */
export function ordenar(sucesos: Suceso[], orden: Orden): { situados: Suceso[]; sueltos: Suceso[] } {
  const clave = (s: Suceso) => (orden === "mundo" ? s.anio : s.numCapitulo);

  const situados = sucesos
    .filter((s) => clave(s) !== null)
    .sort((a, b) => clave(a)! - clave(b)! || a.indice - b.indice);

  const sueltos = sucesos.filter((s) => clave(s) === null);

  return { situados, sueltos };
}

export type Tramo = {
  suceso: Suceso;
  /** Separación proporcional respecto al anterior, en unidades de 0 a 1. */
  hueco: number;
  /** Salto grande: merece marcarse con la distancia. */
  saltoGrande: boolean;
  distancia: number | null;
};

/**
 * Calcula la separación entre sucesos consecutivos para que el dibujo respire
 * donde pasa el tiempo. Se usa raíz cuadrada y no proporción directa: con un
 * salto de trescientos años entre dos escenas del mismo día, lo lineal dejaría
 * esas dos escenas pegadas y ya no se distinguirían.
 */
export function calcularTramos(situados: Suceso[], orden: Orden): Tramo[] {
  const clave = (s: Suceso) => (orden === "mundo" ? s.anio! : s.numCapitulo!);

  const distancias = situados.map((s, i) => (i === 0 ? 0 : clave(s) - clave(situados[i - 1])));
  const maxima = Math.max(...distancias, 1);

  return situados.map((suceso, i) => {
    const distancia = distancias[i];
    const hueco = i === 0 ? 0 : Math.sqrt(Math.max(0, distancia) / maxima);
    return {
      suceso,
      hueco,
      // Un salto es "grande" si destaca de verdad sobre el resto del recorrido.
      saltoGrande: i > 0 && distancia > 0 && hueco > 0.55,
      distancia: i === 0 ? null : distancia,
    };
  });
}

/** "hace 300 años" en lenguaje llano, para etiquetar los saltos. */
export function describirSalto(distancia: number, orden: Orden): string {
  if (orden === "lector") {
    const n = Math.round(distancia);
    return n === 1 ? "1 capítulo después" : `${n} capítulos después`;
  }

  const n = Math.round(Math.abs(distancia));
  if (n === 0) return "el mismo momento";
  if (n === 1) return "1 año después";
  return `${n.toLocaleString("es-ES")} años después`;
}
