import { redirect } from "next/navigation";
import { ChapterForm } from "@/components/admin/chapter-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = { searchParams: Promise<{ erro?: string }> };

export default async function NewChapterPage({ searchParams }: PageProps) {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const { data: stories } = await client
    .from("stories")
    .select("id,chapters(chapter_number)")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);
  const story = stories?.[0];
  if (!story) redirect("/admin/capitulos?erro=historia-nao-encontrada");
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
        backHref="/admin/capitulos"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <ChapterForm storyId={story.id} nextNumber={nextNumber} />
      </section>
    </main>
  );
}
