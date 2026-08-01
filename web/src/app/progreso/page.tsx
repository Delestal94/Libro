import Link from "next/link";
import SinConfigurar from "@/components/SinConfigurar";
import DescargarEpub from "@/components/DescargarEpub";
import { commitsDelLibro, repoConfigurado } from "@/lib/github";
import { calcularRacha } from "@/lib/rachas";
import { cargarProyecto, capitulos } from "@/lib/proyecto";

export const dynamic = "force-dynamic";

export default async function Progreso() {
  if (!repoConfigurado()) return <SinConfigurar />;

  let racha, caps, commits;
  try {
    const [lista, docs] = await Promise.all([commitsDelLibro(), cargarProyecto()]);
    commits = lista;
    racha = calcularRacha(lista.map((c) => c.fecha));
    caps = capitulos(docs);
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  const total = caps.reduce((t, c) => t + c.palabras, 0);
  const maxCommits = Math.max(1, ...racha.ultimos.map((u) => u.commits));

  return (
    <div className="py-6">
      <Link href="/" className="text-sm text-tenue">
        ‹ Biblioteca
      </Link>
      <h1 className="mt-1 mb-6 font-serif text-2xl">Progreso</h1>

      <section className="mb-8 grid grid-cols-3 gap-2">
        <Dato valor={String(racha.actual)} etiqueta={racha.actual === 1 ? "día seguido" : "días seguidos"} />
        <Dato valor={String(racha.mejor)} etiqueta="mejor racha" />
        <Dato valor={String(racha.diasActivos)} etiqueta="días escritos" />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-tenue uppercase">
          Últimas dos semanas
        </h2>
        <div className="flex items-end gap-1.5">
          {racha.ultimos.map((u) => (
            <div key={u.dia} className="flex flex-1 flex-col items-center gap-1">
              <div
                title={`${u.dia}: ${u.commits} ${u.commits === 1 ? "guardado" : "guardados"}`}
                className={`w-full rounded-sm ${u.commits ? "bg-acento" : "bg-superficie-alta"}`}
                style={{ height: u.commits ? `${12 + (u.commits / maxCommits) * 36}px` : "12px" }}
              />
              <span className="text-[9px] text-tenue">{u.dia.slice(-2)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-tenue">
          Cada barra es un día. Solo cuentan los cambios en el libro, no los de la app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-tenue uppercase">El libro</h2>
        <div className="rounded-lg border border-borde bg-superficie p-4 text-sm">
          <p>
            <span className="font-serif text-2xl tabular-nums">
              {total.toLocaleString("es-ES")}
            </span>{" "}
            palabras en {caps.length} {caps.length === 1 ? "capítulo" : "capítulos"}.
          </p>
        </div>
        <DescargarEpub hayCapitulos={caps.length > 0} />
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-tenue uppercase">
          Lo último
        </h2>
        {commits.length === 0 ? (
          <p className="text-sm text-tenue">Todavía no hay historial.</p>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-borde">
            {commits.slice(0, 12).map((c, i) => (
              <li
                key={c.sha}
                className={`bg-superficie px-4 py-3 text-sm ${i ? "border-t border-borde" : ""}`}
              >
                <span className="block truncate">{c.mensaje}</span>
                <span className="mt-0.5 block text-xs text-tenue">
                  {new Date(c.fecha).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
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
