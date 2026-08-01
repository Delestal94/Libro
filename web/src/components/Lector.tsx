"use client";

import { useEffect, useRef, useState } from "react";

type Seccion = { ruta: string; titulo: string; palabras: number; html: string };

const TAMANOS = [16, 18, 20, 23];
const CLAVE_TAMANO = "lector:tamano";
const CLAVE_POSICION = "lector:posicion";

export default function Lector({
  secciones,
  total,
  minutos,
}: {
  secciones: Seccion[];
  total: number;
  minutos: number;
}) {
  const [tamano, setTamano] = useState(18);
  const [indice, setIndice] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);

  // Preferencia de tamaño y posición de lectura, recordadas entre visitas.
  useEffect(() => {
    const t = Number(localStorage.getItem(CLAVE_TAMANO));
    if (TAMANOS.includes(t)) setTamano(t);

    const y = Number(localStorage.getItem(CLAVE_POSICION));
    if (y > 0) requestAnimationFrame(() => window.scrollTo(0, y));
  }, []);

  useEffect(() => {
    localStorage.setItem(CLAVE_TAMANO, String(tamano));
  }, [tamano]);

  useEffect(() => {
    let pendiente = false;
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const alto = document.documentElement.scrollHeight - window.innerHeight;
        setProgreso(alto > 0 ? Math.min(1, window.scrollY / alto) : 0);
        localStorage.setItem(CLAVE_POSICION, String(Math.round(window.scrollY)));
        pendiente = false;
      });
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  function irA(ruta: string) {
    setIndice(false);
    document.getElementById(ruta)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="py-4">
      {/* Barra de progreso de lectura, fina y fija arriba. */}
      <div
        className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-acento transition-transform duration-150"
        style={{ transform: `scaleX(${progreso})` }}
      />

      <header className="mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndice((v) => !v)}
            className="min-h-11 rounded-md border border-borde bg-superficie px-3 text-sm text-tenue"
          >
            ☰ Índice
          </button>

          <div className="ml-auto flex overflow-hidden rounded-md border border-borde">
            {TAMANOS.map((t) => (
              <button
                key={t}
                onClick={() => setTamano(t)}
                className={`min-h-11 px-3 ${tamano === t ? "bg-acento/15 text-acento" : "text-tenue"}`}
                style={{ fontSize: Math.max(11, t - 6) }}
                aria-label={`Tamaño ${t} píxeles`}
              >
                A
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-tenue">
          {secciones.length} {secciones.length === 1 ? "capítulo" : "capítulos"} ·{" "}
          {total.toLocaleString("es-ES")} palabras · {minutos} min de lectura
        </p>
      </header>

      {indice && (
        <nav className="mb-6 overflow-hidden rounded-lg border border-borde">
          {secciones.map((s, i) => (
            <button
              key={s.ruta}
              onClick={() => irA(s.ruta)}
              className={`flex min-h-14 w-full items-center justify-between gap-3 bg-superficie px-4 text-left active:bg-superficie-alta ${
                i ? "border-t border-borde" : ""
              }`}
            >
              <span className="truncate">{s.titulo}</span>
              <span className="shrink-0 text-xs text-tenue tabular-nums">
                {s.palabras.toLocaleString("es-ES")}
              </span>
            </button>
          ))}
        </nav>
      )}

      <div ref={contenedor} style={{ fontSize: tamano }}>
        {secciones.map((s, i) => (
          <section key={s.ruta} id={s.ruta} className="mb-16 scroll-mt-6">
            {i > 0 && <hr className="mx-auto mb-12 w-1/3 border-borde" />}
            <h2 className="mb-8 text-center font-serif text-2xl">{s.titulo}</h2>
            <article className="prosa" dangerouslySetInnerHTML={{ __html: s.html }} />
          </section>
        ))}

        <p className="pb-8 text-center text-sm text-tenue">— Fin de lo escrito —</p>
      </div>
    </div>
  );
}
