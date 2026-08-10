"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Seccion = { ruta: string; titulo: string; palabras: number; html: string };
type Anotacion = { id: string; ruta: string; cita: string; comentario: string; fecha: string };

const TAMANOS = [16, 18, 20, 23];
const CLAVE_TAMANO = "lector:tamano";
const CLAVE_POSICION = "lector:posicion";

/** Selección de texto en curso: qué dice, en qué capítulo, y dónde mostrar la barra. */
type Seleccion = { texto: string; ruta: string; x: number; y: number };

/** Elementos de bloque tras los que el navegador cuenta un salto como un espacio. */
const SELECTOR_BLOQUE = "p,li,h1,h2,h3,h4,blockquote,td,th";

type Punto = { nodo: Text; offset: number };

/**
 * Busca `cita` en el texto del contenedor y envuelve la primera aparición en
 * un <mark>. Construye un mapa carácter a carácter (nodo de texto + offset)
 * en vez de sumar longitudes: así, cuando la cita cruza un salto de párrafo,
 * se puede insertar el espacio sintético que el navegador ya puso al hacer
 * `selection.toString()` — sin ese espacio, la búsqueda nunca encontraba
 * nada en las citas que atravesaban un `</p><p>`.
 */
function resaltarCita(contenedor: HTMLElement, cita: string, id: string, comentada: boolean): boolean {
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
      mapa.push({ nodo, offset: 0 });
    }
    bloqueAnterior = bloque;

    for (let i = 0; i < nodo.data.length; i++) {
      texto += nodo.data[i];
      mapa.push({ nodo, offset: i });
    }
  }

  const inicio = texto.indexOf(cita);
  if (inicio === -1) return false; // El capítulo cambió y la cita ya no existe tal cual.
  const fin = inicio + cita.length;

  const puntoInicio = mapa[inicio];
  const puntoFin = mapa[fin - 1];
  if (!puntoInicio || !puntoFin) return false;

  const rango = document.createRange();
  rango.setStart(puntoInicio.nodo, puntoInicio.offset);
  rango.setEnd(puntoFin.nodo, puntoFin.offset + 1);

  const marca = document.createElement("mark");
  marca.className = comentada ? "resaltado resaltado-comentado" : "resaltado";
  marca.dataset.anotacion = id;

  try {
    rango.surroundContents(marca);
  } catch {
    // La cita cruza un límite de elemento (p. ej. entra y sale de una <em>):
    // extractContents sí lo soporta, surroundContents no.
    const contenido = rango.extractContents();
    marca.appendChild(contenido);
    rango.insertNode(marca);
  }
  return true;
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
  const [comentando, setComentando] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [activa, setActiva] = useState<Anotacion | null>(null);
  const [errorGuardado, setErrorGuardado] = useState("");

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

  // Pinta en el DOM las anotaciones que todavía no se han aplicado. Corre en
  // cada cambio de la lista (se añade una nueva, se carga la página) pero
  // sólo procesa las que faltan: las ya envueltas se saltan por el filtro
  // del TreeWalker, así que reprocesar no duplica marcas.
  useEffect(() => {
    if (!contenedor.current) return;
    for (const a of anotaciones) {
      if (aplicadas.current.has(a.id)) continue;
      const seccion = document.getElementById(a.ruta);
      if (!seccion) continue;
      const ok = resaltarCita(seccion, a.cita, a.id, Boolean(a.comentario));
      if (ok) aplicadas.current.add(a.id);
    }
  }, [anotaciones]);

  // Clic en un resaltado ya existente: abre la tarjeta con el comentario (o
  // el botón de borrar, si es un subrayado sin nada escrito).
  useEffect(() => {
    function alClicar(e: MouseEvent) {
      const marca = (e.target as HTMLElement).closest<HTMLElement>("mark[data-anotacion]");
      if (!marca) return;
      const id = marca.dataset.anotacion;
      const a = anotaciones.find((x) => x.id === id);
      if (a) {
        setSeleccion(null);
        setActiva(a);
      }
    }
    document.addEventListener("click", alClicar);
    return () => document.removeEventListener("click", alClicar);
  }, [anotaciones]);

  // Selección de texto: barra flotante con "Resaltar" y "Comentar".
  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout> | undefined;

    function revisar() {
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

    document.addEventListener("selectionchange", alCambiarSeleccion);
    return () => {
      document.removeEventListener("selectionchange", alCambiarSeleccion);
      clearTimeout(temporizador);
    };
  }, []);

  const guardarAnotacion = useCallback(
    async (ruta: string, cita: string, comentario: string) => {
      setGuardando(true);
      setErrorGuardado("");
      try {
        const res = await fetch("/api/anotacion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ruta, cita, comentario }),
        });
        const datos = await res.json();
        if (!res.ok) throw new Error(datos.error ?? "No se pudo guardar");
        setAnotaciones((prev) => [...prev, datos.anotacion as Anotacion]);
        window.getSelection()?.removeAllRanges();
        setSeleccion(null);
        setComentando(false);
        setTextoComentario("");
      } catch (e) {
        setErrorGuardado((e as Error).message);
      } finally {
        setGuardando(false);
      }
    },
    [],
  );

  async function borrarAnotacion(id: string) {
    // Optimista: en modo lectura, un fallo de red al borrar no debería
    // quedar la marca a medias en pantalla, pero tampoco bloquear la lectura.
    const marca = document.querySelector<HTMLElement>(`mark[data-anotacion="${id}"]`);
    if (marca) marca.outerHTML = marca.innerHTML;
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

      {/* Barra flotante al seleccionar texto: resaltar, o resaltar y comentar. */}
      {seleccion && !comentando && (
        <div
          className="fixed z-50 flex -translate-x-1/2 -translate-y-full overflow-hidden rounded-lg border border-borde bg-superficie-alta shadow-lg"
          style={{ left: seleccion.x, top: Math.max(8, seleccion.y - 8) }}
        >
          <button
            onClick={() => guardarAnotacion(seleccion.ruta, seleccion.texto, "")}
            disabled={guardando}
            className="min-h-11 border-r border-borde px-4 text-sm font-medium text-acento disabled:opacity-50"
          >
            ✎ Resaltar
          </button>
          <button
            onClick={() => setComentando(true)}
            disabled={guardando}
            className="min-h-11 px-4 text-sm font-medium text-tenue disabled:opacity-50"
          >
            💬 Comentar
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
              onClick={() => guardarAnotacion(seleccion.ruta, seleccion.texto, textoComentario)}
              disabled={guardando || !textoComentario.trim()}
              className="mt-3 min-h-12 w-full rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
            >
              {guardando ? "Guardando…" : "Guardar comentario"}
            </button>
          </div>
        </div>
      )}

      {/* Tarjeta al tocar un resaltado ya existente. */}
      {activa && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60" onClick={() => setActiva(null)}>
          <div
            className="rounded-t-2xl border-t border-borde bg-superficie p-4 pb-segura"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 border-l-2 border-acento pl-3 text-sm text-tenue italic">«{activa.cita}»</p>
            {activa.comentario ? (
              <p className="mb-4 leading-relaxed">{activa.comentario}</p>
            ) : (
              <p className="mb-4 text-sm text-tenue">Subrayado sin comentario.</p>
            )}
            <button
              onClick={() => borrarAnotacion(activa.id)}
              className="min-h-11 w-full rounded-lg border border-borde text-sm text-peligro"
            >
              Quitar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
