"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { normalizarClave } from "@/lib/enlaces";

type DocFila = { ruta: string; titulo: string; palabras: number };
type SeccionFilas = {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  docs: DocFila[];
};

const CLAVE_PLEGADO = "biblioteca:plegado";

function leerPlegadas(): Set<string> {
  try {
    const guardado = localStorage.getItem(CLAVE_PLEGADO);
    return new Set(guardado ? (JSON.parse(guardado) as string[]) : []);
  } catch {
    return new Set();
  }
}

export default function BibliotecaSecciones({ secciones }: { secciones: SeccionFilas[] }) {
  const [filtro, setFiltro] = useState("");
  const [plegadas, setPlegadas] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set() : leerPlegadas(),
  );

  const q = normalizarClave(filtro);
  const visibles = useMemo(() => {
    if (!q) return secciones;
    return secciones
      .map((s) => ({
        ...s,
        docs: s.docs.filter(
          (d) => normalizarClave(d.titulo).includes(q) || normalizarClave(d.ruta).includes(q),
        ),
      }))
      .filter((s) => s.docs.length > 0);
  }, [secciones, q]);

  function alternar(id: string) {
    setPlegadas((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      localStorage.setItem(CLAVE_PLEGADO, JSON.stringify([...siguiente]));
      return siguiente;
    });
  }

  return (
    <div>
      <input
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Filtrar documentos…"
        type="search"
        className="mb-6 min-h-12 w-full rounded-lg border border-borde bg-superficie px-4 outline-none focus:border-acento"
      />

      {q && visibles.length === 0 && (
        <p className="mb-6 rounded-lg border border-dashed border-borde px-4 py-8 text-center text-sm text-tenue">
          Ningún documento coincide con «{filtro}».
        </p>
      )}

      {visibles.map((s) => {
        // Con un filtro activo conviene ver el resultado directo, aunque la
        // sección esté plegada de antes.
        const abierta = q ? true : !plegadas.has(s.id);

        return (
          <section key={s.id} className="mb-8">
            <button
              type="button"
              onClick={() => alternar(s.id)}
              aria-expanded={abierta}
              className="mb-1 flex w-full items-center gap-2 text-left text-sm font-semibold tracking-wide uppercase"
            >
              <span className="text-acento" aria-hidden="true">
                {s.icono}
              </span>
              {s.titulo}
              <span className="ml-auto text-xs text-tenue" aria-hidden="true">
                {abierta ? "▾" : "▸"}
              </span>
            </button>
            <p className="mb-3 text-xs text-tenue">{s.descripcion}</p>

            {abierta && (
              <ul className="overflow-hidden rounded-lg border border-borde">
                {s.docs.map((d, i) => (
                  <li key={d.ruta} className={i ? "border-t border-borde" : ""}>
                    <Link
                      href={`/editar/${d.ruta}`}
                      className="flex min-h-14 items-center justify-between gap-3 bg-superficie px-4 py-3 active:bg-superficie-alta"
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{d.titulo}</span>
                        <span className="block truncate font-mono text-[11px] text-tenue">
                          {d.ruta}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-tenue tabular-nums">
                        {d.palabras.toLocaleString("es-ES")} pal.
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
