import { notFound } from "next/navigation";
import { ChapterForm } from "@/components/admin/chapter-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string }>;
};

export default async function EditChapterPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const { data: chapter } = await client
    .from("chapters")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!chapter) notFound();

  return (
    <main>
      <AdminPageHeader
        title={`Capítulo ${chapter.chapter_number}`}
        description="Ajuste o conteúdo, salve como rascunho ou publique."
        backHref="/admin/capitulos"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <ChapterForm storyId={chapter.story_id} chapter={chapter} />
      </section>
    </main>
  );
}
