import Link from "next/link";
import SinConfigurar from "@/components/SinConfigurar";
import { repoConfigurado } from "@/lib/github";
import { cargarProyecto } from "@/lib/proyecto";
import { listarPaneles, fechaLegible } from "@/lib/revisiones";

export const dynamic = "force-dynamic";

export default async function Revisiones() {
  if (!repoConfigurado()) return <SinConfigurar />;

  let paneles;
  try {
    paneles = listarPaneles(await cargarProyecto());
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  return (
    <div className="py-6">
      <Link href="/" className="text-sm text-tenue">
        ‹ Biblioteca
      </Link>
      <h1 className="mt-1 mb-1 font-serif text-2xl">Revisiones</h1>
      <p className="mb-6 text-sm text-tenue">
        Lo que dice el panel de lectores, críticos y escritores en cada pasada. La memoria de
        qué falla y si se arregló.
      </p>

      {paneles.length === 0 ? (
        <p className="text-sm text-tenue">Todavía no se ha lanzado ningún panel.</p>
      ) : (
        <ul className="space-y-3">
          {paneles.map((p) => (
            <li key={p.carpeta}>
              <Link
                href={`/revisiones/${p.carpeta}`}
                className="block rounded-lg border border-borde bg-superficie px-4 py-3 active:bg-superficie-alta"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-lg">{p.titulo}</span>
                  <span className="shrink-0 text-xs text-tenue">{fechaLegible(p.fecha)}</span>
                </div>
                {p.extracto ? (
                  <p className="mt-1.5 line-clamp-2 text-sm text-tenue">{p.extracto}</p>
                ) : (
                  <p className="mt-1.5 text-sm text-tenue">
                    {p.informes.length} {p.informes.length === 1 ? "informe" : "informes"}, sin
                    resumen agregado todavía.
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
