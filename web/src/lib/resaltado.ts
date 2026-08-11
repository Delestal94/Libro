/**
 * Pintar anotaciones sobre el HTML ya renderizado de un capítulo.
 *
 * Todo lo de aquí trabaja sobre el DOM y no sabe nada de cómo se guardan las
 * anotaciones: recibe un texto y qué aparición de ese texto hay que marcar, y
 * se encarga de encontrarla y envolverla.
 *
 * Dos cosas que costaron sangre y conviene no volver a romper:
 *
 * 1. **El texto del DOM se normaliza igual que al guardar.** El markdown del
 *    manuscrito parte los párrafos largos en varias líneas; `marked` deja esos
 *    saltos como `\n` de verdad dentro del texto, aunque el navegador los pinte
 *    como un espacio. Si no se colapsan, ninguna cita que cruce un salto se
 *    encuentra jamás.
 *
 * 2. **Una anotación puede necesitar varias marcas.** `<mark>` sólo admite
 *    contenido de línea, así que meter un `<p>` dentro es HTML inválido: el
 *    navegador lo normaliza cuando le apetece y la marca desaparece sola. Si el
 *    texto cruza párrafos, se pone un `<mark>` por párrafo, todos con el mismo
 *    `data-anotacion`.
 *
 * Dos subrayados que se solapan quedan anidados. Es válido —`<mark>` puede
 * contener otro— y se ve como los dos colores mezclados; al tocarlo se abre el
 * de dentro, que es el más específico.
 */

import { normalizarTexto, posicionDeAparicion, type Color } from "./anotaciones.ts";

/** Elementos de bloque: dentro de uno, un <mark> es válido; a caballo, no. */
const SELECTOR_BLOQUE = "p,li,h1,h2,h3,h4,h5,h6,blockquote,td,th,dd,dt,figcaption";

const ATRIBUTO = "data-anotacion";

type Punto = { nodo: Text; offset: number; bloque: Element | null };

/**
 * Recorre el texto visible de un elemento y devuelve, además del texto ya
 * normalizado, de qué nodo y posición salió cada carácter — que es lo que
 * permite volver del texto plano a un rango real del DOM.
 */
export function recorrerTexto(contenedor: HTMLElement): { texto: string; mapa: Punto[] } {
  // Se recorre **todo** el texto, incluido el que ya está marcado. Es
  // deliberado: el sistema de coordenadas tiene que ser el capítulo entero y
  // no depender de cuántas marcas haya puestas, o el número de aparición que
  // se calculó al subrayar dejaría de coincidir con el de al repintar en
  // cuanto hubiera una marca por delante.
  const walker = document.createTreeWalker(contenedor, NodeFilter.SHOW_TEXT);

  let texto = "";
  const mapa: Punto[] = [];
  let bloqueAnterior: Element | null = null;

  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const nodo = n as Text;
    const bloque = nodo.parentElement?.closest(SELECTOR_BLOQUE) ?? null;

    // Entre dos bloques hay un espacio aunque el markdown no lo escriba.
    if (bloqueAnterior !== null && bloque !== bloqueAnterior && texto && !texto.endsWith(" ")) {
      texto += " ";
      mapa.push({ nodo, offset: 0, bloque });
    }
    bloqueAnterior = bloque;

    for (let i = 0; i < nodo.data.length; i++) {
      const c = nodo.data[i];
      if (/\s/.test(c)) {
        if (!texto.endsWith(" ") && texto) {
          texto += " ";
          mapa.push({ nodo, offset: i, bloque });
        }
        continue;
      }
      texto += c;
      mapa.push({ nodo, offset: i, bloque });
    }
  }

  // El texto puede empezar con un espacio si el primer nodo era en blanco.
  if (texto.startsWith(" ")) {
    texto = texto.slice(1);
    mapa.shift();
  }

  return { texto, mapa };
}

/** El texto visible de un elemento, normalizado igual que al guardar. */
export function textoDe(contenedor: HTMLElement): string {
  return recorrerTexto(contenedor).texto;
}

