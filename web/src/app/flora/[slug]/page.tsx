import { PaginaDetalle } from "@/components/PaginaFichas";

export const dynamic = "force-dynamic";

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PaginaDetalle tipo="flora" slug={slug} />;
}
