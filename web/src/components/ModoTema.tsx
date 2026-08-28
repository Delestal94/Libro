"use client";

import { useEffect, useState } from "react";

type Tema = "sistema" | "claro" | "oscuro";

const CLAVE = "tema";
const SIGUIENTE: Record<Tema, Tema> = { sistema: "claro", claro: "oscuro", oscuro: "sistema" };
const ICONOS: Record<Tema, string> = { sistema: "◐", claro: "☀", oscuro: "☾" };
const ETIQUETAS: Record<Tema, string> = {
  sistema: "Tema: como el sistema",
  claro: "Tema: claro",
  oscuro: "Tema: oscuro",
};

function aplicar(tema: Tema) {
  const raiz = document.documentElement;
  if (tema === "sistema") raiz.removeAttribute("data-theme");
  else raiz.setAttribute("data-theme", tema === "claro" ? "light" : "dark");
}

/*
 * Botón flotante, siempre visible: el tema es una preferencia de toda la
 * app, no de una pantalla concreta, así que vive en el layout en vez de
 * colgar de la cabecera de cada página. Por defecto sigue al sistema; un
 * toque fuerza claro u oscuro y lo recuerda en este dispositivo.
 */
export default function ModoTema() {
  const [tema, setTema] = useState<Tema>("sistema");

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE);
    setTema(guardado === "light" ? "claro" : guardado === "dark" ? "oscuro" : "sistema");
  }, []);

  function cambiar() {
    const siguiente = SIGUIENTE[tema];
    setTema(siguiente);
    aplicar(siguiente);
    if (siguiente === "sistema") localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, siguiente === "claro" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={cambiar}
      aria-label={ETIQUETAS[tema]}
      title={ETIQUETAS[tema]}
      className="fixed right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-borde bg-superficie/95 text-lg text-tenue backdrop-blur"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)" }}
    >
      {ICONOS[tema]}
    </button>
  );
}
