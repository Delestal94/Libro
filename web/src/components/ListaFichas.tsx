"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { iniciales, type TipoFicha } from "@/lib/fichas";
import { normalizarClave } from "@/lib/enlaces";

type Fila = { slug: string; nombre: string; resumen: string[]; campos: number };

export default function ListaFichas({
  tipo,
  titulo,
  singular,
  descripcion,
  fichas,
}: {
  tipo: TipoFicha;
  titulo: string;
  singular: string;
  descripcion: string;
  fichas: Fila[];
}) {
  const [filtro, setFiltro] = useState("");

  const visibles = useMemo(() => {
    const q = normalizarClave(filtro);
    if (!q) return fichas;
    return fichas.filter(
      (f) =>
        normalizarClave(f.nombre).includes(q) ||
        f.resumen.some((r) => normalizarClave(r).includes(q)),
    );
  }, [fichas, filtro]);

  return (
    <div className="py-6">
      <Link href="/mundo" className="text-sm text-tenue">
        ‹ Mundo
      </Link>
      <h1 className="mt-1 mb-1 font-serif text-2xl">{titulo}</h1>
      <p className="mb-4 text-sm text-tenue">
        {fichas.length === 0
          ? descripcion
          : `${fichas.length} ${fichas.length === 1 ? "ficha" : "fichas"}. ${descripcion}`}
      </p>

      {fichas.length > 4 && (
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar…"
          type="search"
          className="mb-4 min-h-12 w-full rounded-lg border border-borde bg-superficie px-4 outline-none focus:border-acento"
        />
      )}

      {visibles.length === 0 ? (
        <p className="mb-6 rounded-lg border border-dashed border-borde px-4 py-10 text-center text-sm text-tenue">
          {fichas.length
            ? "Ninguna coincide con el filtro."
            : `Empieza por uno. Un nombre basta; lo demás se rellena cuando se te ocurra.`}
        </p>
      ) : (
        <ul className="mb-6 space-y-2">
          {visibles.map((f) => (
            <li key={f.slug}>
              <Link
                href={`/${tipo}/${f.slug}`}
                className="flex min-h-16 items-center gap-3 rounded-lg border border-borde bg-superficie px-4 py-3 active:bg-superficie-alta"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-acento/40 bg-acento/10 font-serif text-sm text-acento">
                  {iniciales(f.nombre)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{f.nombre}</span>
                  <span className="block truncate text-xs text-tenue">
                    {f.resumen.length ? f.resumen.join(" · ") : "Ficha vacía"}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-tenue tabular-nums">{f.campos}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <NuevaFicha tipo={tipo} singular={singular} />
    </div>
  );
}

function NuevaFicha({ tipo, singular }: { tipo: TipoFicha; singular: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");

  async function crear() {
    if (!nombre.trim() || creando) return;
    setCreando(true);
    setError("");
    try {
      const res = await fetch("/api/fichas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nombre }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo crear");
      router.push(`/${tipo}/${datos.slug}`);
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
        + Nuevo {singular}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-borde bg-superficie p-4">
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && crear()}
        placeholder="Nombre"
        autoFocus
        className="min-h-12 w-full rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
      />
      <p className="mt-2 text-xs text-tenue">
        Los datos se rellenan luego, y puedes inventarte los campos que quieras.
      </p>

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
          disabled={!nombre.trim() || creando}
          className="min-h-12 flex-1 rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
        >
          {creando ? "Creando…" : "Crear"}
        </button>
      </div>
    </div>
  );
}
