import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { deleteCharacter, moveCharacter } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
type PageProps = { searchParams: Promise<{ erro?: string }> };
export default async function AdminCharactersPage({ searchParams }: PageProps) {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const { data: characters } = await client
    .from("characters")
    .select("id,name,slug,role,status,sort_order,updated_at")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  const query = await searchParams;
  return (
    <main>
      <AdminPageHeader
        title="Personagens"
        description="Organize heróis, vilões, poderes e segredos."
        actionHref="/admin/personagens/novo"
        actionLabel="Novo personagem"
      />
      <section className="admin-content">
        <Notice error={query.erro} />
        {characters?.length ? (
          <div className="admin-list">
            {characters.map((character, index) => (
              <article className="admin-character-row" key={character.id}>
                <span className={`admin-status status-${character.status}`}>
                  {character.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <div>
                  <h2>{character.name}</h2>
                  <p>
                    {character.role === "hero"
                      ? "Herói"
                      : character.role === "villain"
                        ? "Vilão"
                        : "Outro"}{" "}
                    · /{character.slug}
                  </p>
                </div>
                <div className="admin-row-actions">
                  <div className="reorder-buttons">
                    <form action={moveCharacter}>
                      <input type="hidden" name="id" value={character.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label={`Mover ${character.name} para cima`}
                      >
                        <ArrowUp aria-hidden="true" />
                      </button>
                    </form>
                    <form action={moveCharacter}>
                      <input type="hidden" name="id" value={character.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === characters.length - 1}
                        aria-label={`Mover ${character.name} para baixo`}
                      >
                        <ArrowDown aria-hidden="true" />
                      </button>
                    </form>
                  </div>
                  <Link
                    className="icon-button"
                    href={`/admin/personagens/${character.slug}`}
                    aria-label={`Editar ${character.name}`}
                  >
                    <Pencil />
                  </Link>
                  <form action={deleteCharacter}>
                    <input type="hidden" name="id" value={character.id} />
                    <DeleteButton
                      title={`Excluir “${character.name}”?`}
                      confirmMessage="Este personagem será excluído permanentemente."
                    />
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <h2>Ainda não há outros personagens.</h2>
            <p>Quando quiser, adicione alguém novo à história.</p>
            <Link className="admin-primary" href="/admin/personagens/novo">
              <Plus /> Adicionar personagem
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
