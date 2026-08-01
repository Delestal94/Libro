"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Borrado en dos pasos. En un móvil un botón destructivo a un toque se pulsa
 * sin querer; el commit queda en el historial, pero recuperarlo desde el móvil
 * no es trivial, así que mejor preguntar.
 */
export default function BorrarDocumento({ ruta, sha }: { ruta: string; sha: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState("");

  async function borrar() {
    setBorrando(true);
    setError("");
    try {
      const res = await fetch("/api/archivo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruta, sha }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo borrar");
      router.push("/");
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
        Borrar este documento
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-peligro/40 bg-superficie p-4">
      <p className="text-sm">
        ¿Borrar <span className="font-mono text-xs text-peligro">{ruta}</span>?
      </p>
      <p className="mt-1 text-xs text-tenue">
        Queda en el historial de git, pero desaparece del libro.
      </p>

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
