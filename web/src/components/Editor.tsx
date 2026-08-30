"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import { contarPalabras } from "@/lib/libro";
import { enlacesAHtml, normalizarClave, type Retroenlace } from "@/lib/enlaces";
import {
  desencolar,
  encolar,
  esFalloDeRed,
  guardarBorrador,
  leerBorrador,
  limpiarBorrador,
} from "@/lib/almacen";
import Retroenlaces from "./Retroenlaces";
import BorrarDocumento from "./BorrarDocumento";

type Props = { ruta: string; shaInicial: string; contenidoInicial: string; titulo: string };

type DatosEnlaces = {
  documentos: { ruta: string; titulo: string }[];
  indice: [string, string][];
  retroenlaces: Retroenlace[];
  rotos: string[];
};

/** Atajos de Markdown: en un teclado táctil, escribir `**` a mano es un suplicio. */
const ATAJOS = [
  { etiqueta: "[[ ]]", antes: "[[", despues: "]]" },
  { etiqueta: "H2", antes: "\n## ", despues: "" },
  { etiqueta: "B", antes: "**", despues: "**" },
  { etiqueta: "I", antes: "*", despues: "*" },
  { etiqueta: "« »", antes: "«", despues: "»" },
  { etiqueta: "—", antes: "—", despues: "" },
  { etiqueta: "…", antes: "…", despues: "" },
  { etiqueta: "＊＊＊", antes: "\n\n---\n\n", despues: "" },
];

