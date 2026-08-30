"use client";

import { useTema, type Tema } from "@/lib/tema";

const ICONOS: Record<Tema, string> = { sistema: "◐", claro: "☀", oscuro: "☾" };
const ETIQUETAS: Record<Tema, string> = {
  sistema: "Tema: como el sistema",
  claro: "Tema: claro",
  oscuro: "Tema: oscuro",
};

/*
 * Botón flotante, sólo en móvil: en desktop el mismo control vive en la
 * sidebar (NavLateral). Por defecto sigue al sistema; un toque fuerza claro
 * u oscuro y lo recuerda en este dispositivo.
 */
export default function ModoTema() {
  const { tema, cambiar } = useTema();

  return (
    <button
      type="button"
      onClick={cambiar}
      aria-label={ETIQUETAS[tema]}
      title={ETIQUETAS[tema]}
      className="fixed right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-borde bg-superficie/95 text-lg text-tenue backdrop-blur lg:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)" }}
    >
      {ICONOS[tema]}
    </button>
  );
}
