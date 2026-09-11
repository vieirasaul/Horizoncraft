import { CharacterForm } from "@/components/admin/character-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
type PageProps = { searchParams: Promise<{ erro?: string }> };
export default async function NewCharacterPage({ searchParams }: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: powers } = await client
    .from("powers")
    .select("id,name,description")
    .order("name");

  return (
    <main>
      <AdminPageHeader
        title="Adicionar personagem"
        description="Registre somente as informações que já estão definidas para este personagem."
        backHref="/admin/personagens"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <CharacterForm availablePowers={powers ?? []} />
      </section>
    </main>
  );
}
