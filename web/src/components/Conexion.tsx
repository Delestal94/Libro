"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cola, desencolar } from "@/lib/almacen";

/**
 * Registra el service worker, avisa cuando no hay red y vacía la cola de
 * guardados pendientes en cuanto vuelve la señal.
 */
export default function Conexion() {
  const router = useRouter();
  const [conectado, setConectado] = useState(true);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* sin service worker la app funciona igual, solo que sin modo offline */
      });
    }
  }, []);

  useEffect(() => {
    setConectado(navigator.onLine);
    setPendientes(cola().length);

    async function vaciarCola() {
      const items = cola();
      if (!items.length) return;

      let enviados = 0;
      for (const p of items) {
        try {
          const res = await fetch("/api/archivo", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ruta: p.ruta, contenido: p.contenido, sha: p.sha }),
          });
          // Un 409 significa que el fichero cambió por otro lado: se saca de la
          // cola igualmente, porque reintentarlo sólo repetiría el conflicto.
          // El borrador local sigue guardado, así que el texto no se pierde.
          if (res.ok || res.status === 409) {
            desencolar(p.ruta);
            enviados++;
          }
        } catch {
          break; // sigue sin haber red: se deja para el próximo intento
        }
      }

      setPendientes(cola().length);
      if (enviados) router.refresh();
    }

    const alConectar = () => {
      setConectado(true);
      void vaciarCola();
    };
    const alDesconectar = () => setConectado(false);

    window.addEventListener("online", alConectar);
    window.addEventListener("offline", alDesconectar);
    if (navigator.onLine) void vaciarCola();

    return () => {
      window.removeEventListener("online", alConectar);
      window.removeEventListener("offline", alDesconectar);
    };
  }, [router]);

  if (conectado && !pendientes) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-acento px-4 py-1.5 text-center text-xs font-medium text-fondo pt-segura">
      {!conectado
        ? pendientes
          ? `Sin conexión · ${pendientes} por enviar`
          : "Sin conexión · lo que escribas se guarda en el móvil"
        : `Enviando ${pendientes}…`}
    </div>
  );
}
