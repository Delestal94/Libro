"use client";

import Link from "next/link";
import type { Retroenlace } from "@/lib/enlaces";

/**
 * Quién menciona este documento, y los enlaces suyos que aún no existen.
 * Es la vista que mantiene coherente un lore grande: se ve de un golpe dónde
 * aparece un personaje sin buscarlo a mano.
 */
export default function Retroenlaces({
  entradas,
  rotos,
  cargando,
}: {
  entradas: Retroenlace[];
  rotos: string[];
  cargando: boolean;
}) {
  if (cargando) {
    return <p className="mt-6 text-xs text-tenue">Buscando menciones…</p>;
  }

  if (!entradas.length && !rotos.length) return null;

  return (
    <div className="mt-8 space-y-6">
      {entradas.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-tenue uppercase">
            Mencionado en ({entradas.length})
          </h2>
          <ul className="overflow-hidden rounded-lg border border-borde">
            {entradas.map((e, i) => (
              <li key={e.desde} className={i ? "border-t border-borde" : ""}>
                <Link
                  href={`/editar/${e.desde}`}
                  className="block bg-superficie px-4 py-3 active:bg-superficie-alta"
                >
                  <span className="block text-sm text-acento">{e.tituloDesde}</span>
                  <span className="mt-0.5 block text-xs text-tenue">{e.contexto}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rotos.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-tenue uppercase">
            Enlaces sin destino ({rotos.length})
          </h2>
          <p className="mb-2 text-xs text-tenue">
            Los mencionas aquí pero aún no tienen documento propio.
          </p>
          <div className="flex flex-wrap gap-2">
            {rotos.map((r) => (
              <span
                key={r}
                className="rounded-md border border-dashed border-peligro/50 px-3 py-1.5 text-sm text-peligro"
              >
                {r}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
