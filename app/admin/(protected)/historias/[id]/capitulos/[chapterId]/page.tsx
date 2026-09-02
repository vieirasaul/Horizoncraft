import { notFound } from "next/navigation";
import { ChapterForm } from "@/components/admin/chapter-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
type PageProps = {
  params: Promise<{ id: string; chapterId: string }>;
  searchParams: Promise<{ erro?: string }>;
};
export default async function EditChapterPage({
  params,
  searchParams,
}: PageProps) {
  const values = await params;
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const [{ data: story }, { data: chapter }] = await Promise.all([
    client!.from("stories").select("title").eq("id", values.id).single(),
    client!
      .from("chapters")
      .select("*")
      .eq("id", values.chapterId)
      .eq("story_id", values.id)
      .single(),
  ]);
  if (!story || !chapter) notFound();
  return (
    <main>
      <AdminPageHeader
        eyebrow={story.title}
        title={`Capítulo ${chapter.chapter_number}`}
        description="Ajuste o conteúdo, salve como rascunho ou publique."
        backHref={`/admin/historias/${values.id}`}
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <ChapterForm storyId={values.id} chapter={chapter} />
      </section>
    </main>
  );
}
