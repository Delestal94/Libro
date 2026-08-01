import Link from "next/link";
import { marked } from "marked";
import Lector from "@/components/Lector";
import SinConfigurar from "@/components/SinConfigurar";
import { repoConfigurado } from "@/lib/github";
import { cargarProyecto, capitulos } from "@/lib/proyecto";
import { minutosLectura } from "@/lib/libro";

export const dynamic = "force-dynamic";

export default async function Leer() {
  if (!repoConfigurado()) return <SinConfigurar />;

  let caps;
  try {
    caps = capitulos(await cargarProyecto());
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  if (!caps.length) {
    return (
      <div className="py-10 text-center">
        <p className="mb-2 font-serif text-2xl">Aún no hay capítulos</p>
        <p className="mb-6 text-sm text-tenue">
          Los ficheros <code className="text-acento">00-*</code> del manuscrito son material de
          trabajo y no se muestran aquí.
        </p>
        <Link href="/" className="text-acento underline">
          Ir a la biblioteca
        </Link>
      </div>
    );
  }

  const secciones = caps.map((c) => ({
    ruta: c.ruta,
    titulo: c.titulo,
    palabras: c.palabras,
    // El encabezado lo pinta el lector, así que se quita del cuerpo para no duplicarlo.
    html: marked.parse(c.contenido.replace(/^#\s+.+$/m, ""), {
      async: false,
      breaks: false,
    }) as string,
  }));

  const total = caps.reduce((t, c) => t + c.palabras, 0);

  return <Lector secciones={secciones} total={total} minutos={minutosLectura(total)} />;
}
