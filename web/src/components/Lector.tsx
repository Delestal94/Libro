"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COLORES, COLOR_POR_DEFECTO, type Anotacion, type Color } from "@/lib/anotaciones";
import { anclajeDeSeleccion, despintar, pintar, type Anclaje } from "@/lib/resaltado";
import {
  colaAnotaciones,
  desencolarAnotacion,
  encolarAnotacion,
  type OperacionAnotacion,
  type SinTs,
} from "@/lib/almacen";

type Seccion = { ruta: string; titulo: string; palabras: number; html: string };

const TAMANOS = [16, 18, 20, 23];
const CLAVE_TAMANO = "lector:tamano";
const CLAVE_POSICION = "lector:posicion";
const CLAVE_COLOR = "lector:color";

/**
 * Lo que hay seleccionado ahora mismo. `piezas` es una por capítulo: subrayar
 * a través de un salto de capítulo crea una anotación en cada uno.
 */
type Seleccion = { piezas: Anclaje[]; x: number; y: number };

function nuevoId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function PuntosDeColor({
  elegido,
  onElegir,
  etiqueta,
}: {
  elegido: Color;
  onElegir: (c: Color) => void;
  etiqueta?: string;
}) {
  return (
    <div className="flex gap-2" role="group" aria-label={etiqueta ?? "Color del subrayado"}>
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

  const [anotaciones, setAnotaciones] = useState<Anotacion[]>(anotacionesIniciales);
  /** Las que existen pero cuyo texto ya no está en el capítulo. */
  const [huerfanas, setHuerfanas] = useState<string[]>([]);
  const [pendientes, setPendientes] = useState(0);
  const [verHuerfanas, setVerHuerfanas] = useState(false);

  const pintadas = useRef<Set<string>>(new Set());
  const sincronizando = useRef(false);

  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [colorElegido, setColorElegido] = useState<Color>(COLOR_POR_DEFECTO);
  const [comentando, setComentando] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");

  const [activa, setActiva] = useState<Anotacion | null>(null);
  const [editando, setEditando] = useState(false);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [colorEdicion, setColorEdicion] = useState<Color>(COLOR_POR_DEFECTO);

  // --- Preferencias y posición de lectura ---------------------------------

  useEffect(() => {
    const t = Number(localStorage.getItem(CLAVE_TAMANO));
    if (TAMANOS.includes(t)) setTamano(t);

    const c = localStorage.getItem(CLAVE_COLOR);
    if (c && (COLORES as readonly string[]).includes(c)) setColorElegido(c as Color);

    const y = Number(localStorage.getItem(CLAVE_POSICION));
    if (y > 0) requestAnimationFrame(() => window.scrollTo(0, y));
  }, []);

  useEffect(() => {
    localStorage.setItem(CLAVE_TAMANO, String(tamano));
  }, [tamano]);

  useEffect(() => {
    localStorage.setItem(CLAVE_COLOR, colorElegido);
  }, [colorElegido]);

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

  // --- Pintar lo que falte por pintar --------------------------------------

  /**
   * Pinta lo que no esté ya pintado, mirando el DOM en vez de fiarse de una
   * lista en memoria. Es la diferencia entre una marca que desaparece para
   * siempre y una que se recupera sola: si algo se lleva por delante el HTML
   * del capítulo, la siguiente pasada lo vuelve a poner.
   */
  const sincronizarMarcas = useCallback(() => {
    const sinSitio: string[] = [];
    let cambios = false;

    for (const a of anotaciones) {
      if (document.querySelector(`mark[data-anotacion="${CSS.escape(a.id)}"]`)) continue;
      const seccion = document.getElementById(a.ruta);
      if (!seccion) continue;
      cambios = true;
      const ok = pintar(seccion, {
        id: a.id,
        texto: a.texto,
        aparicion: a.aparicion,
        color: a.color,
        comentada: Boolean(a.comentario),
      });
      if (!ok) sinSitio.push(a.id);
    }

    if (!cambios) return;
    setHuerfanas((prev) => {
      const iguales = prev.length === sinSitio.length && prev.every((id, i) => id === sinSitio[i]);
      return iguales ? prev : sinSitio;
    });
  }, [anotaciones]);

  useEffect(() => {
    sincronizarMarcas();
  }, [sincronizarMarcas]);

  // Red de seguridad: si algo repinta el capítulo (una recarga parcial, el
  // navegador reordenando el árbol), las marcas vuelven solas en un segundo
  // en vez de quedarse perdidas hasta recargar a mano.
  useEffect(() => {
    const t = setInterval(sincronizarMarcas, 1500);
    return () => clearInterval(t);
  }, [sincronizarMarcas]);

  // --- Cola: subrayar no puede perderse nunca ------------------------------

  const vaciarCola = useCallback(async () => {
    if (sincronizando.current) return;
    sincronizando.current = true;
    try {
      // Se procesan de una en una y en orden: son operaciones sobre el mismo
      // fichero, y en paralelo se pisarían entre ellas.
      for (const op of colaAnotaciones()) {
        const hecho = await enviar(op);
        if (!hecho) break; // sin red o error: se queda para el próximo intento
        desencolarAnotacion(op);
        setPendientes(colaAnotaciones().length);
      }
    } finally {
      sincronizando.current = false;
      setPendientes(colaAnotaciones().length);
    }
  }, []);

  useEffect(() => {
    setPendientes(colaAnotaciones().length);
    void vaciarCola();
    const alVolver = () => void vaciarCola();
    window.addEventListener("online", alVolver);
    return () => window.removeEventListener("online", alVolver);
  }, [vaciarCola]);

  // Reintento suave mientras quede algo pendiente (un límite de la API se
  // levanta solo en unos minutos; esto lo recoge sin que nadie haga nada).
  useEffect(() => {
    if (!pendientes) return;
    const t = setTimeout(() => void vaciarCola(), 20000);
    return () => clearTimeout(t);
  }, [pendientes, vaciarCola]);

  const encolarYSincronizar = useCallback(
    (op: SinTs<OperacionAnotacion>) => {
      encolarAnotacion(op);
      setPendientes(colaAnotaciones().length);
      void vaciarCola();
    },
    [vaciarCola],
  );

  // --- Crear ---------------------------------------------------------------

  const crear = useCallback(
    (sel: Seleccion, comentario: string, color: Color) => {
      const limpio = comentario.replace(/\s+/g, " ").trim();
      const fecha = new Date().toISOString();

      // Una anotación por capítulo tocado. Para quien lee fue un solo gesto.
      const nuevas: Anotacion[] = sel.piezas.map((p) => ({
        id: nuevoId(),
        ruta: p.ruta,
        texto: p.texto,
        aparicion: p.aparicion,
        comentario: limpio,
        color,
        fecha,
      }));

      // Se pintan ya: el resto ocurre por detrás y no se pierde aunque falle.
      setAnotaciones((prev) => [...prev, ...nuevas]);
      for (const a of nuevas) {
        encolarYSincronizar({
          tipo: "crear",
          id: a.id,
          ruta: a.ruta,
          texto: a.texto,
          aparicion: a.aparicion,
          comentario: a.comentario,
          color: a.color,
        });
      }

      const s = window.getSelection();
      s?.empty?.();
      s?.removeAllRanges();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

      setSeleccion(null);
      setComentando(false);
      setTextoComentario("");
    },
    [encolarYSincronizar],
  );

  // --- Editar y quitar -----------------------------------------------------

  function guardarEdicion(id: string) {
    const comentario = textoEdicion.replace(/\s+/g, " ").trim();
    const actualizada = anotaciones.find((a) => a.id === id);
    if (!actualizada) return;

    const nueva = { ...actualizada, comentario, color: colorEdicion };
    despintar(id);
    pintadas.current.delete(id);
    setAnotaciones((prev) => prev.map((a) => (a.id === id ? nueva : a)));
    setActiva(nueva);
    setEditando(false);

    encolarYSincronizar({ tipo: "editar", id, comentario, color: colorEdicion });
  }

  function quitar(id: string) {
    despintar(id);
    pintadas.current.delete(id);
    setAnotaciones((prev) => prev.filter((a) => a.id !== id));
    setActiva(null);
    setEditando(false);
    encolarYSincronizar({ tipo: "borrar", id });
  }

  // --- Abrir una anotación al tocar su marca -------------------------------

  useEffect(() => {
    function alClicar(e: MouseEvent) {
      const marca = (e.target as HTMLElement).closest<HTMLElement>("mark[data-anotacion]");
      if (!marca) return;
      // Si el clic viene de terminar un arrastre, lo que quiere es seleccionar
      // texto nuevo, no abrir la anotación que hay debajo.
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.toString().trim()) return;

      const a = anotaciones.find((x) => x.id === marca.dataset.anotacion);
      if (!a) return;
      setSeleccion(null);
      abrir(a);
    }
    document.addEventListener("click", alClicar);
    return () => document.removeEventListener("click", alClicar);
  }, [anotaciones]);

  function abrir(a: Anotacion) {
    setActiva(a);
    setEditando(false);
    setTextoEdicion(a.comentario);
    setColorEdicion(a.color);
  }

  // --- Seleccionar texto ---------------------------------------------------

  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    let arrastrando = false;

    function revisar() {
      if (arrastrando) return;
      const anclaje = anclajeDeSeleccion();
      if (!anclaje) {
        setSeleccion(null);
        return;
      }
      setSeleccion({
        piezas: anclaje.piezas,
        x: anclaje.rect.left + anclaje.rect.width / 2,
        y: anclaje.rect.top,
      });
    }

    // Nada de barra mientras el dedo sigue apoyado: aparecería encima del
    // texto que se está seleccionando y cortaría la selección a la mitad.
    const alCambiar = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(revisar, 120);
    };
    const alBajar = () => {
      arrastrando = true;
    };
    const alSoltar = () => {
      arrastrando = false;
      clearTimeout(temporizador);
      temporizador = setTimeout(revisar, 30);
    };

    document.addEventListener("selectionchange", alCambiar);
    document.addEventListener("mousedown", alBajar);
    document.addEventListener("mouseup", alSoltar);
    document.addEventListener("touchstart", alBajar, { passive: true });
    document.addEventListener("touchend", alSoltar);
    return () => {
      document.removeEventListener("selectionchange", alCambiar);
      document.removeEventListener("mousedown", alBajar);
      document.removeEventListener("mouseup", alSoltar);
      document.removeEventListener("touchstart", alBajar);
      document.removeEventListener("touchend", alSoltar);
      clearTimeout(temporizador);
    };
  }, []);

  function irA(ruta: string) {
    setIndice(false);
    document.getElementById(ruta)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const listaHuerfanas = anotaciones.filter((a) => huerfanas.includes(a.id));

  return (
    <div className="py-4">
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
          {total.toLocaleString("es-ES")} palabras · {minutos} min
          {anotaciones.length > 0 && (
            <> · {anotaciones.length} {anotaciones.length === 1 ? "anotación" : "anotaciones"}</>
          )}
          {pendientes > 0 && <span className="text-acento"> · {pendientes} sin sincronizar</span>}
        </p>

        {listaHuerfanas.length > 0 && (
          <button
            onClick={() => setVerHuerfanas(true)}
            className="mt-2 w-full rounded-md border border-peligro/40 bg-peligro/10 px-3 py-2 text-left text-xs text-tenue"
          >
            {listaHuerfanas.length}{" "}
            {listaHuerfanas.length === 1 ? "anotación no encaja" : "anotaciones no encajan"} con el
            texto actual · ver
          </button>
        )}
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

      <div style={{ fontSize: tamano }}>
        {secciones.map((s, i) => (
          <section key={s.ruta} id={s.ruta} className="mb-16 scroll-mt-6">
            {i > 0 && <hr className="mx-auto mb-12 w-1/3 border-borde" />}
            <h2 className="mb-8 text-center font-serif text-2xl">{s.titulo}</h2>
            <article className="prosa" dangerouslySetInnerHTML={{ __html: s.html }} />
          </section>
        ))}

        <p className="pb-8 text-center text-sm text-tenue">— Fin de lo escrito —</p>
      </div>

      {/* Al seleccionar: un color para subrayar, o comentar. */}
      {seleccion && !comentando && (
        <div
          className="fixed z-50 flex items-center gap-1 rounded-lg border border-borde bg-superficie-alta px-2 py-1.5 shadow-lg"
          style={{
            left: seleccion.x,
            top: Math.max(8, seleccion.y - 8),
            transform: "translate(-50%, -100%)",
          }}
        >
          <PuntosDeColor
            elegido={colorElegido}
            onElegir={(c) => {
              setColorElegido(c);
              crear(seleccion, "", c);
            }}
          />
          <div className="mx-1 h-6 w-px bg-borde" />
          <button
            onClick={() => setComentando(true)}
            className="min-h-9 min-w-9 rounded-md text-lg"
            aria-label="Comentar"
          >
            💬
          </button>
        </div>
      )}

      {/* Comentar lo seleccionado. */}
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
            <p className="mb-3 max-h-24 overflow-y-auto border-l-2 border-acento pl-3 text-sm text-tenue italic">
              «{seleccion.piezas.map((p) => p.texto).join(" ")}»
            </p>
            {seleccion.piezas.length > 1 && (
              <p className="mb-3 text-xs text-tenue">
                Cruza {seleccion.piezas.length} capítulos: se guarda uno por capítulo, con el
                mismo comentario.
              </p>
            )}
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
            <button
              onClick={() => crear(seleccion, textoComentario, colorElegido)}
              className="mt-3 min-h-12 w-full rounded-lg bg-acento font-semibold text-fondo"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Una anotación existente: ver, editar o quitar. */}
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
            <p className="mb-3 max-h-24 overflow-y-auto border-l-2 border-acento pl-3 text-sm text-tenue italic">
              «{activa.texto}»
            </p>

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
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEditando(false)}
                    className="min-h-11 flex-1 rounded-lg border border-borde text-sm text-tenue"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => guardarEdicion(activa.id)}
                    className="min-h-11 flex-1 rounded-lg bg-acento text-sm font-semibold text-fondo"
                  >
                    Guardar
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
                    onClick={() => quitar(activa.id)}
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

      {/* Huérfanas: el texto cambió y ya no encajan. No se borran solas. */}
      {verHuerfanas && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60"
          onClick={() => setVerHuerfanas(false)}
        >
          <div
            className="max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-borde bg-superficie p-4 pb-segura"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 font-serif text-lg">Anotaciones sin sitio</h2>
            <p className="mb-4 text-xs text-tenue">
              El texto que marcaban ya no está tal cual en el capítulo, así que no se pueden
              pintar. Se conservan aquí por si hacen falta.
            </p>
            {listaHuerfanas.map((a) => (
              <div key={a.id} className="mb-3 rounded-lg border border-borde p-3">
                <p className="border-l-2 border-peligro pl-2 text-sm text-tenue italic">
                  «{a.texto}»
                </p>
                {a.comentario && <p className="mt-2 text-sm">{a.comentario}</p>}
                <button
                  onClick={() => quitar(a.id)}
                  className="mt-2 min-h-9 text-xs text-peligro"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Envía una operación. `false` = no salió y hay que reintentarla más tarde. */
async function enviar(op: OperacionAnotacion): Promise<boolean> {
  const peticion =
    op.tipo === "crear"
      ? {
          method: "POST",
          body: {
            id: op.id,
            ruta: op.ruta,
            texto: op.texto,
            aparicion: op.aparicion,
            comentario: op.comentario,
            color: op.color,
          },
        }
      : op.tipo === "editar"
        ? { method: "PUT", body: { id: op.id, comentario: op.comentario, color: op.color } }
        : { method: "DELETE", body: { id: op.id } };

  try {
    const res = await fetch("/api/anotacion", {
      method: peticion.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peticion.body),
    });
    // 4xx que no sea 429 es culpa de la petición: reintentarla no la arregla,
    // así que se da por procesada y se saca de la cola.
    if (res.status >= 400 && res.status < 500 && res.status !== 429) return true;
    return res.ok;
  } catch {
    return false; // sin red
  }
}
