import { notFound } from "next/navigation";
import { GalleryForm } from "@/components/admin/gallery-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};
export default async function EditGalleryItemPage({
  params,
  searchParams,
}: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: item } = await client!
    .from("gallery_items")
    .select("*")
    .eq("id", (await params).id)
    .single();
  if (!item) notFound();
  return (
    <main>
      <AdminPageHeader
        eyebrow="Editar imagem"
        title={item.title}
        description="Atualize a legenda, relação ou estado de publicação."
        backHref="/admin/galeria"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <GalleryForm item={item} />
      </section>
    </main>
  );
}
