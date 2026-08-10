/**
 * Subrayados y comentarios hechos desde el modo lectura.
 *
 * Se guardan como una tabla Markdown más, igual que las pistas o la
 * cronología: `notas/anotaciones.md` es la fuente de verdad, y esto sólo le
 * pone una cara decente. Cada fila es una cita literal de un capítulo, con un
 * comentario opcional — vacío, es un subrayado a secas.
 */

import { anadirFila, extraerTabla, reemplazarTabla } from "./tablas.ts";

export type Anotacion = {
  id: string;
  ruta: string;
  cita: string;
  comentario: string;
  fecha: string;
};

export const CABECERAS_ANOTACIONES = ["Id", "Capítulo", "Cita", "Comentario", "Fecha"];

export const ENCABEZADO_ANOTACIONES =
  "# Anotaciones\n\n> Subrayados y comentarios hechos desde el lector. Cada fila es una cita\n> literal de un capítulo; si el capítulo cambia y la cita ya no aparece tal\n> cual, el subrayado simplemente deja de mostrarse — no hace falta borrarlo\n> a mano.\n\n";

export function extraerAnotaciones(contenido: string): Anotacion[] {
  const tabla = extraerTabla(contenido);
  if (!tabla) return [];
  return tabla.filas
    .map((f) => ({
      id: f[0] ?? "",
      ruta: f[1] ?? "",
      cita: f[2] ?? "",
      comentario: f[3] ?? "",
      fecha: f[4] ?? "",
    }))
    .filter((a) => a.id && a.ruta && a.cita);
}

function generarId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function agregarAnotacion(
  contenido: string,
  datos: { ruta: string; cita: string; comentario: string },
): { contenido: string; anotacion: Anotacion } {
  const id = generarId();
  const fecha = new Date().toISOString();
  const fila = [id, datos.ruta, datos.cita, datos.comentario, fecha];
  const nuevo = anadirFila(contenido, fila, CABECERAS_ANOTACIONES);
  return {
    contenido: nuevo,
    anotacion: { id, ruta: datos.ruta, cita: datos.cita, comentario: datos.comentario, fecha },
  };
}

export function quitarAnotacion(contenido: string, id: string): string {
  const tabla = extraerTabla(contenido);
  if (!tabla) return contenido;
  return reemplazarTabla(contenido, { ...tabla, filas: tabla.filas.filter((f) => f[0] !== id) });
}