export default function Editor({ ruta, shaInicial, contenidoInicial, titulo }: Props) {
  const router = useRouter();
  const [texto, setTexto] = useState(contenidoInicial);
  const [sha, setSha] = useState(shaInicial);
  const [guardado, setGuardado] = useState(contenidoInicial);
  const [estado, setEstado] = useState<"limpio" | "guardando" | "encolado" | "error">("limpio");
  const [error, setError] = useState("");
  const [vista, setVista] = useState<"editar" | "leer">("editar");
  const [enlaces, setEnlaces] = useState<DatosEnlaces | null>(null);
  const [recuperable, setRecuperable] = useState<string | null>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  const sucio = texto !== guardado;
  const palabras = useMemo(() => contarPalabras(texto), [texto]);
  const indice = useMemo(() => new Map(enlaces?.indice ?? []), [enlaces]);

  // Se calcula siempre, no sólo en la vista "leer": en desktop se ve en
  // paralelo al editor (split-view), así que no puede depender de la pestaña.
  const html = useMemo(() => {
    // Los `[[ ]]` se convierten a HTML antes de Markdown: así marked los ve ya
    // como enlaces normales y no intenta interpretar los corchetes.
    return marked.parse(enlacesAHtml(texto, indice), { async: false, breaks: false }) as string;
  }, [texto, indice]);

  // --- Enlaces del proyecto, en segundo plano ---
  useEffect(() => {
    let vivo = true;
    fetch(`/api/enlaces?ruta=${encodeURIComponent(ruta)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => vivo && d && !d.error && setEnlaces(d))
      .catch(() => {
        /* sin red: el editor sigue funcionando, solo sin retroenlaces */
      });
    return () => {
      vivo = false;
    };
  }, [ruta, guardado]);

  // --- Borrador local: ¿quedó texto sin guardar de la última vez? ---
  useEffect(() => {
    const b = leerBorrador(ruta);
    if (b && b.texto !== contenidoInicial) {
      // Solo se ofrece si el fichero no cambió por otro lado; si cambió, el
      // borrador es viejo y restaurarlo pisaría lo nuevo.
      if (b.sha === shaInicial) setRecuperable(b.texto);
      else limpiarBorrador(ruta);
    }
  }, [ruta, contenidoInicial, shaInicial]);

  // Guarda el borrador mientras se escribe, con un respiro entre pulsaciones.
  useEffect(() => {
    if (!sucio) return;
    const t = setTimeout(() => guardarBorrador(ruta, texto, sha), 800);
    return () => clearTimeout(t);
  }, [texto, sucio, ruta, sha]);

  const guardar = useCallback(async () => {
    if (estado === "guardando") return;
    setEstado("guardando");
    setError("");

    // Se congela el texto enviado: si sigue escribiendo mientras guarda, lo que
    // se marca como guardado es exactamente lo que llegó al servidor.
    const enviado = texto;
    try {
      const res = await fetch("/api/archivo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruta, contenido: enviado, sha }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo guardar");

      setSha(datos.sha);
      setGuardado(enviado);
      setEstado("limpio");
      limpiarBorrador(ruta);
      desencolar(ruta);
      router.refresh();
    } catch (e) {
      if (esFalloDeRed(e)) {
        // Sin red no se pierde nada: queda en cola y sale al volver la señal.
        encolar({ ruta, contenido: enviado, sha });
        guardarBorrador(ruta, enviado, sha);
        setEstado("encolado");
        setError("");
      } else {
        setError((e as Error).message);
        setEstado("error");
      }
    }
  }, [estado, texto, ruta, sha, router]);

  // Reintenta al recuperar la conexión.
  useEffect(() => {
    if (estado !== "encolado") return;
    const alVolver = () => void guardar();
    window.addEventListener("online", alVolver);
    return () => window.removeEventListener("online", alVolver);
  }, [estado, guardar]);

  useEffect(() => {
    if (!sucio) return;
    const alSalir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", alSalir);
    return () => window.removeEventListener("beforeunload", alSalir);
  }, [sucio]);

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void guardar();
      }
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [guardar]);

  function insertar(antes: string, despues: string) {
    const el = campo.current;
    if (!el) return;
    const { selectionStart: i, selectionEnd: f } = el;
    const seleccion = texto.slice(i, f);
    setTexto(texto.slice(0, i) + antes + seleccion + despues + texto.slice(f));
    // Recolocar el cursor tras el repintado, o iOS lo manda al final.
    requestAnimationFrame(() => {
      el.focus();
      const pos = i + antes.length + seleccion.length;
      el.setSelectionRange(pos, pos);
    });
  }

  // --- Autocompletado de [[ ---
  const sugerencias = useMemo(() => {
    const el = campo.current;
    if (!el || !enlaces) return [];
    const antes = texto.slice(0, el.selectionStart);
    // Solo si hay un `[[` abierto sin cerrar justo detrás del cursor.
    const m = antes.match(/\[\[([^\]\n]*)$/);
    if (!m) return [];
    const q = normalizarClave(m[1]);
    return enlaces.documentos
      .filter((d) => d.ruta !== ruta)
      .filter((d) => !q || normalizarClave(d.titulo).includes(q) || normalizarClave(d.ruta).includes(q))
      .slice(0, 6);
  }, [texto, enlaces, ruta]);

  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  function completar(titulo: string) {
    const el = campo.current;
    if (!el) return;
    const i = el.selectionStart;
    const antes = texto.slice(0, i);
    const m = antes.match(/\[\[([^\]\n]*)$/);
    if (!m) return;

    const inicio = i - m[1].length;
    const resto = texto.slice(i);
    // Si el usuario ya tenía los `]]` puestos, no se duplican.
    const cierre = resto.startsWith("]]") ? "" : "]]";
    setTexto(texto.slice(0, inicio) + titulo + cierre + resto);
    setMostrarSugerencias(false);
    requestAnimationFrame(() => {
      el.focus();
      const pos = inicio + titulo.length + cierre.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="flex min-h-dvh flex-col py-4">
      <header className="mb-3">
        <Link href="/" className="text-sm text-tenue">
          ‹ Biblioteca
        </Link>
        <h1 className="mt-1 truncate font-serif text-xl">{titulo}</h1>
        <p className="truncate font-mono text-[11px] text-tenue">{ruta}</p>
      </header>

      {recuperable !== null && (
        <div className="mb-3 rounded-lg border border-acento/50 bg-acento/10 p-3">
          <p className="text-sm">Hay texto sin guardar de la última vez.</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                setTexto(recuperable);
                setRecuperable(null);
              }}
              className="min-h-10 flex-1 rounded-md bg-acento px-3 text-sm font-semibold text-fondo"
            >
              Recuperarlo
            </button>
            <button
              onClick={() => {
                limpiarBorrador(ruta);
                setRecuperable(null);
              }}
              className="min-h-10 flex-1 rounded-md border border-borde text-sm text-tenue"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      <div className="mb-2 flex items-center gap-2">
        {/* En desktop se ven las dos vistas a la vez (split-view), así que el
            interruptor sólo hace falta en móvil. */}
        <div className="flex overflow-hidden rounded-md border border-borde lg:hidden">
          {(["editar", "leer"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`min-h-10 px-4 text-sm capitalize ${
                vista === v ? "bg-acento/15 text-acento" : "text-tenue"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-tenue tabular-nums">
          {palabras.toLocaleString("es-ES")} palabras
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        <div className={vista === "editar" ? "" : "hidden lg:block"}>
          <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
            {ATAJOS.map((a) => (
              <button
                key={a.etiqueta}
                onClick={() => insertar(a.antes, a.despues)}
                className="min-h-10 shrink-0 rounded-md border border-borde bg-superficie px-3 text-xs text-tenue active:bg-superficie-alta"
              >
                {a.etiqueta}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              ref={campo}
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                setMostrarSugerencias(true);
              }}
              onSelect={() => setMostrarSugerencias(true)}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
              spellCheck
              className="min-h-[55dvh] w-full resize-none rounded-lg border border-borde bg-superficie p-4 font-mono text-[15px] leading-relaxed outline-none focus:border-acento"
            />

            {mostrarSugerencias && sugerencias.length > 0 && (
              <ul className="absolute inset-x-0 bottom-2 z-20 mx-2 overflow-hidden rounded-lg border border-acento bg-superficie-alta shadow-lg">
                {sugerencias.map((d) => (
                  <li key={d.ruta}>
                    <button
                      // onMouseDown: se adelanta al blur del textarea, que si no
                      // cerraría la lista antes de registrar el toque.
                      onMouseDown={(e) => {
                        e.preventDefault();
                        completar(d.titulo);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm active:bg-superficie"
                    >
                      <span className="text-acento">{d.titulo}</span>
                      <span className="ml-2 font-mono text-[11px] text-tenue">{d.ruta}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <article
          className={`prosa rounded-lg border border-borde bg-superficie p-5 text-lg lg:min-h-[55dvh] ${
            vista === "leer" ? "" : "hidden lg:block"
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}

      <Retroenlaces
        entradas={enlaces?.retroenlaces ?? []}
        rotos={enlaces?.rotos ?? []}
        cargando={!enlaces}
      />

      <BorrarDocumento ruta={ruta} sha={sha} />

      {/* Barra de guardado justo encima de la navegación: siempre al alcance. */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-borde bg-fondo/95 px-4 py-2 backdrop-blur pb-segura">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <span className="text-xs text-tenue">
            {estado === "guardando"
              ? "Guardando…"
              : estado === "encolado"
                ? "Sin conexión · se enviará solo"
                : sucio
                  ? "Sin guardar"
                  : "Todo guardado"}
          </span>
          <button
            onClick={guardar}
            disabled={!sucio || estado === "guardando"}
            className="ml-auto min-h-11 rounded-lg bg-acento px-6 font-semibold text-fondo disabled:opacity-30"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
