import { notFound, redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string; chapterId: string }>;
  searchParams: Promise<{ erro?: string }>;
};

export default async function LegacyEditChapterPage({
  params,
  searchParams,
}: PageProps) {
  const { id, chapterId } = await params;
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: chapter } = await client
    .from("chapters")
    .select("slug")
    .eq("id", chapterId)
    .eq("story_id", id)
    .single();
  if (!chapter) notFound();
  const { erro } = await searchParams;
  redirect(
    `/admin/capitulos/${chapter.slug}${erro ? `?erro=${encodeURIComponent(erro)}` : ""}`,
  );
}
