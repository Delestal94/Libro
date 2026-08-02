import SinConfigurar from "@/components/SinConfigurar";
import ListaPersonajes from "@/components/ListaPersonajes";
import { repoConfigurado } from "@/lib/github";
import { cargarProyecto, personajes } from "@/lib/proyecto";
import { CAMPOS, camposRellenos } from "@/lib/personajes";

export const dynamic = "force-dynamic";

export default async function Pagina() {
  if (!repoConfigurado()) return <SinConfigurar />;

  try {
    const lista = personajes(await cargarProyecto());
    const destacados = new Set(CAMPOS.filter((c) => c.destacado).map((c) => c.clave));

    return (
      <ListaPersonajes
        personajes={lista.map((p) => ({
          slug: p.slug,
          nombre: p.nombre,
          // Sólo lo que cabe en una tarjeta; la ficha entera está a un toque.
          resumen: camposRellenos(p)
            .filter((c) => destacados.has(c.clave))
            .slice(0, 3)
            .map((c) => c.valor),
          campos: camposRellenos(p).length,
        }))}
      />
    );
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }
}
