import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery-browser";
import { PublicShell } from "@/components/public-shell";
import { getGalleryItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Desenhos do Horizoncraft",
  description: "Veja os desenhos publicados da história de Horizoncraft.",
};
export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <PublicShell>
      <main className="inner-page">
        <header className="page-hero">
          <p className="section-kicker">Galeria da história</p>
          <h1>Desenhos do Horizoncraft</h1>
          <p>
            Aqui ficarão os personagens, cenas, símbolos e lugares desenhados
            para a história.
          </p>
        </header>
        <section className="page-width content-section">
          <GalleryBrowser items={items} />
        </section>
      </main>
    </PublicShell>
  );
}
