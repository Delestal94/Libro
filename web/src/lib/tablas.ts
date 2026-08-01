/**
 * Tablas Markdown como pequeña base de datos.
 *
 * Ni JSON ni base de datos: el registro de pistas y la cronología se guardan
 * como tablas Markdown corrientes. Así el fichero se lee y se edita a mano
 * igual que el resto del libro, y la app sólo le pone una cara decente.
 */

export type Tabla = { cabeceras: string[]; filas: string[][] };

const esSeparadora = (linea: string) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(linea) && linea.includes("-");

function celdas(linea: string): string[] {
  let l = linea.trim();
  if (l.startsWith("|")) l = l.slice(1);
  if (l.endsWith("|")) l = l.slice(0, -1);
  // Una barra escapada (\|) es contenido, no separador de celda.
  return l.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
}

/** Primera tabla del documento, o null si no hay ninguna. */
export function extraerTabla(markdown: string): Tabla | null {
  const lineas = markdown.split(/\r?\n/);

  for (let i = 0; i < lineas.length - 1; i++) {
    if (!lineas[i].includes("|") || !esSeparadora(lineas[i + 1])) continue;

    const cabeceras = celdas(lineas[i]);
    const filas: string[][] = [];

    for (let j = i + 2; j < lineas.length; j++) {
      const l = lineas[j];
      if (!l.trim() || !l.includes("|")) break;
      const f = celdas(l);
      // Se normaliza al ancho de la cabecera: sobra o falta, no importa.
      while (f.length < cabeceras.length) f.push("");
      filas.push(f.slice(0, cabeceras.length));
    }

    // Las filas de plantilla (todas las celdas vacías) no son datos.
    return { cabeceras, filas: filas.filter((f) => f.some((c) => c !== "")) };
  }

  return null;
}

export function tablaAMarkdown(t: Tabla): string {
  const escapar = (c: string) => c.replace(/\|/g, "\\|");
  const linea = (cs: string[]) => `| ${cs.map(escapar).join(" | ")} |`;

  return [
    linea(t.cabeceras),
    `|${t.cabeceras.map(() => "---").join("|")}|`,
    ...t.filas.map(linea),
  ].join("\n");
}

/**
 * Reemplaza la primera tabla del documento conservando todo lo demás.
 * Si no había tabla, la añade al final.
 */
export function reemplazarTabla(markdown: string, t: Tabla): string {
  const lineas = markdown.split(/\r?\n/);

  for (let i = 0; i < lineas.length - 1; i++) {
    if (!lineas[i].includes("|") || !esSeparadora(lineas[i + 1])) continue;

    let fin = i + 2;
    while (fin < lineas.length && lineas[fin].trim() && lineas[fin].includes("|")) fin++;

    return [...lineas.slice(0, i), tablaAMarkdown(t), ...lineas.slice(fin)].join("\n");
  }

  const base = markdown.trimEnd();
  return `${base}${base ? "\n\n" : ""}${tablaAMarkdown(t)}\n`;
}

/** Añade una fila al final de la tabla del documento. */
export function anadirFila(markdown: string, fila: string[], cabecerasPorDefecto: string[]): string {
  const t = extraerTabla(markdown) ?? { cabeceras: cabecerasPorDefecto, filas: [] };
  const f = [...fila];
  while (f.length < t.cabeceras.length) f.push("");
  return reemplazarTabla(markdown, { ...t, filas: [...t.filas, f.slice(0, t.cabeceras.length)] });
}
