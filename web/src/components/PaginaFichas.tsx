import Link from "next/link";
import { marked } from "marked";
import ListaFichas from "./ListaFichas";
import DetalleFicha from "./DetalleFicha";
import SinConfigurar from "./SinConfigurar";
import { leerArchivo, repoConfigurado } from "@/lib/github";
import { cargarProyecto, fichasDe } from "@/lib/proyecto";
import { TIPOS, camposRellenos, leerFicha, type TipoFicha } from "@/lib/fichas";
import { construirIndice, enlacesAHtml, retroenlaces } from "@/lib/enlaces";

/**
 * Las pantallas de los tres tipos de ficha son la misma, así que se escriben
 * una vez y cada ruta sólo dice de qué tipo es.
 */

export async function PaginaLista({ tipo }: { tipo: TipoFicha }) {
  if (!repoConfigurado()) return <SinConfigurar />;

  const def = TIPOS[tipo];

  try {
    const lista = fichasDe(await cargarProyecto(), tipo);
    const destacados = new Set(def.campos.filter((c) => c.destacado).map((c) => c.clave));

    return (
      <ListaFichas
        tipo={tipo}
        titulo={def.plural}
        singular={def.singular}
        descripcion={def.descripcion}
        fichas={lista.map((f) => {
          const campos = camposRellenos(f);
          return {
            slug: f.slug,
            nombre: f.nombre,
            // Sólo lo que cabe en una tarjeta; la ficha entera está a un toque.
            resumen: campos
              .filter((c) => destacados.has(c.clave))
              .slice(0, 3)
              .map((c) => c.valor),
            campos: campos.length,
          };
        })}
      />
    );
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }
}

export async function PaginaDetalle({ tipo, slug }: { tipo: TipoFicha; slug: string }) {
  if (!repoConfigurado()) return <SinConfigurar />;

  const def = TIPOS[tipo];
  const ruta = `${def.carpeta}/${slug}.md`;

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
        <p className="mb-6 text-sm text-tenue">Ese {def.singular} no existe.</p>
        <Link href={`/${tipo}`} className="text-acento underline">
          Volver a {def.plural.toLowerCase()}
        </Link>
      </div>
    );
  }

  const ficha = leerFicha(ruta, doc.contenido)!;
  const indice = construirIndice(docs);

  return (
    <DetalleFicha
      tipo={tipo}
      slug={slug}
      nombre={ficha.nombre}
      datos={ficha.datos}
      campos={camposRellenos(ficha)}
      cuerpo={ficha.cuerpo}
      cuerpoHtml={
        marked.parse(enlacesAHtml(ficha.cuerpo.replace(/^#\s+.+$/m, ""), indice), {
          async: false,
          breaks: false,
        }) as string
      }
      menciones={retroenlaces(ruta, docs, indice)}
    />
  );
}
