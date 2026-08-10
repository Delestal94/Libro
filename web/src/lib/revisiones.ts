/** Lógica de dominio: los paneles de revisión guardados en `revisiones/`. */

import type { Doc } from "./proyecto";
import { contarPalabras } from "./libro";

export type Panel = {
  carpeta: string;
  ruta: string;
  titulo: string;
  fecha: string;
  resumen: Doc | null;
  extracto: string;
  informes: { ruta: string; titulo: string; palabras: number }[];
};

/** `2026-08-09-arco-1` → { fecha: "2026-08-09", arco: "Arco 1" } */
function partirCarpeta(carpeta: string): { fecha: string; etiqueta: string } {
  const m = carpeta.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (!m) return { fecha: "", etiqueta: carpeta };
  const etiqueta = m[2]
    .split("-")
    .map((p) => (p === "arco" ? "Arco" : p))
    .join(" ");
  return { fecha: m[1], etiqueta };
}

function fechaLegible(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

/** Primeras líneas de prosa de un resumen, sin cabeceras ni citas, para la tarjeta. */
function extraerExtracto(md: string): string {
  const sinTitulo = md.replace(/^#.*$/m, "");
  const parrafo = sinTitulo
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith(">") && !p.startsWith("#") && !p.startsWith("|"));
  if (!parrafo) return "";
  const limpio = parrafo.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
  return limpio.length > 220 ? limpio.slice(0, 217) + "…" : limpio;
}

const nombreInforme = (ruta: string): string =>
  (ruta.split("/").pop() ?? ruta).replace(/\.md$/, "").replace(/-/g, " ");

/** Agrupa los documentos de `revisiones/<carpeta>/*.md` en paneles, más recientes primero. */
export function listarPaneles(docs: Doc[]): Panel[] {
  const porCarpeta = new Map<string, Doc[]>();

  for (const d of docs) {
    const partes = d.ruta.split("/");
    if (partes[0] !== "revisiones" || partes.length < 3) continue; // README.md y panel.md quedan fuera
    const carpeta = partes[1];
    if (!porCarpeta.has(carpeta)) porCarpeta.set(carpeta, []);
    porCarpeta.get(carpeta)!.push(d);
  }

  const paneles: Panel[] = [];
  for (const [carpeta, ficheros] of porCarpeta) {
    const resumen = ficheros.find((f) => f.ruta.endsWith("/resumen.md")) ?? null;
    const informes = ficheros
      .filter((f) => f !== resumen)
      .map((f) => ({ ruta: f.ruta, titulo: nombreInforme(f.ruta), palabras: contarPalabras(f.contenido) }))
      .sort((a, b) => a.ruta.localeCompare(b.ruta, "es"));

    const { fecha, etiqueta } = partirCarpeta(carpeta);

    paneles.push({
      carpeta,
      ruta: `revisiones/${carpeta}`,
      titulo: etiqueta,
      fecha,
      resumen,
      extracto: resumen ? extraerExtracto(resumen.contenido) : "",
      informes,
    });
  }

  return paneles.sort((a, b) => b.carpeta.localeCompare(a.carpeta, "es"));
}

export function panel(docs: Doc[], carpeta: string): Panel | null {
  return listarPaneles(docs).find((p) => p.carpeta === carpeta) ?? null;
}

export { fechaLegible };
