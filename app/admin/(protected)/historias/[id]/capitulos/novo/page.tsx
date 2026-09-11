import { notFound } from "next/navigation";
import { ChapterForm } from "@/components/admin/chapter-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};
export default async function NewChapterPage({
  params,
  searchParams,
}: PageProps) {
  const id = (await params).id;
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: story } = await client!
    .from("stories")
    .select("title,chapters(chapter_number)")
    .eq("id", id)
    .single();
  if (!story) notFound();
  const nextNumber =
    Math.max(
      0,
      ...(story.chapters ?? []).map((chapter) => chapter.chapter_number),
    ) + 1;
  return (
    <main>
      <AdminPageHeader
        title="Novo capítulo"
        description="Escreva em blocos simples e publique somente quando terminar."
        backHref={`/admin/historias/${id}`}
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <ChapterForm storyId={id} nextNumber={nextNumber} />
      </section>
    </main>
  );
}
