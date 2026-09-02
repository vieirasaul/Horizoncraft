import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { deleteStory } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

type PageProps = { searchParams: Promise<{ sucesso?: string; erro?: string }> };
export default async function AdminStoriesPage({ searchParams }: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: stories } = await client!
    .from("stories")
    .select("id,title,slug,status,updated_at,chapters(count)")
    .order("updated_at", { ascending: false });
  const query = await searchParams;
  return (
    <main>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="A história"
        description="Organize a história de Horizoncraft e seus capítulos."
        actionHref="/admin/historias/nova"
        actionLabel="Preparar história"
      />
      <section className="admin-content">
        <Notice success={query.sucesso} error={query.erro} />
        {stories?.length ? (
          <div className="admin-list">
            {stories.map((story) => (
              <article key={story.id}>
                <span className={`admin-status status-${story.status}`}>
                  {story.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <div>
                  <h2>{story.title}</h2>
                  <p>
                    /{story.slug} · {story.chapters?.[0]?.count ?? 0} capítulos
                  </p>
                </div>
                <Link
                  className="icon-button"
                  href={`/admin/historias/${story.id}`}
                  aria-label={`Editar ${story.title}`}
                >
                  <Pencil />
                </Link>
                <form action={deleteStory}>
                  <input type="hidden" name="id" value={story.id} />
                  <DeleteButton />
                </form>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <h2>O primeiro capítulo ainda está esperando para ser escrito.</h2>
            <p>
              Comece como rascunho e publique somente quando estiver pronto.
            </p>
            <Link className="admin-primary" href="/admin/historias/nova">
              <Plus /> Preparar a história
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
