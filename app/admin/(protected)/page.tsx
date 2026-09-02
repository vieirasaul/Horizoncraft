import Link from "next/link";
import { BookOpen, Images, Plus, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const [stories, characters, gallery] = await Promise.all([
    client!.from("stories").select("id,status"),
    client!.from("characters").select("id,status"),
    client!.from("gallery_items").select("id,status"),
  ]);
  const cards = [
    {
      label: "A história",
      icon: BookOpen,
      href: "/admin/historias",
      count: stories.data?.length ?? 0,
      drafts:
        stories.data?.filter((item) => item.status === "draft").length ?? 0,
    },
    {
      label: "Personagens",
      icon: Users,
      href: "/admin/personagens",
      count: characters.data?.length ?? 0,
      drafts:
        characters.data?.filter((item) => item.status === "draft").length ?? 0,
    },
    {
      label: "Desenhos",
      icon: Images,
      href: "/admin/galeria",
      count: gallery.data?.length ?? 0,
      drafts:
        gallery.data?.filter((item) => item.status === "draft").length ?? 0,
    },
  ];
  return (
    <main>
      <AdminPageHeader
        eyebrow="Horizoncraft"
        title="Visão geral"
        description="Organize os capítulos, personagens, poderes e desenhos da história."
      />
      <section className="admin-content">
        <div className="dashboard-cards">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link href={card.href} key={card.label}>
                <Icon />
                <span>
                  <small>{card.label}</small>
                  <strong>{card.count}</strong>
                  <em>{card.drafts} em rascunho</em>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="quick-create">
          <h2>O que você quer adicionar hoje?</h2>
          <div>
            <Link href="/admin/historias/nova">
              <Plus /> Preparar a história
            </Link>
            <Link href="/admin/personagens/novo">
              <Plus /> Novo personagem
            </Link>
            <Link href="/admin/galeria/novo">
              <Plus /> Novo desenho
            </Link>
          </div>
        </div>
        <aside className="privacy-reminder">
          <strong>Lembrete de segurança</strong>
          <p>
            Não publique nome completo, idade, escola, endereço, contato ou
            localização. Use apenas nomes artísticos e informações do universo
            fictício.
          </p>
        </aside>
      </section>
    </main>
  );
}
