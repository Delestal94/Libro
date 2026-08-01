"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DESTINOS = [
  { id: "manuscrito", etiqueta: "Capítulo" },
  { id: "biblia", etiqueta: "Biblia" },
  { id: "notas", etiqueta: "Nota" },
];

export default function NuevoDocumento() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [seccion, setSeccion] = useState("manuscrito");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");

  async function crear() {
    if (!titulo.trim() || creando) return;
    setCreando(true);
    setError("");
    try {
      const res = await fetch("/api/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, seccion }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo crear");
      router.push(`/editar/${datos.ruta}`);
    } catch (e) {
      setError((e as Error).message);
      setCreando(false);
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="min-h-12 w-full rounded-lg border border-dashed border-borde text-sm text-tenue active:bg-superficie"
      >
        + Nuevo documento
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-borde bg-superficie p-4">
      <div className="mb-3 flex gap-2">
        {DESTINOS.map((d) => (
          <button
            key={d.id}
            onClick={() => setSeccion(d.id)}
            className={`min-h-10 flex-1 rounded-md border text-sm ${
              seccion === d.id
                ? "border-acento bg-acento/10 text-acento"
                : "border-borde text-tenue"
            }`}
          >
            {d.etiqueta}
          </button>
        ))}
      </div>

      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && crear()}
        placeholder="Título"
        autoFocus
        className="min-h-12 w-full rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
      />

      {seccion === "manuscrito" && (
        <p className="mt-2 text-xs text-tenue">Se numera solo, siguiendo al último capítulo.</p>
      )}
      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setAbierto(false)}
          className="min-h-12 flex-1 rounded-lg border border-borde text-tenue"
        >
          Cancelar
        </button>
        <button
          onClick={crear}
          disabled={!titulo.trim() || creando}
          className="min-h-12 flex-1 rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
        >
          {creando ? "Creando…" : "Crear"}
        </button>
      </div>
    </div>
  );
}
