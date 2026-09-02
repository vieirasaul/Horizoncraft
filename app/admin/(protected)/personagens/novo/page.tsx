import { CharacterForm } from "@/components/admin/character-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
type PageProps = { searchParams: Promise<{ erro?: string }> };
export default async function NewCharacterPage({ searchParams }: PageProps) {
  return (
    <main>
      <AdminPageHeader
        eyebrow="Novo personagem"
        title="Adicionar personagem"
        description="Registre somente as informações que já estão definidas para este personagem."
        backHref="/admin/personagens"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <CharacterForm />
      </section>
    </main>
  );
}
