"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calcularTramos,
  describirSalto,
  interpretarFilas,
  ordenar,
  type Conocimiento,
  type Orden,
  type Suceso,
} from "@/lib/cronologia";

const RUTA = "biblia/cronologia.md";

/**
 * El color dice qué sabe el lector en ese punto. Es la información que hace
 * legible un misterio largo: de un vistazo se ve dónde el lector va a ciegas.
 */
const ESTILO: Record<Conocimiento, { punto: string; etiqueta: string }> = {
  sabe: { punto: "bg-acento border-acento", etiqueta: "lo sabe" },
  sospecha: { punto: "bg-acento/30 border-acento", etiqueta: "lo sospecha" },
  ignora: { punto: "bg-fondo border-tenue", etiqueta: "no lo sabe" },
  desconocido: { punto: "bg-superficie-alta border-borde", etiqueta: "sin definir" },
};

export default function LineaTiempo({ filas }: { filas: string[][] }) {
  const [orden, setOrden] = useState<Orden>("mundo");
  const [abierto, setAbierto] = useState<number | null>(null);

  const sucesos = useMemo(() => interpretarFilas(filas), [filas]);
  const { situados, sueltos } = useMemo(() => ordenar(sucesos, orden), [sucesos, orden]);
  const tramos = useMemo(() => calcularTramos(situados, orden), [situados, orden]);

  if (!sucesos.length) {
    return (
      <>
        <p className="mb-6 rounded-lg border border-dashed border-borde px-4 py-10 text-center text-sm text-tenue">
          Sin sucesos todavía. Empieza por lo que pasó antes de la página 1.
        </p>
        <NuevoSuceso />
      </>
    );
  }

  return (
    <>
      {/* Los dos relojes. Ver los mismos sucesos reordenarse es el objetivo. */}
      <div className="mb-3 flex overflow-hidden rounded-md border border-borde">
        {(
          [
            ["mundo", "Orden del mundo"],
            ["lector", "Orden del lector"],
          ] as const
        ).map(([id, etiqueta]) => (
          <button
            key={id}
            onClick={() => setOrden(id)}
            className={`min-h-11 flex-1 text-xs ${
              orden === id ? "bg-acento/15 text-acento" : "text-tenue"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <p className="mb-5 text-xs text-tenue">
        {orden === "mundo"
          ? "Cuándo ocurrió de verdad. El espacio entre puntos es el tiempo que pasa."
          : "En qué orden se entera el lector. Lo mismo, contado."}
      </p>

      {situados.length > 0 && (
        <div className="relative mb-6">
          {/* Espina dorsal de la línea */}
          <div className="absolute top-2 bottom-2 left-[7px] w-px bg-borde" />

          {tramos.map(({ suceso, hueco, saltoGrande, distancia }) => (
            <div
              key={suceso.indice}
              /* El hueco proporcional hace que se vea dónde pasa el tiempo. */
              style={{ marginTop: hueco ? `${Math.round(hueco * 56)}px` : undefined }}
            >
              {saltoGrande && distancia !== null && (
                <div className="relative mb-2 pl-8">
                  <span className="text-[10px] tracking-wide text-tenue uppercase">
                    ··· {describirSalto(distancia, orden)} ···
                  </span>
                </div>
              )}

              <Punto
                suceso={suceso}
                orden={orden}
                abierto={abierto === suceso.indice}
                alAbrir={() => setAbierto(abierto === suceso.indice ? null : suceso.indice)}
              />
            </div>
          ))}
        </div>
      )}

      {sueltos.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-1 text-xs font-semibold tracking-wide text-tenue uppercase">
            Sin situar ({sueltos.length})
          </h2>
          <p className="mb-3 text-xs text-tenue">
            {orden === "mundo"
              ? "No he sabido deducir una fecha de estos. Escribe un número («año 1200», «hace 300 años») y se colocan solos."
              : "Sin número de capítulo no puedo ponerlos en el orden del lector."}
          </p>
          <div className="space-y-2">
            {sueltos.map((s) => (
              <Punto
                key={s.indice}
                suceso={s}
                orden={orden}
                sinEspina
                abierto={abierto === s.indice}
                alAbrir={() => setAbierto(abierto === s.indice ? null : s.indice)}
              />
            ))}
          </div>
        </section>
      )}

      <Leyenda />
      <NuevoSuceso />
    </>
  );
}

function Punto({
  suceso,
  orden,
  abierto,
  alAbrir,
  sinEspina,
}: {
  suceso: Suceso;
  orden: Orden;
  abierto: boolean;
  alAbrir: () => void;
  sinEspina?: boolean;
}) {
  const estilo = ESTILO[suceso.conocimiento];

  return (
    <div className={sinEspina ? "" : "relative pl-8"}>
      {!sinEspina && (
        <span
          className={`absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 ${estilo.punto}`}
        />
      )}

      <button
        onClick={alAbrir}
        className={`w-full rounded-lg border px-4 py-3 text-left ${
          abierto ? "border-acento bg-superficie" : "border-transparent active:bg-superficie"
        } ${sinEspina ? "border-borde bg-superficie" : ""}`}
      >
        <span className="block text-xs text-acento">
          {orden === "lector" && suceso.capitulo
            ? `Cap. ${suceso.capitulo}`
            : suceso.cuando || "sin fecha"}
        </span>
        <span className="mt-0.5 block text-sm">{suceso.que || "(sin descripción)"}</span>
        <span className="mt-1 block text-[11px] text-tenue">
          {orden === "lector"
            ? suceso.cuando || "sin fecha"
            : suceso.capitulo
              ? `Cap. ${suceso.capitulo}`
              : "sin capítulo"}
          {" · "}
          {estilo.etiqueta}
        </span>
      </button>

      {abierto && <EditarSuceso suceso={suceso} />}
    </div>
  );
}

function Leyenda() {
  return (
    <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-borde bg-superficie px-4 py-3">
      {(["sabe", "sospecha", "ignora"] as const).map((k) => (
        <span key={k} className="flex items-center gap-2 text-[11px] text-tenue">
          <span className={`h-3 w-3 rounded-full border-2 ${ESTILO[k].punto}`} />
          El lector {ESTILO[k].etiqueta}
        </span>
      ))}
    </div>
  );
}

// --- Edición ---

const CAMPOS = [
  { etiqueta: "Cuándo", ayuda: "«1200», «hace 300 años», «Año 847 de la Ceniza»" },
  { etiqueta: "Qué ocurre" },
  { etiqueta: "Capítulo" },
  { etiqueta: "¿Lo sabe el lector?", ayuda: "sí · lo sospecha · no" },
];

function EditarSuceso({ suceso }: { suceso: Suceso }) {
  const router = useRouter();
  const [valores, setValores] = useState([
    suceso.cuando,
    suceso.que,
    suceso.capitulo,
    suceso.lector,
  ]);
  const [ocupado, setOcupado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState("");

  async function llamar(metodo: "PUT" | "DELETE", cuerpo: object) {
    setOcupado(true);
    setError("");
    try {
      const res = await fetch("/api/tabla", {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruta: RUTA, indiceFila: suceso.indice, ...cuerpo }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="mt-2 rounded-lg border border-borde bg-superficie-alta p-4">
      <div className="space-y-2">
        {CAMPOS.map((c, i) => (
          <div key={c.etiqueta}>
            <label className="mb-1 block text-[11px] text-tenue">
              {c.etiqueta}
              {c.ayuda && <span className="ml-1 opacity-70">— {c.ayuda}</span>}
            </label>
            <input
              value={valores[i]}
              onChange={(e) => setValores((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              className="min-h-11 w-full rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
            />
          </div>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => llamar("PUT", { fila: valores })}
          disabled={ocupado}
          className="min-h-11 flex-1 rounded-lg bg-acento text-sm font-semibold text-fondo disabled:opacity-40"
        >
          {ocupado ? "…" : "Guardar"}
        </button>
        <button
          onClick={() => (confirmando ? llamar("DELETE", {}) : setConfirmando(true))}
          disabled={ocupado}
          className={`min-h-11 rounded-lg border px-4 text-sm disabled:opacity-40 ${
            confirmando ? "border-peligro bg-peligro/10 text-peligro" : "border-borde text-tenue"
          }`}
        >
          {confirmando ? "¿Seguro?" : "Borrar"}
        </button>
      </div>
    </div>
  );
}

function NuevoSuceso() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [valores, setValores] = useState(["", "", "", ""]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function enviar() {
    if (!valores[1].trim() || enviando) return;
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/tabla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruta: RUTA, fila: valores }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
      setValores(["", "", "", ""]);
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
        + Añadir suceso
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-borde bg-superficie p-4">
      <div className="space-y-2">
        {CAMPOS.map((c, i) => (
          <div key={c.etiqueta}>
            <label className="mb-1 block text-[11px] text-tenue">
              {c.etiqueta}
              {c.ayuda && <span className="ml-1 opacity-70">— {c.ayuda}</span>}
            </label>
            <input
              value={valores[i]}
              onChange={(e) => setValores((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              autoFocus={i === 0}
              className="min-h-12 w-full rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
            />
          </div>
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
          disabled={!valores[1].trim() || enviando}
          className="min-h-12 flex-1 rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
        >
          {enviando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
