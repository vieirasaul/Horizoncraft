import { AdminPageHeader } from "@/components/admin/page-header";
import { Notice } from "@/components/admin/notice";
import { StoryForm } from "@/components/admin/story-form";
type PageProps = { searchParams: Promise<{ erro?: string }> };
export default async function NewStoryPage({ searchParams }: PageProps) {
  return (
    <main>
      <AdminPageHeader
        title="Preparar Horizoncraft"
        description="Defina as informações gerais da história. Os capítulos vêm depois."
        backHref="/admin/historias"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <StoryForm />
      </section>
    </main>
  );
}
