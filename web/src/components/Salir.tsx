"use client";

import { useRouter } from "next/navigation";

export default function Salir() {
  const router = useRouter();

  async function salir() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button onClick={salir} className="mt-8 w-full py-3 text-center text-xs text-tenue underline">
      Cerrar sesión
    </button>
  );
}
