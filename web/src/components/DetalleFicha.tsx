"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TIPOS, aClave, etiquetaDe, iniciales, type Campo, type TipoFicha } from "@/lib/fichas";
import type { Retroenlace } from "@/lib/enlaces";
import Retroenlaces from "./Retroenlaces";

type CampoRelleno = { clave: string; etiqueta: string; valor: string };

type Props = {
  tipo: TipoFicha;
  slug: string;
  nombre: string;
  datos: Record<string, string>;
  campos: CampoRelleno[];
  cuerpo: string;
  cuerpoHtml: string;
  menciones: Retroenlace[];
};

export default function DetalleFicha({
  tipo,
  slug,
  nombre,
  datos,
  campos,
  cuerpo,
  cuerpoHtml,
  menciones,
}: Props) {
  const router = useRouter();
  const def = TIPOS[tipo];
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState<Record<string, string>>(datos);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Sugerencias que aún no están en la ficha: lo demás ya se ve.
  const sinUsar = def.campos.filter((c) => !borrador[c.clave]?.trim());

  async function guardar() {
    setGuardando(true);
    setError("");
    try {
      const res = await fetch("/api/ficha", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, slug, datos: borrador }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
      setEditando(false);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="py-4">
      <Link href={`/${tipo}`} className="text-sm text-tenue">
        ‹ {def.plural}
      </Link>

      <header className="mt-3 mb-6 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-acento/40 bg-acento/10 font-serif text-xl text-acento">
          {iniciales(nombre)}
        </span>
        <div className="min-w-0">
          <h1 className="font-serif text-2xl break-words">{nombre}</h1>
          <p className="text-xs text-tenue">
            {def.icono} {def.singular}
          </p>
        </div>
      </header>

      <section className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide text-tenue uppercase">Ficha</h2>
          <button
            onClick={() => {
              setBorrador(datos);
              setEditando((v) => !v);
              setError("");
            }}
            className="min-h-9 px-2 text-sm text-acento"
          >
            {editando ? "Cancelar" : "Editar"}
          </button>
        </div>

        {editando ? (
          <EditorCampos
            tipo={tipo}
            datos={borrador}
            sinUsar={sinUsar}
            onCambiar={(c, v) => setBorrador((d) => ({ ...d, [c]: v }))}
            onQuitar={(c) =>
              setBorrador((d) => {
                const { [c]: _, ...resto } = d;
                return resto;
              })
            }
            onAnadir={(c) =>
              setBorrador((d) => (c && d[c] === undefined ? { ...d, [c]: "" } : d))
            }
            onGuardar={guardar}
            guardando={guardando}
            error={error}
          />
        ) : campos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-borde px-4 py-8 text-center text-sm text-tenue">
            Ficha vacía. Toca «Editar» para rellenarla, o inventarte campos.
          </p>
        ) : (
          <dl className="overflow-hidden rounded-lg border border-borde">
            {campos.map((c, i) => (
              <div
                key={c.clave}
                className={`flex gap-3 bg-superficie px-4 py-3 ${i ? "border-t border-borde" : ""}`}
              >
                <dt className="w-2/5 shrink-0 text-sm text-tenue">{c.etiqueta}</dt>
                <dd className="min-w-0 flex-1 text-sm break-words">{c.valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide text-tenue uppercase">Texto</h2>
          <Link
            href={`/editar/${def.carpeta}/${slug}.md`}
            className="min-h-9 px-2 text-sm text-acento"
          >
            Editar texto
          </Link>
        </div>

        {cuerpo.replace(/^#\s+.+$/m, "").replace(/^##\s+.+$/gm, "").trim().length < 30 ? (
          <p className="rounded-lg border border-dashed border-borde px-4 py-8 text-center text-sm text-tenue">
            Sin escribir todavía. La plantilla ya tiene las secciones sugeridas.
          </p>
        ) : (
          <article
            className="prosa rounded-lg border border-borde bg-superficie p-5"
            dangerouslySetInnerHTML={{ __html: cuerpoHtml }}
          />
        )}
      </section>

      <Retroenlaces entradas={menciones} rotos={[]} cargando={false} />

      <Borrar tipo={tipo} slug={slug} nombre={nombre} singular={def.singular} />
    </div>
  );
}

function EditorCampos({
  tipo,
  datos,
  sinUsar,
  onCambiar,
  onQuitar,
  onAnadir,
  onGuardar,
  guardando,
  error,
}: {
  tipo: TipoFicha;
  datos: Record<string, string>;
  sinUsar: Campo[];
  onCambiar: (c: string, v: string) => void;
  onQuitar: (c: string) => void;
  onAnadir: (c: string) => void;
  onGuardar: () => void;
  guardando: boolean;
  error: string;
}) {
  const [nuevoCampo, setNuevoCampo] = useState("");

  // `nombre` se muestra como título de la ficha, no como una fila más.
  const claves = Object.keys(datos).filter((k) => k !== "nombre");

  function anadirPropio() {
    const clave = aClave(nuevoCampo);
    if (!clave) return;
    onAnadir(clave);
    setNuevoCampo("");
  }

  return (
    <div className="rounded-lg border border-borde bg-superficie p-4">
      <div className="space-y-3">
        {claves.map((clave) => (
          <div key={clave}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <label className="text-xs text-tenue">{etiquetaDe(tipo, clave)}</label>
              <button
                onClick={() => onQuitar(clave)}
                className="px-2 text-xs text-peligro"
                aria-label={`Quitar ${etiquetaDe(tipo, clave)}`}
              >
                Quitar
              </button>
            </div>
            <input
              value={datos[clave]}
              onChange={(e) => onCambiar(clave, e.target.value)}
              className="min-h-12 w-full rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
            />
          </div>
        ))}
      </div>

      {claves.length === 0 && (
        <p className="py-4 text-center text-sm text-tenue">
          Sin campos. Añade alguno de abajo o invéntate el tuyo.
        </p>
      )}

      {sinUsar.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-tenue">Añadir campo sugerido:</p>
          <div className="flex flex-wrap gap-2">
            {sinUsar.map((c) => (
              <button
                key={c.clave}
                onClick={() => onAnadir(c.clave)}
                title={c.ayuda}
                className="min-h-10 rounded-md border border-borde px-3 text-xs text-tenue active:bg-superficie-alta"
              >
                + {c.etiqueta}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs text-tenue">O invéntate uno:</p>
        <div className="flex gap-2">
          <input
            value={nuevoCampo}
            onChange={(e) => setNuevoCampo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && anadirPropio()}
            placeholder="Grado, arma, deuda…"
            className="min-h-12 min-w-0 flex-1 rounded-lg border border-borde bg-fondo px-3 outline-none focus:border-acento"
          />
          <button
            onClick={anadirPropio}
            disabled={!nuevoCampo.trim()}
            className="min-h-12 shrink-0 rounded-lg border border-borde px-4 text-sm text-tenue disabled:opacity-40"
          >
            Añadir
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-peligro">{error}</p>}

      <button
        onClick={onGuardar}
        disabled={guardando}
        className="mt-5 min-h-12 w-full rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
      >
        {guardando ? "Guardando…" : "Guardar ficha"}
      </button>
      <p className="mt-2 text-center text-xs text-tenue">
        Los campos que dejes vacíos no se guardan.
      </p>
    </div>
  );
}

function Borrar({
  tipo,
  slug,
  nombre,
  singular,
}: {
  tipo: TipoFicha;
  slug: string;
  nombre: string;
  singular: string;
}) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState("");

  async function borrar() {
    setBorrando(true);
    setError("");
    try {
      const res = await fetch("/api/ficha", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, slug }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo borrar");
      router.push(`/${tipo}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBorrando(false);
    }
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="mt-8 w-full py-3 text-center text-xs text-tenue underline"
      >
        Borrar {singular === "lugar" ? "este lugar" : `esta ${singular}`}
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-peligro/40 bg-superficie p-4">
      <p className="text-sm">¿Borrar la ficha de {nombre}?</p>
      <p className="mt-1 text-xs text-tenue">Queda en el historial de git, pero sale del libro.</p>

      {error && <p className="mt-2 text-sm text-peligro">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setConfirmando(false)}
          className="min-h-12 flex-1 rounded-lg border border-borde text-tenue"
        >
          Cancelar
        </button>
        <button
          onClick={borrar}
          disabled={borrando}
          className="min-h-12 flex-1 rounded-lg bg-peligro font-semibold text-fondo disabled:opacity-40"
        >
          {borrando ? "Borrando…" : "Sí, borrar"}
        </button>
      </div>
    </div>
  );
}
