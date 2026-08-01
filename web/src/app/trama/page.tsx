import Trama from "@/components/Trama";
import SinConfigurar from "@/components/SinConfigurar";
import { leerArchivo, repoConfigurado } from "@/lib/github";
import { extraerTabla } from "@/lib/tablas";

export const dynamic = "force-dynamic";

const PISTAS = "biblia/pistas.md";
const CRONOLOGIA = "biblia/cronologia.md";

const VACIA_PISTAS = { cabeceras: ["Pista", "Sembrada en", "Recogida en", "Estado"], filas: [] };
const VACIA_CRONO = { cabeceras: ["Cuándo", "Qué ocurre", "Capítulo", "Lector"], filas: [] };

export default async function Pagina() {
  if (!repoConfigurado()) return <SinConfigurar />;

  try {
    const [pistas, crono] = await Promise.all([leerArchivo(PISTAS), leerArchivo(CRONOLOGIA)]);
    return (
      <Trama
        pistas={(pistas && extraerTabla(pistas.contenido)) || VACIA_PISTAS}
        cronologia={(crono && extraerTabla(crono.contenido)) || VACIA_CRONO}
      />
    );
  } catch (e) {
    return <SinConfigurar detalle={(e as Error).message} />;
  }
}
