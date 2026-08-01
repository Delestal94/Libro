"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import { contarPalabras } from "@/lib/libro";

type Props = {
  ruta: string;
  shaInicial: string;
  contenidoInicial: string;
  titulo: string;
};

/** Atajos de Markdown: en un teclado táctil, escribir `**` a mano es un suplicio. */
const ATAJOS = [
  { etiqueta: "H2", antes: "\n## ", despues: "" },
  { etiqueta: "B", antes: "**", despues: "**" },
  { etiqueta: "I", antes: "*", despues: "*" },
  { etiqueta: "“ ”", antes: "«", despues: "»" },
  { etiqueta: "—", antes: "—", despues: "" },
  { etiqueta: "…", antes: "…", despues: "" },
  { etiqueta: "＊＊＊", antes: "\n\n---\n\n", despues: "" },
];

export default function Editor({ ruta, shaInicial, contenidoInicial, titulo }: Props) {
  const [texto, setTexto] = useState(contenidoInicial);
  const [sha, setSha] = useState(shaInicial);
  const [guardado, setGuardado] = useState(contenidoInicial);
  const [estado, setEstado] = useState<"limpio" | "guardando" | "error">("limpio");
  const [error, setError] = useState("");
  const [vista, setVista] = useState<"editar" | "leer">("editar");
  const campo = useRef<HTMLTextAreaElement>(null);

  const sucio = texto !== guardado;
  const palabras = useMemo(() => contarPalabras(texto), [texto]);
  const html = useMemo(
    () => (vista === "leer" ? marked.parse(texto, { async: false, breaks: false }) : ""),
    [vista, texto],
  );

  const guardar = useCallback(async () => {
    if (estado === "guardando") return;
    setEstado("guardando");
    setError("");

    // Se congela el texto que se envía: si sigue escribiendo mientras guarda,
    // el "guardado" que se marca es exactamente el que llegó al servidor.
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
    } catch (e) {
      setError((e as Error).message);
      setEstado("error");
    }
  }, [estado, texto, ruta, sha]);

  // Aviso al cerrar la pestaña con cambios sin guardar.
  useEffect(() => {
    if (!sucio) return;
    const alSalir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", alSalir);
    return () => window.removeEventListener("beforeunload", alSalir);
  }, [sucio]);

  // Ctrl/Cmd+S para quien lo abra desde el PC.
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
    const nuevo = texto.slice(0, i) + antes + seleccion + despues + texto.slice(f);
    setTexto(nuevo);
    // Recolocar el cursor tras el repintado, o iOS lo manda al final.
    requestAnimationFrame(() => {
      el.focus();
      const pos = i + antes.length + seleccion.length;
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

      <div className="mb-2 flex items-center gap-2">
        <div className="flex overflow-hidden rounded-md border border-borde">
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

      {vista === "editar" ? (
        <>
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

          <textarea
            ref={campo}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            spellCheck
            className="min-h-[55dvh] w-full flex-1 resize-none rounded-lg border border-borde bg-superficie p-4 font-mono text-[15px] leading-relaxed outline-none focus:border-acento"
          />
        </>
      ) : (
        <article
          className="prosa flex-1 rounded-lg border border-borde bg-superficie p-5 text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}

      {/* Barra de guardado justo encima de la navegación: siempre al alcance. */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-borde bg-fondo/95 px-4 py-2 backdrop-blur pb-segura">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <span className="text-xs text-tenue">
            {estado === "guardando"
              ? "Guardando…"
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
