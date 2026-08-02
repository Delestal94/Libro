import Link from "next/link";
import { marked } from "marked";
import FichaPersonaje from "@/components/FichaPersonaje";
import SinConfigurar from "@/components/SinConfigurar";
import { leerArchivo, repoConfigurado } from "@/lib/github";
import { CARPETA, camposRellenos, leerPersonaje } from "@/lib/personajes";
import { cargarProyecto, personajes } from "@/lib/proyecto";
import { construirIndice, enlacesAHtml, retroenlaces } from "@/lib/enlaces";

export const dynamic = "force-dynamic";

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  if (!repoConfigurado()) return <SinConfigurar />;

  const { slug } = await params;
  const ruta = `${CARPETA}/${slug}.md`;

  let doc, docs;
  try {
    [doc, docs] = await Promise.all([leerArchivo(ruta), cargarProyecto()]);
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  if (!doc) {
    return (
      <div className="py-10">
        <h1 className="mb-2 font-serif text-2xl">No encontrado</h1>
        <p className="mb-6 text-sm text-tenue">Ese personaje no existe.</p>
        <Link href="/personajes" className="text-acento underline">
          Volver a personajes
        </Link>
      </div>
    );
  }

  const p = leerPersonaje(ruta, doc.contenido);
  const indice = construirIndice(docs);

  return (
    <FichaPersonaje
      slug={slug}
      nombre={p.nombre}
      ficha={p.ficha}
      campos={camposRellenos(p)}
      cuerpo={p.cuerpo}
      cuerpoHtml={
        marked.parse(enlacesAHtml(p.cuerpo.replace(/^#\s+.+$/m, ""), indice), {
          async: false,
          breaks: false,
        }) as string
      }
      menciones={retroenlaces(ruta, docs, indice)}
      otros={personajes(docs)
        .filter((x) => x.slug !== slug)
        .map((x) => x.nombre)}
    />
  );
}
