import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PublicShell } from "@/components/public-shell";
import { getStories } from "@/lib/data";
import "../public-pages.css";

export const metadata: Metadata = {
  title: "Capítulos",
  description:
    "Leia os capítulos publicados da história de Horizoncraft em sequência.",
};

export default async function ChaptersPage() {
  const stories = await getStories();
  const mainStory = stories.find((story) => story.featured) ?? stories[0];
  const chapters = [...(mainStory?.chapters ?? [])].sort(
    (first, second) => first.chapterNumber - second.chapterNumber,
  );

  return (
    <PublicShell>
      <main className="inner-page">
        <header className="page-hero">
          <p className="section-kicker">Capítulo por capítulo</p>
          <h1>A história de Horizoncraft</h1>
          <p>
            Acompanhe a aventura em sequência. Novos capítulos serão
            acrescentados aqui conforme a história crescer.
          </p>
        </header>

        <section className="page-width story-chapters content-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">
                <BookOpen size={15} /> Capítulos publicados
              </p>
              <h2>Comece pelo início</h2>
            </div>
          </div>
          {chapters.length ? (
            <ol className="chapter-list">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <Link href={`/capitulos/${chapter.slug}`}>
                    <span>
                      {String(chapter.chapterNumber).padStart(2, "0")}
                    </span>
                    <div>
                      <small>Capítulo {chapter.chapterNumber}</small>
                      <h3>{chapter.title}</h3>
                    </div>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              title="O primeiro capítulo ainda está esperando para ser escrito."
              description="Quando estiver pronto e publicado, ele aparecerá aqui para começar a história."
            />
          )}
        </section>
      </main>
    </PublicShell>
  );
}
