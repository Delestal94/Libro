"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CapturaRapida from "./CapturaRapida";
import { ENLACES, activo } from "@/lib/nav";

export default function NavInferior() {
  const ruta = usePathname();
  const [capturando, setCapturando] = useState(false);

  // El login se ve a pantalla completa, sin navegación.
  if (ruta === "/login") return null;

  return (
    <>
      {/* Sólo en móvil: en desktop la navegación vive en la sidebar (NavLateral). */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-superficie/95 backdrop-blur pb-segura lg:hidden">
        <div className="mx-auto flex max-w-2xl items-stretch">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={activo(ruta, e.href) ? "page" : undefined}
              /* min-h-14: objetivo táctil cómodo con el pulgar. */
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition-colors ${
                activo(ruta, e.href) ? "text-acento" : "text-tenue"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {e.icono}
              </span>
              {e.etiqueta}
            </Link>
          ))}
          {/* "Nota" es una acción, no un destino: se eleva sobre la barra en vez
              de ser una quinta pestaña idéntica a las de navegación. */}
          <button
            type="button"
            onClick={() => setCapturando(true)}
            className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-tenue"
          >
            <span
              className="-mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-acento text-base leading-none text-fondo shadow"
              aria-hidden="true"
            >
              ✦
            </span>
            Nota
          </button>
        </div>
      </nav>

      {capturando && <CapturaRapida alCerrar={() => setCapturando(false)} />}
    </>
  );
}
