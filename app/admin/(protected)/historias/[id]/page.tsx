import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, Pencil, Plus } from "lucide-react";
import { deleteChapter, moveChapter } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StoryForm } from "@/components/admin/story-form";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sucesso?: string; erro?: string }>;
};
export default async function EditStoryPage({
  params,
  searchParams,
}: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: story } = await client!
    .from("stories")
    .select("*,chapters(*)")
    .eq("id", (await params).id)
    .single();
  if (!story) notFound();
  const chapters = [...(story.chapters ?? [])].sort(
    (a, b) => a.chapter_number - b.chapter_number,
  );
  const query = await searchParams;
  return (
    <main>
      <AdminPageHeader
        eyebrow="Editar aventura"
        title={story.title}
        description="Atualize a história e organize os capítulos."
        backHref="/admin/historias"
      />
      <section className="admin-content admin-form-wrap">
        <Notice success={query.sucesso} error={query.erro} />
        <div className="admin-section-actions">
          <Link href={`/preview/historias/${story.slug}`} target="_blank">
            <Eye /> Ver prévia
          </Link>
        </div>
        <StoryForm story={story} />
        <div className="admin-subsection">
          <div>
            <span>
              <p>Conteúdo</p>
              <h2>Capítulos</h2>
            </span>
            <Link
              className="admin-primary"
              href={`/admin/historias/${story.id}/capitulos/novo`}
            >
              <Plus /> Novo capítulo
            </Link>
          </div>
          {chapters.length ? (
            <ol className="admin-chapters">
              {chapters.map((chapter, index) => (
                <li key={chapter.id}>
                  <strong>
                    {String(chapter.chapter_number).padStart(2, "0")}
                  </strong>
                  <span>
                    <small>
                      {chapter.status === "published"
                        ? "Publicado"
                        : "Rascunho"}
                    </small>
                    <h3>{chapter.title}</h3>
                  </span>
                  <div className="reorder-buttons">
                    <form action={moveChapter}>
                      <input type="hidden" name="id" value={chapter.id} />
                      <input type="hidden" name="story_id" value={story.id} />
                      <input
                        type="hidden"
                        name="chapter_number"
                        value={Math.max(1, chapter.chapter_number - 1)}
                      />
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label="Mover capítulo para cima"
                      >
                        <ArrowUp />
                      </button>
                    </form>
                    <form action={moveChapter}>
                      <input type="hidden" name="id" value={chapter.id} />
                      <input type="hidden" name="story_id" value={story.id} />
                      <input
                        type="hidden"
                        name="chapter_number"
                        value={chapter.chapter_number + 1}
                      />
                      <button
                        type="submit"
                        disabled={index === chapters.length - 1}
                        aria-label="Mover capítulo para baixo"
                      >
                        <ArrowDown />
                      </button>
                    </form>
                  </div>
                  <Link
                    className="icon-button"
                    href={`/admin/historias/${story.id}/capitulos/${chapter.id}`}
                    aria-label={`Editar ${chapter.title}`}
                  >
                    <Pencil />
                  </Link>
                  <form action={deleteChapter}>
                    <input type="hidden" name="id" value={chapter.id} />
                    <input type="hidden" name="story_id" value={story.id} />
                    <DeleteButton />
                  </form>
                </li>
              ))}
            </ol>
          ) : (
            <div className="admin-empty compact">
              <p>O primeiro capítulo ainda está esperando para ser escrito.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
