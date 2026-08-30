"use client";

import { useEffect, useState } from "react";

export type Tema = "sistema" | "claro" | "oscuro";

const CLAVE = "tema";
const SIGUIENTE: Record<Tema, Tema> = { sistema: "claro", claro: "oscuro", oscuro: "sistema" };

function aplicar(tema: Tema) {
  const raiz = document.documentElement;
  if (tema === "sistema") raiz.removeAttribute("data-theme");
  else raiz.setAttribute("data-theme", tema === "claro" ? "light" : "dark");
}

/**
 * Ciclo sistema → claro → oscuro, compartido entre el botón flotante (móvil)
 * y el control de la sidebar (desktop): ambos son la misma preferencia de
 * toda la app, sólo cambia dónde vive el botón.
 */
export function useTema() {
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

  return { tema, cambiar };
}
