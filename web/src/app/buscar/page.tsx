"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Coincidencia } from "../api/buscar/route";

export default function Buscar() {
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<Coincidencia[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (q.trim().length < 2) {
      setResultados([]);
      return;
    }

    // Antirrebote: buscar en cada pulsación descargaría el libro entero N veces.
    const t = setTimeout(async () => {
      setBuscando(true);
      setError("");
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`);
        const datos = await res.json();
        if (!res.ok) throw new Error(datos.error ?? "Error al buscar");
        setResultados(datos.coincidencias);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBuscando(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [q]);

  const porFichero = resultados.reduce<Record<string, Coincidencia[]>>((acc, c) => {
    (acc[c.ruta] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="py-6">
      <h1 className="mb-4 font-serif text-2xl">Buscar</h1>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Un nombre, una frase, un término…"
        type="search"
        autoFocus
        className="min-h-12 w-full rounded-lg border border-borde bg-superficie px-4 outline-none focus:border-acento"
      />

      <p className="mt-2 text-xs text-tenue">
        {buscando
          ? "Buscando…"
          : q.trim().length < 2
            ? "Busca en todo el proyecto. Ignora acentos y mayúsculas."
            : `${resultados.length} ${resultados.length === 1 ? "coincidencia" : "coincidencias"}`}
      </p>

      {error && <p className="mt-3 text-sm text-peligro">{error}</p>}

      <div className="mt-6 space-y-6">
        {Object.entries(porFichero).map(([ruta, lista]) => (
          <section key={ruta}>
            <h2 className="mb-2 flex items-baseline gap-2">
              <Link href={`/editar/${ruta}`} className="truncate text-acento underline">
                {lista[0].titulo}
              </Link>
              <span className="shrink-0 text-xs text-tenue">{lista.length}</span>
            </h2>
            <ul className="overflow-hidden rounded-lg border border-borde">
              {lista.slice(0, 8).map((c, i) => (
                <li
                  key={`${c.linea}-${i}`}
                  className={`bg-superficie px-4 py-3 text-sm ${i ? "border-t border-borde" : ""}`}
                >
                  <span className="mr-2 font-mono text-[11px] text-tenue">L{c.linea}</span>
                  {c.texto}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
