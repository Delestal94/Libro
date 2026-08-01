import Link from "next/link";
import SinConfigurar from "@/components/SinConfigurar";
import NuevoDocumento from "@/components/NuevoDocumento";
import Salir from "@/components/Salir";
import { repoConfigurado } from "@/lib/github";
import { cargarProyecto, capitulos, type Doc } from "@/lib/proyecto";
import { SECCIONES, minutosLectura } from "@/lib/libro";

export const dynamic = "force-dynamic";

export default async function Biblioteca() {
  if (!repoConfigurado()) return <SinConfigurar />;

  let docs: Doc[];
  try {
    docs = await cargarProyecto();
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  const caps = capitulos(docs);
  const palabrasManuscrito = caps.reduce((t, d) => t + d.palabras, 0);

  return (
    <div className="py-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Escritorio</h1>
        <p className="mt-1 text-sm text-tenue">{process.env.GITHUB_REPO}</p>
      </header>

      <Link href="/progreso" className="mb-8 grid grid-cols-3 gap-2">
        <Dato valor={palabrasManuscrito.toLocaleString("es-ES")} etiqueta="palabras" />
        <Dato valor={String(caps.length)} etiqueta={caps.length === 1 ? "capítulo" : "capítulos"} />
        <Dato
          valor={palabrasManuscrito ? `${minutosLectura(palabrasManuscrito)}′` : "—"}
          etiqueta="de lectura"
        />
      </Link>

      {SECCIONES.map((s) => {
        const dentro = docs
          .filter((d) => d.seccion === s.id)
          .sort((a, b) => a.ruta.localeCompare(b.ruta, "es"));
        if (!dentro.length) return null;

        return (
          <section key={s.id} className="mb-8">
            <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
              <span className="text-acento">{s.icono}</span>
              {s.titulo}
            </h2>
            <p className="mb-3 text-xs text-tenue">{s.descripcion}</p>

            <ul className="overflow-hidden rounded-lg border border-borde">
              {dentro.map((d, i) => (
                <li key={d.ruta} className={i ? "border-t border-borde" : ""}>
                  <Link
                    href={`/editar/${d.ruta}`}
                    className="flex min-h-14 items-center justify-between gap-3 bg-superficie px-4 py-3 active:bg-superficie-alta"
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{d.titulo}</span>
                      <span className="block truncate font-mono text-[11px] text-tenue">
                        {d.ruta}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-tenue tabular-nums">
                      {d.palabras.toLocaleString("es-ES")} pal.
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <NuevoDocumento />
      <Salir />
    </div>
  );
}

function Dato({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="rounded-lg border border-borde bg-superficie px-3 py-4 text-center">
      <div className="font-serif text-2xl tabular-nums">{valor}</div>
      <div className="mt-0.5 text-[11px] text-tenue">{etiqueta}</div>
    </div>
  );
}
