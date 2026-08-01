"use client";

import { useState } from "react";

/**
 * Descarga el EPUB. Se hace por fetch y no con un enlace directo para poder
 * mostrar el error dentro de la app: si algo falla, un `<a>` abriría una
 * pestaña con un JSON de error, que en un móvil no dice nada útil.
 */
export default function DescargarEpub({ hayCapitulos }: { hayCapitulos: boolean }) {
  const [estado, setEstado] = useState<"listo" | "generando" | "error">("listo");
  const [error, setError] = useState("");

  async function descargar() {
    setEstado("generando");
    setError("");
    try {
      const res = await fetch("/api/epub");
      if (!res.ok) {
        const datos = await res.json().catch(() => ({}));
        throw new Error(datos.error ?? "No se pudo generar el EPUB");
      }

      const blob = await res.blob();
      const nombre =
        res.headers.get("Content-Disposition")?.match(/filename="(.+?)"/)?.[1] ?? "libro.epub";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombre;
      a.click();
      URL.revokeObjectURL(url);

      setEstado("listo");
    } catch (e) {
      setError((e as Error).message);
      setEstado("error");
    }
  }

  return (
    <>
      <button
        onClick={descargar}
        disabled={!hayCapitulos || estado === "generando"}
        className="mt-3 min-h-12 w-full rounded-lg border border-borde bg-superficie text-sm active:bg-superficie-alta disabled:opacity-40"
      >
        {estado === "generando" ? "Generando…" : "↓ Descargar EPUB"}
      </button>

      <p className="mt-2 text-xs text-tenue">
        {hayCapitulos
          ? "Para leerlo en un e-reader o en la app de libros del móvil."
          : "Necesitas al menos un capítulo para exportar."}
      </p>

      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}
    </>
  );
}
