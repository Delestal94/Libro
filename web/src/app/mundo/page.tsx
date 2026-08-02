import Link from "next/link";
import SinConfigurar from "@/components/SinConfigurar";
import { repoConfigurado } from "@/lib/github";
import { cargarProyecto, conteoFichas } from "@/lib/proyecto";
import { LISTA_TIPOS } from "@/lib/fichas";

export const dynamic = "force-dynamic";

export default async function Mundo() {
  if (!repoConfigurado()) return <SinConfigurar />;

  let conteo;
  try {
    conteo = conteoFichas(await cargarProyecto());
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  return (
    <div className="py-6">
      <h1 className="mb-1 font-serif text-2xl">Mundo</h1>
      <p className="mb-6 text-sm text-tenue">
        Todo lo que existe dentro del libro y no es capítulo.
      </p>

      <ul className="mb-8 space-y-2">
        {LISTA_TIPOS.map((t) => (
          <li key={t.id}>
            <Link
              href={`/${t.id}`}
              className="flex min-h-20 items-center gap-4 rounded-lg border border-borde bg-superficie px-4 py-3 active:bg-superficie-alta"
            >
              <span className="w-8 shrink-0 text-center text-2xl text-acento">{t.icono}</span>
              <span className="min-w-0 flex-1">
                <span className="block">{t.plural}</span>
                <span className="mt-0.5 block text-xs text-tenue">{t.descripcion}</span>
              </span>
              <span className="shrink-0 font-serif text-xl text-tenue tabular-nums">
                {conteo[t.id]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mb-2 text-xs font-semibold tracking-wide text-tenue uppercase">
        Reglas del mundo
      </h2>
      <ul className="space-y-2">
        {[
          { ruta: "biblia/mundo.md", titulo: "Mundo y reglas", detalle: "Cómo funciona todo" },
          { ruta: "biblia/idioma.md", titulo: "El veresh", detalle: "La lengua" },
          { ruta: "biblia/premisa.md", titulo: "Premisa", detalle: "De qué va el libro" },
        ].map((d) => (
          <li key={d.ruta}>
            <Link
              href={`/editar/${d.ruta}`}
              className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-borde bg-superficie px-4 py-3 active:bg-superficie-alta"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm">{d.titulo}</span>
                <span className="block truncate text-[11px] text-tenue">{d.detalle}</span>
              </span>
              <span className="shrink-0 text-tenue">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
