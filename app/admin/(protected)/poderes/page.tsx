import { Sparkles } from "lucide-react";
import { createPower } from "@/app/admin/actions";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

type PageProps = { searchParams: Promise<{ sucesso?: string; erro?: string }> };

export default async function AdminPowersPage({ searchParams }: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: powers, error } = await client
    .from("powers")
    .select("id,name,description,character_powers(count)")
    .order("name");
  const query = await searchParams;

  return (
    <main>
      <AdminPageHeader
        title="Poderes"
        description="Cadastre as habilidades uma vez e use-as em vários personagens."
      />
      <section className="admin-content powers-admin-content">
        <Notice success={query.sucesso} error={query.erro ?? error?.message} />

        <form action={createPower} className="admin-form power-create-form">
          <div className="power-form-heading">
            <Sparkles aria-hidden="true" />
            <span>
              <h2>Novo poder</h2>
              <p>Dê um nome simples e explique o que ele faz.</p>
            </span>
          </div>
          <label>
            Nome do poder
            <input
              name="name"
              required
              maxLength={100}
              placeholder="Ex.: Supervelocidade"
            />
          </label>
          <label>
            Descrição
            <textarea
              name="description"
              required
              rows={3}
              maxLength={500}
              placeholder="Ex.: Consegue correr mais rápido que qualquer pessoa."
            />
          </label>
          <div className="form-actions">
            <SubmitButton>Adicionar poder</SubmitButton>
          </div>
        </form>

        <section className="power-catalog" aria-labelledby="power-list-title">
          <div>
            <h2 id="power-list-title">Poderes cadastrados</h2>
            <p>Consulte as habilidades disponíveis para os personagens.</p>
          </div>
          {powers?.length ? (
            <div className="power-admin-list">
              {powers.map((power) => {
                const characterCount = power.character_powers?.[0]?.count ?? 0;
                return (
                  <article key={power.id}>
                    <Sparkles aria-hidden="true" />
                    <div>
                      <h3>{power.name}</h3>
                      <p>{power.description}</p>
                    </div>
                    <span>
                      {characterCount}{" "}
                      {characterCount === 1 ? "personagem" : "personagens"}
                    </span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty compact">
              <h2>Nenhum poder cadastrado.</h2>
              <p>Use o formulário acima para criar o primeiro.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