export type Marca = {
  id: string;
  texto: string;
  aparicion: number;
  color: Color;
  comentada: boolean;
};

/**
 * Pinta una anotación. Devuelve `true` si encontró dónde: `false` significa
 * huérfana — el texto ya no está en el capítulo — y quien llama decide qué
 * hacer con ella (aquí no se borra nada nunca).
 */
export function pintar(contenedor: HTMLElement, marca: Marca): boolean {
  const objetivo = normalizarTexto(marca.texto);
  if (!objetivo) return false;

  const { texto, mapa } = recorrerTexto(contenedor);
  const inicio = posicionDeAparicion(texto, objetivo, marca.aparicion);
  if (inicio === -1) return false;

  const fin = inicio + objetivo.length;

  // Se agrupa el rango en tramos que no crucen un bloque: un <mark> por tramo.
  const tramos: { desde: Punto; hasta: Punto }[] = [];
  for (let i = inicio; i < fin; i++) {
    const punto = mapa[i];
    if (!punto) continue;
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.hasta.bloque === punto.bloque) ultimo.hasta = punto;
    else tramos.push({ desde: punto, hasta: punto });
  }
  if (!tramos.length) return false;

  for (const t of tramos) {
    const rango = document.createRange();
    rango.setStart(t.desde.nodo, t.desde.offset);
    rango.setEnd(t.hasta.nodo, t.hasta.offset + 1);

    const el = document.createElement("mark");
    el.className = marca.comentada ? "resaltado resaltado-comentado" : "resaltado";
    el.setAttribute(ATRIBUTO, marca.id);
    el.dataset.color = marca.color;

    try {
      rango.surroundContents(el);
    } catch {
      // Dentro del mismo bloque esto sólo pasa al cruzar un elemento de línea
      // (una <em>, un <a>): extractContents sí lo admite, surroundContents no.
      el.appendChild(rango.extractContents());
      rango.insertNode(el);
    }
  }
  return true;
}

/** Quita del DOM todas las marcas de una anotación, dejando el texto intacto. */
export function despintar(id: string, raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(`mark[${ATRIBUTO}="${CSS.escape(id)}"]`).forEach((marca) => {
    const padre = marca.parentNode;
    if (!padre) return;
    while (marca.firstChild) padre.insertBefore(marca.firstChild, marca);
    padre.removeChild(marca);
    padre.normalize(); // vuelve a unir los nodos de texto partidos
  });
}

/**
 * Datos de anclaje de lo que hay seleccionado ahora mismo, o null si la
 * selección no sirve (vacía, fuera de la prosa, demasiado corta o larga).
 *
 * La aparición se cuenta sobre el texto que va **desde el principio de la
 * sección hasta donde empieza la selección**, así que sale exacta sin tener
 * que adivinar nada después.
 */
export function anclajeDeSeleccion(
  limites: { minimo: number; maximo: number } = { minimo: 3, maximo: 500 },
): { ruta: string; texto: string; aparicion: number; rect: DOMRect } | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;

  const rango = sel.getRangeAt(0);
  const texto = normalizarTexto(rango.toString());
  if (texto.length < limites.minimo || texto.length > limites.maximo) return null;

  const nodo = rango.startContainer;
  const elemento = nodo instanceof Element ? nodo : nodo.parentElement;
  const seccion = elemento?.closest<HTMLElement>("section[id]");
  if (!seccion || !elemento?.closest(".prosa")) return null;

  const antes = document.createRange();
  antes.selectNodeContents(seccion);
  antes.setEnd(rango.startContainer, rango.startOffset);

  const aparicion = contarEn(normalizarTexto(antes.toString()), texto);

  const rect = rango.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;

  return { ruta: seccion.id, texto, aparicion, rect };
}

function contarEn(pajar: string, aguja: string): number {
  let n = 0;
  let i = pajar.indexOf(aguja);
  while (i !== -1) {
    n++;
    i = pajar.indexOf(aguja, i + 1);
  }
  return n;
}
