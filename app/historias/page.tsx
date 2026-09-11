import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { EmptyState } from "@/components/empty-state";
import { PublicShell } from "@/components/public-shell";
import { SPECIAL_MESSAGE_STORY_ID } from "@/lib/content-identity";
import { getStories } from "@/lib/data";

export const metadata: Metadata = {
  title: "A história",
  description:
    "Leia os capítulos publicados da história de Horizoncraft em sequência.",
};

export default async function StoryPage() {
  const stories = await getStories();
  const specialMessage = stories.find(
    (story) => story.id === SPECIAL_MESSAGE_STORY_ID,
  );
  const regularStories = stories.filter(
    (story) => story.id !== SPECIAL_MESSAGE_STORY_ID,
  );
  const mainStory =
    regularStories.find((story) => story.featured) ?? regularStories[0];
  const chapters = (
    mainStory
      ? mainStory.chapters.map((chapter) => ({ story: mainStory, chapter }))
      : []
  ).sort(
    (first, second) =>
      first.chapter.chapterNumber - second.chapter.chapterNumber,
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
              {chapters.map(({ story, chapter }) => (
                <li key={chapter.id}>
                  <Link href={`/historias/${story.slug}/${chapter.slug}`}>
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

        {specialMessage && specialMessage.chapters[0] && (
          <section className="special-message-section">
            <div className="page-width special-message-card">
              <CoverArt
                title={specialMessage.title}
                accent={specialMessage.accent}
                imageUrl={specialMessage.coverUrl}
                label={specialMessage.category}
                subtitle={specialMessage.synopsis}
              />
              <div>
                <p className="section-kicker">
                  <Sparkles size={15} /> {specialMessage.category}
                </p>
                <h2>{specialMessage.title}</h2>
                <p>{specialMessage.synopsis}</p>
                <Link
                  className="button button-yellow"
                  href={`/historias/${specialMessage.slug}/${specialMessage.chapters[0].slug}`}
                >
                  Ler a mensagem <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </PublicShell>
  );
}
