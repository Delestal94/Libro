"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Hoja inferior para apuntar una idea en treinta segundos.
 * Se abre con el teclado ya desplegado: si hay que dar dos toques, no se usa.
 */
export default function CapturaRapida({ alCerrar }: { alCerrar: () => void }) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"listo" | "guardando" | "guardado" | "error">("listo");
  const [error, setError] = useState("");
  const campo = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    campo.current?.focus();
  }, []);

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [alCerrar]);

  async function guardar() {
    if (!texto.trim() || estado === "guardando") return;
    setEstado("guardando");
    try {
      const res = await fetch("/api/nota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
      setEstado("guardado");
      // Sin esto la biblioteca sigue mostrando el estado anterior: la nota está
      // en GitHub pero la pantalla no se ha enterado.
      router.refresh();
      setTimeout(alCerrar, 700);
    } catch (e) {
      setError((e as Error).message);
      setEstado("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60" onClick={alCerrar}>
      <div
        className="rounded-t-2xl border-t border-borde bg-superficie p-4 pb-segura"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-tenue uppercase">Nota rápida</h2>
          <button onClick={alCerrar} className="px-2 py-1 text-2xl leading-none text-tenue">
            ×
          </button>
        </div>

        <textarea
          ref={campo}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Una idea, una imagen, una frase suelta…"
          rows={5}
          className="w-full resize-none rounded-lg border border-borde bg-fondo p-3 leading-relaxed outline-none focus:border-acento"
        />

        {estado === "error" && <p className="mt-2 text-sm text-peligro">{error}</p>}

        <p className="mt-2 text-xs text-tenue">Se añade con fecha a notas/inbox.md</p>

        <button
          onClick={guardar}
          disabled={!texto.trim() || estado === "guardando"}
          className="mt-3 min-h-12 w-full rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
        >
          {estado === "guardando" ? "Guardando…" : estado === "guardado" ? "✓ Guardado" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
