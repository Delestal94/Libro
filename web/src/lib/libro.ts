/** Lógica de dominio: cómo se organiza un libro dentro del repo. */

import type { NodoArbol } from "./github";

export type Seccion = "biblia" | "manuscrito" | "notas" | "otros";

export const SECCIONES: { id: Seccion; titulo: string; descripcion: string; icono: string }[] = [
  {
    id: "biblia",
    titulo: "Biblia",
    descripcion: "Premisa, personajes y mundo. La fuente de verdad.",
    icono: "◆",
  },
  {
    id: "manuscrito",
    titulo: "Manuscrito",
    descripcion: "Los capítulos del libro.",
    icono: "▤",
  },
  {
    id: "notas",
    titulo: "Notas",
    descripcion: "Ideas sueltas, investigación, capturas rápidas.",
    icono: "✦",
  },
  {
    id: "otros",
    titulo: "Otros",
    descripcion: "Resto de documentos del proyecto.",
    icono: "○",
  },
];

export function seccionDe(ruta: string): Seccion {
  const carpeta = ruta.split("/")[0];
  if (carpeta === "biblia" || carpeta === "manuscrito" || carpeta === "notas") return carpeta;
  return "otros";
}

/** Los ficheros `00-*` del manuscrito son material de trabajo, no capítulos. */
export function esCapitulo(ruta: string): boolean {
  if (!ruta.startsWith("manuscrito/")) return false;
  const nombre = ruta.split("/").pop() ?? "";
  return nombre.endsWith(".md") && !nombre.startsWith("00-");
}

/**
 * Título legible a partir de la ruta: `manuscrito/03-la-torre.md` → "3 · La torre".
 * Si el fichero empieza por un `# Encabezado`, ese gana.
 */
export function tituloDe(ruta: string, contenido?: string): string {
  const encabezado = contenido?.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (encabezado) return encabezado;

  const nombre = (ruta.split("/").pop() ?? ruta).replace(/\.md$/, "");
  const conNumero = nombre.match(/^(\d+)[-_](.*)$/);
  const cuerpo = conNumero ? conNumero[2] : nombre;
  const legible = cuerpo.replace(/[-_]/g, " ").trim();
  const capitalizado = legible.charAt(0).toUpperCase() + legible.slice(1);
  return conNumero ? `${Number(conNumero[1])} · ${capitalizado}` : capitalizado;
}

/**
 * Cuenta palabras ignorando el andamiaje Markdown (encabezados, citas, listas,
 * separadores y tablas) para que el recuento refleje prosa real, no plantilla.
 */
export function contarPalabras(markdown: string): number {
  const limpio = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s*>.*$/gm, " ")
    .replace(/^\s*#{1,6}\s+.*$/gm, " ")
    .replace(/^\s*\|.*$/gm, " ")
    .replace(/^\s*[-*_]{3,}\s*$/gm, " ")
    .replace(/^\s*[-*+]\s+$/gm, " ")
    .replace(/[#*_`~[\]()>|]/g, " ");

  const palabras = limpio.match(/[\p{L}\p{N}''-]+/gu);
  return palabras ? palabras.length : 0;
}

/** Minutos de lectura a 200 palabras por minuto. */
export function minutosLectura(palabras: number): number {
  return Math.max(1, Math.round(palabras / 200));
}

/** Siguiente número de capítulo libre, con dos dígitos. */
export function siguienteNumeroCapitulo(rutas: string[]): string {
  const numeros = rutas
    .filter((r) => r.startsWith("manuscrito/"))
    .map((r) => Number((r.split("/").pop() ?? "").match(/^(\d+)/)?.[1] ?? NaN))
    .filter((n) => Number.isFinite(n));
  const siguiente = numeros.length ? Math.max(...numeros) + 1 : 1;
  return String(siguiente).padStart(2, "0");
}

/** Convierte un título en un nombre de fichero seguro: "La Torre Ámbar" → "la-torre-ambar". */
export function aSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export type ResumenDoc = {
  ruta: string;
  titulo: string;
  seccion: Seccion;
  palabras: number;
  bytes: number;
  esCapitulo: boolean;
};

export function resumir(nodos: NodoArbol[]): ResumenDoc[] {
  return nodos.map((n) => ({
    ruta: n.path,
    titulo: tituloDe(n.path),
    seccion: seccionDe(n.path),
    // Sin descargar cada fichero solo se conoce el tamaño; el recuento exacto
    // se calcula en las vistas que sí leen el contenido.
    palabras: 0,
    bytes: n.size ?? 0,
    esCapitulo: esCapitulo(n.path),
  }));
}

export const RUTA_INBOX = "notas/inbox.md";
