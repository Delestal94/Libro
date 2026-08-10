import Link from "next/link";
import { marked } from "marked";
import SinConfigurar from "@/components/SinConfigurar";
import { repoConfigurado } from "@/lib/github";
import { cargarProyecto } from "@/lib/proyecto";
import { construirIndice, enlacesAHtml } from "@/lib/enlaces";
import { panel as buscarPanel, fechaLegible } from "@/lib/revisiones";

export const dynamic = "force-dynamic";

export default async function PanelDetalle({
  params,
}: {
  params: Promise<{ carpeta: string }>;
}) {
  const { carpeta } = await params;
  if (!repoConfigurado()) return <SinConfigurar />;

  let docs;
  try {
    docs = await cargarProyecto();
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  const p = buscarPanel(docs, carpeta);

  if (!p) {
    return (
      <div className="py-10">
        <h1 className="mb-2 font-serif text-2xl">No encontrado</h1>
        <p className="mb-6 text-sm text-tenue">Ese panel no existe.</p>
        <Link href="/revisiones" className="text-acento underline">
          Volver a revisiones
        </Link>
      </div>
    );
  }

  const indice = construirIndice(docs);
  const html = p.resumen
    ? (marked.parse(enlacesAHtml(p.resumen.contenido.replace(/^#.*$/m, ""), indice), {
        async: false,
        breaks: false,
      }) as string)
    : "";

  return (
    <div className="py-6">
      <Link href="/revisiones" className="text-sm text-tenue">
        ‹ Revisiones
      </Link>
      <h1 className="mt-1 font-serif text-2xl">{p.titulo}</h1>
      {p.fecha && <p className="mt-1 mb-6 text-sm text-tenue">{fechaLegible(p.fecha)}</p>}

      {p.resumen ? (
        <article className="prosa mb-8" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="mb-8 text-sm text-tenue">
          Este panel no tiene `resumen.md` — quedó a medio lanzar. Los informes sueltos están
          abajo.
        </p>
      )}

      {p.informes.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold tracking-wide text-tenue uppercase">
            {p.resumen ? "Informes individuales" : "Informes"}
          </h2>
          <ul className="overflow-hidden rounded-lg border border-borde">
            {p.informes.map((i, idx) => (
              <li key={i.ruta} className={idx ? "border-t border-borde" : ""}>
                <Link
                  href={`/editar/${i.ruta}`}
                  className="flex min-h-14 items-center justify-between gap-3 bg-superficie px-4 py-3 active:bg-superficie-alta"
                >
                  <span className="min-w-0 truncate text-sm capitalize">{i.titulo}</span>
                  <span className="shrink-0 text-xs text-tenue tabular-nums">
                    {i.palabras.toLocaleString("es-ES")} pal.
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
