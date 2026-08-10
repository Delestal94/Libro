"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COLORES, type Color } from "@/lib/anotaciones";

type Seccion = { ruta: string; titulo: string; palabras: number; html: string };
type Anotacion = {
  id: string;
  ruta: string;
  cita: string;
  comentario: string;
  color: Color;
  fecha: string;
};

const TAMANOS = [16, 18, 20, 23];
const CLAVE_TAMANO = "lector:tamano";
const CLAVE_POSICION = "lector:posicion";
const COLOR_POR_DEFECTO: Color = "dorado";

/** Selección de texto en curso: qué dice, en qué capítulo, y dónde mostrar la barra. */
type Seleccion = { texto: string; ruta: string; x: number; y: number };

/** Elementos de bloque tras los que el navegador cuenta un salto como un espacio. */
const SELECTOR_BLOQUE = "p,li,h1,h2,h3,h4,blockquote,td,th";

type Punto = { nodo: Text; offset: number; bloque: Element | null };

/**
 * Busca `cita` en el texto del contenedor y la envuelve en uno o más
 * <mark>. Construye un mapa carácter a carácter (nodo de texto + offset +
 * bloque) en vez de sumar longitudes: así, cuando la cita cruza un salto de
 * párrafo, se puede (a) insertar el espacio sintético que el navegador ya
 * puso al hacer `selection.toString()`, y (b) partir el resaltado en un
 * <mark> por cada párrafo que toca, en vez de uno solo.
 *
 * Lo segundo no es cosmético: un <mark> es contenido de línea (`phrasing
 * content`), y meterle un <p> dentro —que es justo lo que hacía la versión
 * anterior con `extractContents` cuando la cita cruzaba un `</p><p>`— es
 * HTML inválido. El navegador lo pinta bien al principio, pero en cuanto
 * algo dispara un reflow importante puede normalizar el árbol y partir o
 * borrar la marca. Con un <mark> por párrafo esto no puede pasar: cada uno
 * sólo contiene texto y elementos de línea, que es lo que <mark> admite.
 */
function resaltarCita(
  contenedor: HTMLElement,
  cita: string,
  id: string,
  color: Color,
  comentada: boolean,
): boolean {
  const walker = document.createTreeWalker(contenedor, NodeFilter.SHOW_TEXT, {
    acceptNode(nodo) {
      return nodo.parentElement?.closest("mark[data-anotacion]")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });

  let texto = "";
  const mapa: Punto[] = [];
  let bloqueAnterior: Element | null = null;

  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const nodo = n as Text;
    const bloque = nodo.parentElement?.closest(SELECTOR_BLOQUE) ?? null;

    if (bloqueAnterior !== null && bloque !== bloqueAnterior && texto && !/\s$/.test(texto)) {
      texto += " ";
      mapa.push({ nodo, offset: 0, bloque });
    }
    bloqueAnterior = bloque;

    for (let i = 0; i < nodo.data.length; i++) {
      texto += nodo.data[i];
      mapa.push({ nodo, offset: i, bloque });
    }
  }

  const inicio = texto.indexOf(cita);
  if (inicio === -1) return false; // El capítulo cambió y la cita ya no existe tal cual.
  const fin = inicio + cita.length;

  // Agrupa el rango [inicio, fin) en tramos contiguos del mismo bloque.
  const tramos: { desde: Punto; hasta: Punto }[] = [];
  for (let i = inicio; i < fin; i++) {
    const punto = mapa[i];
    if (!punto) continue;
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.hasta.bloque === punto.bloque) {
      ultimo.hasta = punto;
    } else {
      tramos.push({ desde: punto, hasta: punto });
    }
  }
  if (!tramos.length) return false;

  for (const t of tramos) {
    const rango = document.createRange();
    rango.setStart(t.desde.nodo, t.desde.offset);
    rango.setEnd(t.hasta.nodo, t.hasta.offset + 1);

    const marca = document.createElement("mark");
    marca.className = comentada ? "resaltado resaltado-comentado" : "resaltado";
    marca.dataset.anotacion = id;
    marca.dataset.color = color;

    try {
      rango.surroundContents(marca);
    } catch {
      // Dentro del mismo bloque, esto sólo puede pasar por cruzar un
      // elemento de línea (una <em>, un <a>): extractContents sí lo
      // soporta, surroundContents no.
      const contenido = rango.extractContents();
      marca.appendChild(contenido);
      rango.insertNode(marca);
    }
  }
  return true;
}

/** Quita del DOM todas las marcas (puede haber una por párrafo) de una anotación. */
function desmarcar(id: string) {
  document.querySelectorAll<HTMLElement>(`mark[data-anotacion="${id}"]`).forEach((marca) => {
    marca.outerHTML = marca.innerHTML;
  });
}

