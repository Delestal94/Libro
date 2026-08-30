"use client";

import { usePathname } from "next/navigation";

/**
 * El resto de pantallas (Biblioteca, Editor, fichas...) son listas o prosa de
 * ancho de libro, así que se benefician de una columna centrada y angosta.
 * El Lector es distinto: tiene su propio índice fijo a la izquierda y un
 * texto que necesita su propio ancho de lectura, así que en vez de heredar el
 * límite genérico usa todo el hueco libre junto a la sidebar y se organiza él
 * solo (ver Lector.tsx).
 */
const ANCHO_COMPLETO = ["/leer"];

export default function ContenedorPrincipal({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();

  if (ANCHO_COMPLETO.includes(ruta)) {
    return <div className="w-full px-4 lg:px-8">{children}</div>;
  }

  return <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-3xl lg:px-8">{children}</div>;
}
