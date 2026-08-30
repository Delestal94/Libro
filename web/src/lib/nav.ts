/*
  Cuatro destinos y la nota. Trama y Progreso se llegan desde la Biblioteca:
  son pantallas de sentarse a planificar, no de consultar a diario, y meterlas
  aquí dejaría las pestañas demasiado estrechas para el pulgar.
*/
export const ENLACES = [
  { href: "/", etiqueta: "Biblioteca", icono: "◆" },
  { href: "/mundo", etiqueta: "Mundo", icono: "☗" },
  { href: "/leer", etiqueta: "Leer", icono: "▤" },
  { href: "/buscar", etiqueta: "Buscar", icono: "⌕" },
];

/* Personajes, lugares y criaturas cuelgan de Mundo: son tres destinos que no
   caben en la nav, y agrupados se llega igual de rápido. */
const RAMAS_MUNDO = ["/mundo", "/personajes", "/lugares", "/fauna", "/flora"];

/** Las fichas cuelgan de Mundo, así que su pestaña sigue marcada dentro de ellas. */
export function activo(ruta: string, href: string): boolean {
  if (href === "/") return ruta === "/";
  if (href === "/mundo") return RAMAS_MUNDO.some((r) => ruta.startsWith(r));
  return ruta.startsWith(href);
}
