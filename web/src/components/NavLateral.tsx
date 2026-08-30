"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CapturaRapida from "./CapturaRapida";
import Salir from "./Salir";
import { useTema, type Tema } from "@/lib/tema";
import { ENLACES, activo } from "@/lib/nav";

const ICONOS_TEMA: Record<Tema, string> = { sistema: "◐", claro: "☀", oscuro: "☾" };
const ETIQUETAS_TEMA: Record<Tema, string> = {
  sistema: "Tema: como el sistema",
  claro: "Tema: claro",
  oscuro: "Tema: oscuro",
};

/**
 * Sidebar fija, sólo en desktop (`lg:` en adelante): en móvil la navegación
 * vive en la barra inferior (NavInferior). Reúne lo que en móvil está
 * repartido entre la barra, el botón flotante de tema y el pie de la
 * Biblioteca, porque en una pantalla ancha todo eso cabe siempre visible.
 */
export default function NavLateral() {
  const ruta = usePathname();
  const [capturando, setCapturando] = useState(false);
  const { tema, cambiar } = useTema();

  if (ruta === "/login") return null;

  return (
    <>
      <nav className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-borde bg-superficie/95 backdrop-blur lg:flex">
        <Link href="/" className="px-5 pt-6 pb-4 font-serif text-xl">
          Escritorio
        </Link>

        <div className="flex flex-1 flex-col gap-1 px-3">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={activo(ruta, e.href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                activo(ruta, e.href)
                  ? "bg-acento/10 text-acento"
                  : "text-tenue hover:bg-superficie-alta"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {e.icono}
              </span>
              {e.etiqueta}
            </Link>
          ))}
        </div>

        <div className="border-t border-borde px-3 py-3">
          {/* "Nota" es una acción, no un destino: separada de los enlaces
              de arriba en vez de mezclada con ellos. */}
          <button
            type="button"
            onClick={() => setCapturando(true)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-tenue hover:bg-superficie-alta"
          >
            <span className="text-lg leading-none text-acento" aria-hidden="true">
              ✦
            </span>
            Nota rápida
          </button>

          <button
            type="button"
            onClick={cambiar}
            aria-label={ETIQUETAS_TEMA[tema]}
            title={ETIQUETAS_TEMA[tema]}
            className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-tenue hover:bg-superficie-alta"
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {ICONOS_TEMA[tema]}
            </span>
            {ETIQUETAS_TEMA[tema]}
          </button>

          <div className="px-3">
            <Salir />
          </div>
        </div>
      </nav>

      {capturando && <CapturaRapida alCerrar={() => setCapturando(false)} />}
    </>
  );
}
