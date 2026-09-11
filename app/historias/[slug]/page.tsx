import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { EmptyState } from "@/components/empty-state";
import { PublicShell } from "@/components/public-shell";
import { SPECIAL_MESSAGE_STORY_ID } from "@/lib/content-identity";
import { getStory } from "@/lib/data";

type PageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const story = await getStory((await params).slug);
  if (!story) return { title: "História não encontrada" };
  return {
    title: story.title,
    description: story.synopsis,
    openGraph: {
      title: `${story.title} | Horizoncraft`,
      description: story.synopsis,
      images: [],
    },
    twitter: {
      title: `${story.title} | Horizoncraft`,
      description: story.synopsis,
      images: [],
    },
  };
}
export default async function StoryPage({ params }: PageProps) {
  const story = await getStory((await params).slug);
  if (!story) notFound();
  const isSpecialMessage = story.id === SPECIAL_MESSAGE_STORY_ID;
  return (
    <PublicShell>
      <main>
        <section className="story-detail-hero page-width">
          <Link className="back-link" href="/historias">
            <ArrowLeft size={17} /> A história
          </Link>
          <div className="story-detail-grid">
            <CoverArt
              title={story.title}
              accent={story.accent}
              imageUrl={story.coverUrl}
              label={isSpecialMessage ? story.category : undefined}
              subtitle={isSpecialMessage ? story.synopsis : undefined}
            />
            <div>
              <div className="card-labels">
                <span className="tag">{story.category}</span>
                {!isSpecialMessage && (
                  <span className={`status status-${story.progress}`}>
                    {story.progress === "ongoing"
                      ? "Em andamento"
                      : story.progress === "complete"
                        ? "Concluída"
                        : "Em pausa"}
                  </span>
                )}
              </div>
              <h1>{story.title}</h1>
              <p>{story.synopsis}</p>
              <div className="detail-facts">
                {!isSpecialMessage && (
                  <span>
                    <BookOpen /> {story.chapters.length}{" "}
                    {story.chapters.length === 1 ? "capítulo" : "capítulos"}
                  </span>
                )}
                {story.publishedAt && (
                  <span>
                    <CalendarDays />{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(story.publishedAt))}
                  </span>
                )}
              </div>
              {story.chapters[0] && (
                <Link
                  className="button button-primary"
                  href={`/historias/${story.slug}/${story.chapters[0].slug}`}
                >
                  {isSpecialMessage ? "Ler a mensagem" : "Ler desde o começo"}{" "}
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </section>
        <section className="chapter-section">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="section-kicker">
                  <Sparkles size={14} />
                  {isSpecialMessage
                    ? "Mensagem de boas-vindas"
                    : "Capítulos da história"}
                </p>
                <h2>
                  {isSpecialMessage ? "Uma mensagem para Théo" : "Capítulos"}
                </h2>
              </div>
            </div>
            {story.chapters.length ? (
              <ol
                className={`chapter-list ${
                  isSpecialMessage ? "special-message-list" : ""
                }`}
              >
                {story.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <Link href={`/historias/${story.slug}/${chapter.slug}`}>
                      {!isSpecialMessage && (
                        <span>
                          {String(chapter.chapterNumber).padStart(2, "0")}
                        </span>
                      )}
                      <div>
                        <small>
                          {isSpecialMessage
                            ? story.category
                            : `Capítulo ${chapter.chapterNumber}`}
                        </small>
                        <h3>{chapter.title}</h3>
                      </div>
                      <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState
                title="Os capítulos ainda estão sendo preparados"
                description="Esta história já está no mapa, mas sua primeira página ainda não foi publicada."
              />
            )}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
