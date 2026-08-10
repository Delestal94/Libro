/**
 * Subrayados y comentarios hechos desde el modo lectura.
 *
 * Se guardan como una tabla Markdown más, igual que las pistas o la
 * cronología: `notas/anotaciones.md` es la fuente de verdad, y esto sólo le
 * pone una cara decente. Cada fila es una cita literal de un capítulo, con un
 * color y un comentario opcional — vacío, es un subrayado a secas.
 *
 * Las columnas se buscan por nombre, no por posición: así una tabla vieja
 * (de antes de que existiera el color) se sigue leyendo bien, y al escribir
 * en ella se migra sola sin perder las filas que ya había.
 */

import { anadirFila, extraerTabla, reemplazarTabla } from "./tablas.ts";

export const COLORES = ["dorado", "rosa", "verde", "celeste", "naranja"] as const;
export type Color = (typeof COLORES)[number];
const COLOR_POR_DEFECTO: Color = "dorado";

function esColor(valor: string): valor is Color {
  return (COLORES as readonly string[]).includes(valor);
}

export type Anotacion = {
  id: string;
  ruta: string;
  cita: string;
  comentario: string;
  color: Color;
  fecha: string;
};

export const CABECERAS_ANOTACIONES = ["Id", "Capítulo", "Cita", "Comentario", "Color", "Fecha"];

export const ENCABEZADO_ANOTACIONES =
  "# Anotaciones\n\n> Subrayados y comentarios hechos desde el lector. Cada fila es una cita\n> literal de un capítulo; si el capítulo cambia y la cita ya no aparece tal\n> cual, el subrayado simplemente deja de mostrarse — no hace falta borrarlo\n> a mano.\n\n";

export function extraerAnotaciones(contenido: string): Anotacion[] {
  const tabla = extraerTabla(contenido);
  if (!tabla) return [];

  const idx = (nombre: string) => tabla.cabeceras.indexOf(nombre);
  const iId = idx("Id");
  const iRuta = idx("Capítulo");
  const iCita = idx("Cita");
  const iComentario = idx("Comentario");
  const iColor = idx("Color");
  const iFecha = idx("Fecha");

  return tabla.filas
    .map((f) => {
      const color = f[iColor] ?? "";
      return {
        id: f[iId] ?? "",
        ruta: f[iRuta] ?? "",
        cita: f[iCita] ?? "",
        comentario: f[iComentario] ?? "",
        color: esColor(color) ? color : COLOR_POR_DEFECTO,
        fecha: f[iFecha] ?? "",
      };
    })
    .filter((a) => a.id && a.ruta && a.cita);
}

function generarId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Si la tabla es de antes de que existiera el color, le añade la columna. */
function migrarAColor(contenido: string) {
  const tabla = extraerTabla(contenido);
  if (!tabla || tabla.cabeceras.includes("Color")) return contenido;

  const iFecha = tabla.cabeceras.indexOf("Fecha");
  const pos = iFecha === -1 ? tabla.cabeceras.length : iFecha;
  const cabeceras = [...tabla.cabeceras.slice(0, pos), "Color", ...tabla.cabeceras.slice(pos)];
  const filas = tabla.filas.map((f) => [...f.slice(0, pos), COLOR_POR_DEFECTO, ...f.slice(pos)]);

  return reemplazarTabla(contenido, { cabeceras, filas });
}

export function agregarAnotacion(
  contenido: string,
  datos: { ruta: string; cita: string; comentario: string; color: Color },
): { contenido: string; anotacion: Anotacion } {
  const migrado = migrarAColor(contenido);
  const id = generarId();
  const fecha = new Date().toISOString();

  const tablaExistente = extraerTabla(migrado);
  const cabeceras = tablaExistente?.cabeceras ?? CABECERAS_ANOTACIONES;
  const idx = (nombre: string) => cabeceras.indexOf(nombre);

  const fila = new Array(cabeceras.length).fill("");
  fila[idx("Id")] = id;
  fila[idx("Capítulo")] = datos.ruta;
  fila[idx("Cita")] = datos.cita;
  fila[idx("Comentario")] = datos.comentario;
  fila[idx("Color")] = datos.color;
  fila[idx("Fecha")] = fecha;

  const nuevo = anadirFila(migrado, fila, CABECERAS_ANOTACIONES);

  return {
    contenido: nuevo,
    anotacion: {
      id,
      ruta: datos.ruta,
      cita: datos.cita,
      comentario: datos.comentario,
      color: datos.color,
      fecha,
    },
  };
}

export function quitarAnotacion(contenido: string, id: string): string {
  const tabla = extraerTabla(contenido);
  if (!tabla) return contenido;
  const iId = tabla.cabeceras.indexOf("Id");
  return reemplazarTabla(contenido, { ...tabla, filas: tabla.filas.filter((f) => f[iId] !== id) });
}

/** Cambia el comentario y/o el color de una anotación ya guardada. La cita no se toca. */
export function editarAnotacion(
  contenido: string,
  id: string,
  cambios: { comentario?: string; color?: Color },
): { contenido: string; anotacion: Anotacion } | null {
  const migrado = migrarAColor(contenido);
  const tabla = extraerTabla(migrado);
  if (!tabla) return null;

  const idx = (nombre: string) => tabla.cabeceras.indexOf(nombre);
  const iId = idx("Id");
  const indiceFila = tabla.filas.findIndex((f) => f[iId] === id);
  if (indiceFila === -1) return null;

  const fila = [...tabla.filas[indiceFila]];
  if (cambios.comentario !== undefined) fila[idx("Comentario")] = cambios.comentario;
  if (cambios.color !== undefined) fila[idx("Color")] = cambios.color;

  const filas = tabla.filas.map((f, i) => (i === indiceFila ? fila : f));
  const nuevo = reemplazarTabla(migrado, { ...tabla, filas });

  return {
    contenido: nuevo,
    anotacion: {
      id,
      ruta: fila[idx("Capítulo")] ?? "",
      cita: fila[idx("Cita")] ?? "",
      comentario: fila[idx("Comentario")] ?? "",
      color: esColor(fila[idx("Color")] ?? "") ? (fila[idx("Color")] as Color) : COLOR_POR_DEFECTO,
      fecha: fila[idx("Fecha")] ?? "",
    },
  };
}
