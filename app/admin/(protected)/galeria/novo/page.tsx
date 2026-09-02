import { GalleryForm } from "@/components/admin/gallery-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
type PageProps = { searchParams: Promise<{ erro?: string }> };
export default async function NewGalleryItemPage({ searchParams }: PageProps) {
  return (
    <main>
      <AdminPageHeader
        eyebrow="Nova imagem"
        title="Enviar desenho"
        description="Escolha o arquivo, confira a prévia e complete as informações."
        backHref="/admin/galeria"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <GalleryForm />
      </section>
    </main>
  );
}