function PuntosDeColor({ elegido, onElegir }: { elegido: Color; onElegir: (c: Color) => void }) {
  return (
    <div className="flex gap-2">
      {COLORES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onElegir(c)}
          aria-label={`Color ${c}`}
          aria-pressed={elegido === c}
          className="punto-color"
          data-color={c}
          data-elegido={elegido === c}
        />
      ))}
    </div>
  );
}

export default function Lector({
  secciones,
  total,
  minutos,
  anotacionesIniciales,
}: {
  secciones: Seccion[];
  total: number;
  minutos: number;
  anotacionesIniciales: Anotacion[];
}) {
  const [tamano, setTamano] = useState(18);
  const [indice, setIndice] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);

  const [anotaciones, setAnotaciones] = useState(anotacionesIniciales);
  const aplicadas = useRef<Set<string>>(new Set());

  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [colorElegido, setColorElegido] = useState<Color>(COLOR_POR_DEFECTO);
  const [comentando, setComentando] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState("");

  const [activa, setActiva] = useState<Anotacion | null>(null);
  const [editando, setEditando] = useState(false);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [colorEdicion, setColorEdicion] = useState<Color>(COLOR_POR_DEFECTO);

  // Preferencia de tamaño y posición de lectura, recordadas entre visitas.
  useEffect(() => {
    const t = Number(localStorage.getItem(CLAVE_TAMANO));
    if (TAMANOS.includes(t)) setTamano(t);

    const y = Number(localStorage.getItem(CLAVE_POSICION));
    if (y > 0) requestAnimationFrame(() => window.scrollTo(0, y));
  }, []);

  useEffect(() => {
    localStorage.setItem(CLAVE_TAMANO, String(tamano));
  }, [tamano]);

  useEffect(() => {
    let pendiente = false;
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const alto = document.documentElement.scrollHeight - window.innerHeight;
        setProgreso(alto > 0 ? Math.min(1, window.scrollY / alto) : 0);
        localStorage.setItem(CLAVE_POSICION, String(Math.round(window.scrollY)));
        pendiente = false;
      });
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  function irA(ruta: string) {
    setIndice(false);
    document.getElementById(ruta)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Pinta en el DOM las anotaciones que todavía no se han aplicado.
  useEffect(() => {
    if (!contenedor.current) return;
    for (const a of anotaciones) {
      if (aplicadas.current.has(a.id)) continue;
      const seccion = document.getElementById(a.ruta);
      if (!seccion) continue;
      const ok = resaltarCita(seccion, a.cita, a.id, a.color, Boolean(a.comentario));
      if (ok) aplicadas.current.add(a.id);
    }
  }, [anotaciones]);

  // Clic en un resaltado ya existente: abre la tarjeta con el comentario.
  useEffect(() => {
    function alClicar(e: MouseEvent) {
      const marca = (e.target as HTMLElement).closest<HTMLElement>("mark[data-anotacion]");
      if (!marca) return;
      const id = marca.dataset.anotacion;
      const a = anotaciones.find((x) => x.id === id);
      if (a) {
        setSeleccion(null);
        setActiva(a);
        setEditando(false);
        setTextoEdicion(a.comentario);
        setColorEdicion(a.color);
      }
    }
    document.addEventListener("click", alClicar);
    return () => document.removeEventListener("click", alClicar);
  }, [anotaciones]);

  // Selección de texto: barra flotante con colores y comentario.
  //
  // No se reacciona a `selectionchange` mientras el botón sigue apretado:
  // si la barra aparece a mitad de un arrastre, se dibuja encima del texto
  // que se está seleccionando, el ratón (o el dedo) pasa a estar sobre la
  // barra en vez de sobre la prosa, y el navegador corta la selección ahí
  // — con doble clic (que no arrastra) nunca pasaba, y por eso sólo fallaba
  // arrastrando.
  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    let arrastrando = false;

    function revisar() {
      if (arrastrando) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        setSeleccion(null);
        return;
      }
      const texto = sel.toString().replace(/\s+/g, " ").trim();
      if (!texto || texto.length < 3 || texto.length > 500) {
        setSeleccion(null);
        return;
      }
      const nodo = sel.anchorNode;
      const elemento = nodo instanceof Element ? nodo : nodo?.parentElement;
      const seccion = elemento?.closest<HTMLElement>("section[id]");
      const dentroDeProsa = elemento?.closest(".prosa");
      if (!seccion || !dentroDeProsa) {
        setSeleccion(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) return;
      setSeleccion({ texto, ruta: seccion.id, x: rect.left + rect.width / 2, y: rect.top });
    }

    function alCambiarSeleccion() {
      clearTimeout(temporizador);
      temporizador = setTimeout(revisar, 150);
    }

    function alBajar() {
      arrastrando = true;
    }

    function alSoltar() {
      arrastrando = false;
      clearTimeout(temporizador);
      // Pequeño margen para que el navegador termine de fijar la selección
      // antes de leerla.
      temporizador = setTimeout(revisar, 30);
    }

    document.addEventListener("selectionchange", alCambiarSeleccion);
    document.addEventListener("mousedown", alBajar);
    document.addEventListener("mouseup", alSoltar);
    document.addEventListener("touchstart", alBajar, { passive: true });
    document.addEventListener("touchend", alSoltar);
    return () => {
      document.removeEventListener("selectionchange", alCambiarSeleccion);
      document.removeEventListener("mousedown", alBajar);
      document.removeEventListener("mouseup", alSoltar);
      document.removeEventListener("touchstart", alBajar);
      document.removeEventListener("touchend", alSoltar);
      clearTimeout(temporizador);
    };
  }, []);

  const guardarAnotacion = useCallback(
    async (ruta: string, cita: string, comentario: string, color: Color) => {
      setGuardando(true);
      setErrorGuardado("");
      try {
        const res = await fetch("/api/anotacion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ruta, cita, comentario, color }),
        });
        const datos = await res.json();
        if (!res.ok) throw new Error(datos.error ?? "No se pudo guardar");
        setAnotaciones((prev) => [...prev, datos.anotacion as Anotacion]);

        const sel = window.getSelection();
        sel?.empty?.();
        sel?.removeAllRanges();
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

        setSeleccion(null);
        setComentando(false);
        setTextoComentario("");
        setColorElegido(COLOR_POR_DEFECTO);
      } catch (e) {
        setErrorGuardado((e as Error).message);
      } finally {
        setGuardando(false);
      }
    },
    [],
  );

  async function borrarAnotacion(id: string) {
    desmarcar(id);
    aplicadas.current.delete(id);
    setAnotaciones((prev) => prev.filter((a) => a.id !== id));
    setActiva(null);
    try {
      await fetch("/api/anotacion", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // Sin conexión: la marca ya se quitó de esta pantalla. Peor caso,
      // reaparece en la próxima carga porque no se borró en el repo.
    }
  }

  async function guardarEdicion(id: string) {
    setGuardando(true);
    setErrorGuardado("");
    try {
      const res = await fetch("/api/anotacion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, comentario: textoEdicion, color: colorEdicion }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo guardar");
      const actualizada = datos.anotacion as Anotacion;

      // Repinta la(s) marca(s) desde cero con el color/comentario nuevos.
      desmarcar(id);
      aplicadas.current.delete(id);

      setAnotaciones((prev) => prev.map((a) => (a.id === id ? actualizada : a)));
      setActiva(actualizada);
      setEditando(false);
    } catch (e) {
      setErrorGuardado((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="py-4">
      {/* Barra de progreso de lectura, fina y fija arriba. */}
      <div
        className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-acento transition-transform duration-150"
        style={{ transform: `scaleX(${progreso})` }}
      />

      <header className="mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndice((v) => !v)}
            className="min-h-11 rounded-md border border-borde bg-superficie px-3 text-sm text-tenue"
          >
            ☰ Índice
          </button>

          <div className="ml-auto flex overflow-hidden rounded-md border border-borde">
            {TAMANOS.map((t) => (
              <button
                key={t}
                onClick={() => setTamano(t)}
                className={`min-h-11 px-3 ${tamano === t ? "bg-acento/15 text-acento" : "text-tenue"}`}
                style={{ fontSize: Math.max(11, t - 6) }}
                aria-label={`Tamaño ${t} píxeles`}
              >
                A
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-tenue">
          {secciones.length} {secciones.length === 1 ? "capítulo" : "capítulos"} ·{" "}
          {total.toLocaleString("es-ES")} palabras · {minutos} min de lectura
          {anotaciones.length > 0 && (
            <>
              {" "}
              · {anotaciones.length} {anotaciones.length === 1 ? "anotación" : "anotaciones"}
            </>
          )}
        </p>
      </header>

      {indice && (
        <nav className="mb-6 overflow-hidden rounded-lg border border-borde">
          {secciones.map((s, i) => (
            <button
              key={s.ruta}
              onClick={() => irA(s.ruta)}
              className={`flex min-h-14 w-full items-center justify-between gap-3 bg-superficie px-4 text-left active:bg-superficie-alta ${
                i ? "border-t border-borde" : ""
              }`}
            >
              <span className="truncate">{s.titulo}</span>
              <span className="shrink-0 text-xs text-tenue tabular-nums">
                {s.palabras.toLocaleString("es-ES")}
              </span>
            </button>
          ))}
        </nav>
      )}

      <div ref={contenedor} style={{ fontSize: tamano }}>
        {secciones.map((s, i) => (
          <section key={s.ruta} id={s.ruta} className="mb-16 scroll-mt-6">
            {i > 0 && <hr className="mx-auto mb-12 w-1/3 border-borde" />}
            <h2 className="mb-8 text-center font-serif text-2xl">{s.titulo}</h2>
            <article className="prosa" dangerouslySetInnerHTML={{ __html: s.html }} />
          </section>
        ))}

        <p className="pb-8 text-center text-sm text-tenue">— Fin de lo escrito —</p>
      </div>

      {/* Barra flotante al seleccionar texto: colores para resaltar, o comentar. */}
      {seleccion && !comentando && (
        <div
          className="fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-lg border border-borde bg-superficie-alta px-2 py-1.5 shadow-lg"
          style={{ left: seleccion.x, top: Math.max(8, seleccion.y - 8) }}
        >
          <PuntosDeColor
            elegido={colorElegido}
            onElegir={(c) => {
              setColorElegido(c);
              guardarAnotacion(seleccion.ruta, seleccion.texto, "", c);
            }}
          />
          <div className="mx-1 h-6 w-px bg-borde" />
          <button
            onClick={() => setComentando(true)}
            disabled={guardando}
            className="min-h-9 min-w-9 rounded-md text-lg disabled:opacity-50"
            aria-label="Comentar"
          >
            💬
          </button>
        </div>
      )}

      {/* Hoja inferior para escribir el comentario sobre la cita seleccionada. */}
      {seleccion && comentando && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60"
          onClick={() => {
            setComentando(false);
            setSeleccion(null);
          }}
        >
          <div
            className="rounded-t-2xl border-t border-borde bg-superficie p-4 pb-segura"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 border-l-2 border-acento pl-3 text-sm text-tenue italic">
              «{seleccion.texto}»
            </p>

            <div className="mb-3">
              <PuntosDeColor elegido={colorElegido} onElegir={setColorElegido} />
            </div>

            <textarea
              autoFocus
              value={textoComentario}
              onChange={(e) => setTextoComentario(e.target.value)}
              placeholder="Qué te hizo notar esto…"
              rows={3}
              className="w-full resize-none rounded-lg border border-borde bg-fondo p-3 leading-relaxed outline-none focus:border-acento"
            />
            {errorGuardado && <p className="mt-2 text-sm text-peligro">{errorGuardado}</p>}
            <button
              onClick={() => guardarAnotacion(seleccion.ruta, seleccion.texto, textoComentario, colorElegido)}
              disabled={guardando || !textoComentario.trim()}
              className="mt-3 min-h-12 w-full rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
            >
              {guardando ? "Guardando…" : "Guardar comentario"}
            </button>
          </div>
        </div>
      )}

      {/* Tarjeta al tocar un resaltado ya existente: ver, editar o quitar. */}
      {activa && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60"
          onClick={() => {
            setActiva(null);
            setEditando(false);
          }}
        >
          <div
            className="rounded-t-2xl border-t border-borde bg-superficie p-4 pb-segura"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 border-l-2 border-acento pl-3 text-sm text-tenue italic">«{activa.cita}»</p>

            {editando ? (
              <>
                <div className="mb-3">
                  <PuntosDeColor elegido={colorEdicion} onElegir={setColorEdicion} />
                </div>
                <textarea
                  autoFocus
                  value={textoEdicion}
                  onChange={(e) => setTextoEdicion(e.target.value)}
                  placeholder="Sin comentario"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-borde bg-fondo p-3 leading-relaxed outline-none focus:border-acento"
                />
                {errorGuardado && <p className="mt-2 text-sm text-peligro">{errorGuardado}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEditando(false)}
                    className="min-h-11 flex-1 rounded-lg border border-borde text-sm text-tenue"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => guardarEdicion(activa.id)}
                    disabled={guardando}
                    className="min-h-11 flex-1 rounded-lg bg-acento text-sm font-semibold text-fondo disabled:opacity-50"
                  >
                    {guardando ? "Guardando…" : "Guardar"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {activa.comentario ? (
                  <p className="mb-4 leading-relaxed">{activa.comentario}</p>
                ) : (
                  <p className="mb-4 text-sm text-tenue">Subrayado sin comentario.</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditando(true)}
                    className="min-h-11 flex-1 rounded-lg border border-borde text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => borrarAnotacion(activa.id)}
                    className="min-h-11 flex-1 rounded-lg border border-borde text-sm text-peligro"
                  >
                    Quitar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
