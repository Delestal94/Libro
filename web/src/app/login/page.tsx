"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function Formulario() {
  const router = useRouter();
  const destino = useSearchParams().get("destino") || "/";
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contrasena }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo entrar");
      router.replace(destino);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="w-full max-w-sm">
      <h1 className="mb-1 text-center font-serif text-3xl">Escritorio</h1>
      <p className="mb-8 text-center text-sm text-tenue">Para escribir y leer el libro</p>

      <input
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        placeholder="Contraseña"
        autoComplete="current-password"
        autoFocus
        className="min-h-12 w-full rounded-lg border border-borde bg-superficie px-4 text-center outline-none focus:border-acento"
      />

      {error && <p className="mt-3 text-center text-sm text-peligro">{error}</p>}

      <button
        type="submit"
        disabled={!contrasena || enviando}
        className="mt-4 min-h-12 w-full rounded-lg bg-acento font-semibold text-fondo disabled:opacity-40"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <Suspense>
        <Formulario />
      </Suspense>
    </div>
  );
}
