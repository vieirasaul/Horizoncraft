import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InlineText } from "@/components/inline-text";
import { PublicShell } from "@/components/public-shell";
import { ReadingProgress } from "@/components/reading-progress";
import { getChapter } from "@/lib/data";
import "../../chapter-reader.css";

type PageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const result = await getChapter((await params).slug);
  if (!result) return { title: "Capítulo não encontrado" };
  const { story, chapterIndex } = result;
  const chapter = story.chapters[chapterIndex];
  const description = `Capítulo ${chapter.chapterNumber}: ${chapter.title}, da história Horizoncraft.`;
  return {
    title: `${chapter.title} — ${story.title}`,
    description,
    openGraph: { title: chapter.title, description, images: [] },
    twitter: { title: chapter.title, description, images: [] },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const result = await getChapter((await params).slug);
  if (!result) notFound();
  const { story, chapterIndex } = result;
  const chapter = story.chapters[chapterIndex];
  const previous = story.chapters[chapterIndex - 1];
  const next = story.chapters[chapterIndex + 1];

  return (
    <PublicShell>
      <ReadingProgress />
      <main className="reader">
        <header className="reader-header">
          <Link href="/capitulos">
            <ArrowLeft size={17} /> Voltar para os capítulos
          </Link>
          <span>Capítulo {chapter.chapterNumber}</span>
          <h1>{chapter.title}</h1>
        </header>
        <article className="chapter-content">
          {chapter.content.map((block) => {
            if (block.type === "heading")
              return <h2 key={block.id}>{block.text}</h2>;
            if (block.type === "quote")
              return <blockquote key={block.id}>{block.text}</blockquote>;
            if (block.type === "list")
              return (
                <ul key={block.id}>
                  {(block.text ?? "")
                    .split("\n")
                    .filter(Boolean)
                    .map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                </ul>
              );
            if (block.type === "image")
              return (
                <figure className="story-image-placeholder" key={block.id}>
                  <div>
                    {block.imageUrl ? (
                      <Image
                        src={block.imageUrl}
                        alt={block.alt ?? "Imagem da história"}
                        fill
                        sizes="(max-width: 700px) 100vw, 900px"
                      />
                    ) : (
                      <span
                        className="reader-placeholder-art"
                        role="img"
                        aria-label={
                          block.alt ?? "Imagem abstrata provisória da história"
                        }
                      >
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </div>
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              );
            return (
              <p key={block.id}>
                <InlineText text={block.text ?? ""} />
              </p>
            );
          })}
        </article>
        <nav
          className="chapter-navigation"
          aria-label="Navegação entre capítulos"
        >
          {previous ? (
            <Link href={`/capitulos/${previous.slug}`}>
              <ArrowLeft />
              <span>
                <small>Anterior</small>
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="next" href={`/capitulos/${next.slug}`}>
              <span>
                <small>Próximo</small>
                {next.title}
              </span>
              <ArrowRight />
            </Link>
          ) : (
            <Link className="next" href="/capitulos">
              <span>
                <small>Fim do capítulo</small>
                Voltar aos capítulos
              </span>
              <ArrowRight />
            </Link>
          )}
        </nav>
      </main>
    </PublicShell>
  );
}
