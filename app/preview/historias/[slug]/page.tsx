import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { CoverArt } from "@/components/cover-art";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ slug: string }> };
export default async function StoryPreviewPage({ params }: PageProps) {
  const { client, user } = await getAuthenticatedAdmin();
  if (!client || !user) redirect("/admin/login");
  const { data: story } = await client
    .from("stories")
    .select("*,chapters(*)")
    .eq("slug", (await params).slug)
    .single();
  if (!story) notFound();
  return (
    <main className="preview-page">
      <div className="preview-bar">
        <Eye /> Você está vendo uma prévia privada.{" "}
        <Link href={`/admin/historias/${story.id}`}>
          <ArrowLeft /> Voltar ao painel
        </Link>
      </div>
      <section className="story-detail-hero page-width">
        <div className="story-detail-grid">
          <CoverArt title={story.title} accent={story.accent} />
          <div>
            <span className="tag">
              {story.status === "published" ? "Publicado" : "Rascunho"}
            </span>
            <h1>{story.title}</h1>
            <p>{story.synopsis}</p>
            <p>{story.chapters?.length ?? 0} capítulos cadastrados.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
