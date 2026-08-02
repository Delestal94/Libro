"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tabla } from "@/lib/tablas";
import LineaTiempo from "./LineaTiempo";

const RUTAS = {
  pistas: "biblia/pistas.md",
  cronologia: "biblia/cronologia.md",
} as const;

const ESTADOS = ["pendiente", "pagada", "descartada"] as const;

const COLOR_ESTADO: Record<string, string> = {
  pendiente: "border-acento/60 text-acento",
  pagada: "border-borde text-tenue line-through",
  descartada: "border-borde text-tenue opacity-60",
};

export default function Trama({ pistas, cronologia }: { pistas: Tabla; cronologia: Tabla }) {
  const [pestana, setPestana] = useState<"pistas" | "cronologia">("pistas");

  return (
    <div className="py-6">
      <h1 className="mb-1 font-serif text-2xl">Trama</h1>
      <p className="mb-4 text-sm text-tenue">
        El aparato del misterio: qué has plantado y cuándo se paga.
      </p>

      <div className="mb-6 flex overflow-hidden rounded-md border border-borde">
        {(
          [
            ["pistas", `Pistas (${pistas.filas.length})`],
            ["cronologia", `Cronología (${cronologia.filas.length})`],
          ] as const
        ).map(([id, etiqueta]) => (
          <button
            key={id}
            onClick={() => setPestana(id)}
            className={`min-h-12 flex-1 text-sm ${
              pestana === id ? "bg-acento/15 text-acento" : "text-tenue"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {pestana === "pistas" ? (
        <Pistas tabla={pistas} />
      ) : (
        <LineaTiempo filas={cronologia.filas} />
      )}
    </div>
  );
}

// --- Pistas ---

function Pistas({ tabla }: { tabla: Tabla }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState<number | null>(null);

  const pendientes = tabla.filas.filter((f) => (f[3] || "pendiente") === "pendiente").length;

  async function cambiarEstado(indiceFila: number, actual: string) {
    const siguiente = ESTADOS[(ESTADOS.indexOf(actual as never) + 1) % ESTADOS.length];
    setOcupado(indiceFila);
    setError("");
    try {
      const res = await fetch("/api/tabla", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruta: RUTAS.pistas,
          indiceFila,
          indiceColumna: 3,
          valor: siguiente,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo actualizar");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  return (
    <>
      {tabla.filas.length > 0 && (
        <p className="mb-3 text-xs text-tenue">
          {pendientes === 0
            ? "Todas las pistas están recogidas."
            : `${pendientes} sin recoger. Toca el estado para cambiarlo.`}
        </p>
      )}

      {error && <p className="mb-3 text-sm text-peligro">{error}</p>}

      {tabla.filas.length === 0 ? (
        <Vacio texto="Aún no has anotado ninguna pista. La primera es la más difícil." />
      ) : (
        <ul className="mb-6 space-y-2">
          {tabla.filas.map((f, i) => {
            const estado = f[3] || "pendiente";
            return (
              <li key={i} className="rounded-lg border border-borde bg-superficie p-4">
                <p className="text-sm">{f[0]}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tenue">
                  <span>Siembra: {f[1] || "—"}</span>
                  <span>Recoge: {f[2] || "—"}</span>
                  <button
                    onClick={() => cambiarEstado(i, estado)}
                    disabled={ocupado === i}
                    className={`ml-auto rounded-full border px-3 py-1 disabled:opacity-40 ${
                      COLOR_ESTADO[estado] ?? COLOR_ESTADO.pendiente
                    }`}
                  >
                    {ocupado === i ? "…" : estado}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <NuevaFila
        ruta={RUTAS.pistas}
        campos={[
          { etiqueta: "La pista", requerido: true },
          { etiqueta: "Sembrada en" },
          { etiqueta: "Recogida en" },
        ]}
        extra={["pendiente"]}
        textoBoton="Anotar pista"
      />
    </>
  );
}

// --- Piezas compartidas ---

function Vacio({ texto }: { texto: string }) {
  return (
    <p className="mb-6 rounded-lg border border-dashed border-borde px-4 py-8 text-center text-sm text-tenue">
      {texto}
    </p>
  );
}

type Campo = { etiqueta: string; requerido?: boolean };

function NuevaFila({
  ruta,
  campos,
  extra = [],
  textoBoton,
}: {
  ruta: string;
  campos: Campo[];
  extra?: string[];
  textoBoton: string;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [valores, setValores] = useState<string[]>(campos.map(() => ""));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const completo = campos.every((c, i) => !c.requerido || valores[i].trim());

  async function enviar() {
    if (!completo || enviando) return;
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/tabla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruta, fila: [...valores, ...extra] }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
      setValores(campos.map(() => ""));
      setAbierto(false);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="min-h-12 w-full rounded-lg border border-dashed border-borde text-sm text-tenue active:bg-superficie"
      >
        + {textoBoton}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-borde bg-superficie p-4">
      <div className="space-y-2">
        {campos.map((c, i) => (
          <input
            key={c.etiqueta}
            value={valores[i]}
            onChange={(e) =>
              setValores((v) => v.map((x, j) => (j === i ? e.target.value : x)))
            }
            placeholder={c.etiqueta + (c.requerido ? "" : " (opcional)")}
            autoFocus={i === 0}
            className="min-h-12 w-full rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
          />
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setAbierto(false)}
          className="min-h-12 flex-1 rounded-lg border border-borde text-tenue"
        >
          Cancelar
        </button>
        <button
          onClick={enviar}
          disabled={!completo || enviando}
          className="min-h-12 flex-1 rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
        >
          {enviando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
