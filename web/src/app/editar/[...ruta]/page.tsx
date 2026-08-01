import Link from "next/link";
import Editor from "@/components/Editor";
import SinConfigurar from "@/components/SinConfigurar";
import { leerArchivo, repoConfigurado } from "@/lib/github";
import { tituloDe } from "@/lib/libro";

export const dynamic = "force-dynamic";

export default async function Editar({ params }: { params: Promise<{ ruta: string[] }> }) {
  if (!repoConfigurado()) return <SinConfigurar />;

  const { ruta: partes } = await params;
  const ruta = partes.map(decodeURIComponent).join("/");

  let doc;
  try {
    doc = await leerArchivo(ruta);
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }

  if (!doc) {
    return (
      <div className="py-10">
        <h1 className="mb-2 font-serif text-2xl">No encontrado</h1>
        <p className="mb-6 text-sm text-tenue">
          No existe <code className="text-acento">{ruta}</code> en el repositorio.
        </p>
        <Link href="/" className="text-acento underline">
          Volver a la biblioteca
        </Link>
      </div>
    );
  }

  return (
    <Editor
      ruta={ruta}
      shaInicial={doc.sha}
      contenidoInicial={doc.contenido}
      titulo={tituloDe(ruta, doc.contenido)}
    />
  );
}
