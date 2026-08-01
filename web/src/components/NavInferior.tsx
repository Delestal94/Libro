"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CapturaRapida from "./CapturaRapida";

const ENLACES = [
  { href: "/", etiqueta: "Biblioteca", icono: "◆" },
  { href: "/leer", etiqueta: "Leer", icono: "▤" },
  { href: "/buscar", etiqueta: "Buscar", icono: "⌕" },
];

export default function NavInferior() {
  const ruta = usePathname();
  const [capturando, setCapturando] = useState(false);

  // El login se ve a pantalla completa, sin navegación.
  if (ruta === "/login") return null;

  const activo = (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href));

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-superficie/95 backdrop-blur pb-segura">
        <div className="mx-auto flex max-w-2xl items-stretch">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              /* min-h-14: objetivo táctil cómodo con el pulgar. */
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition-colors ${
                activo(e.href) ? "text-acento" : "text-tenue"
              }`}
            >
              <span className="text-lg leading-none">{e.icono}</span>
              {e.etiqueta}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setCapturando(true)}
            className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-tenue"
          >
            <span className="text-lg leading-none text-acento">✦</span>
            Nota
          </button>
        </div>
      </nav>

      {capturando && <CapturaRapida alCerrar={() => setCapturando(false)} />}
    </>
  );
}
