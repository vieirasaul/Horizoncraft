import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { deleteChapter, moveChapter } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = { searchParams: Promise<{ erro?: string }> };

export default async function AdminChaptersPage({ searchParams }: PageProps) {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const { data: stories, error: loadError } = await client
    .from("stories")
    .select(
      "id,title,slug,featured,created_at,chapters(id,slug,title,chapter_number,status)",
    )
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);
  const story = stories?.[0];
  const chapters = [...(story?.chapters ?? [])].sort(
    (first, second) => first.chapter_number - second.chapter_number,
  );
  const query = await searchParams;

  return (
    <main>
      <AdminPageHeader
        title="Capítulos"
        description="Organize os capítulos da história Horizoncraft."
        actionHref={story ? "/admin/capitulos/novo" : undefined}
        actionLabel={story ? "Novo capítulo" : undefined}
      />
      <section className="admin-content">
        <Notice
          error={query.erro ?? (loadError ? "carregamento" : undefined)}
        />
        {story ? (
          <>
            {chapters.length ? (
              <ol className="admin-chapters">
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <strong className="admin-chapter-number">
                      {String(chapter.chapter_number).padStart(2, "0")}
                    </strong>
                    <span className="admin-chapter-summary">
                      <span
                        className={`admin-status status-${
                          chapter.status === "published" ? "published" : "draft"
                        }`}
                      >
                        {chapter.status === "published"
                          ? "Publicado"
                          : "Rascunho"}
                      </span>
                      <h2>{chapter.title}</h2>
                    </span>
                    <div className="admin-chapter-actions">
                      <div className="reorder-buttons">
                        <form action={moveChapter}>
                          <input type="hidden" name="id" value={chapter.id} />
                          <input
                            type="hidden"
                            name="story_id"
                            value={story.id}
                          />
                          <input type="hidden" name="direction" value="up" />
                          <button
                            type="submit"
                            disabled={index === 0}
                            aria-label="Mover capítulo para cima"
                          >
                            <ArrowUp aria-hidden="true" />
                          </button>
                        </form>
                        <form action={moveChapter}>
                          <input type="hidden" name="id" value={chapter.id} />
                          <input
                            type="hidden"
                            name="story_id"
                            value={story.id}
                          />
                          <input type="hidden" name="direction" value="down" />
                          <button
                            type="submit"
                            disabled={index === chapters.length - 1}
                            aria-label="Mover capítulo para baixo"
                          >
                            <ArrowDown aria-hidden="true" />
                          </button>
                        </form>
                      </div>
                      <Link
                        className="icon-button"
                        href={`/admin/capitulos/${chapter.slug}`}
                        aria-label={`Editar ${chapter.title}`}
                      >
                        <Pencil aria-hidden="true" />
                      </Link>
                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="story_id" value={story.id} />
                        <DeleteButton
                          title={`Excluir “${chapter.title}”?`}
                          confirmMessage="Este capítulo será excluído permanentemente."
                        />
                      </form>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="admin-empty">
                <h2>O primeiro capítulo ainda está esperando.</h2>
                <p>
                  Adicione um capítulo como rascunho e publique quando estiver
                  pronto.
                </p>
                <Link className="admin-primary" href="/admin/capitulos/novo">
                  <Plus aria-hidden="true" /> Novo capítulo
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty">
            <h2>Horizoncraft não está disponível.</h2>
            <p>
              Não foi possível localizar a configuração interna necessária para
              organizar os capítulos.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
