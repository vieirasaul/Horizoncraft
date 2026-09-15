import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Notice } from "@/components/admin/notice";
import { signOut } from "@/app/admin/actions";
import { getAdminSuccess } from "@/lib/admin-flash";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { client, user, profile } = await getAuthenticatedAdmin();
  if (!client)
    return (
      <main className="admin-setup">
        <BrandMark />
        <p className="section-kicker">Configuração necessária</p>
        <h1>CONECTE O SUPABASE</h1>
        <p>
          Preencha as variáveis do arquivo <code>.env.local</code> e siga o guia
          do README para liberar a área administrativa.
        </p>
        <Link className="button button-secondary" href="/">
          Voltar ao site
        </Link>
      </main>
    );
  if (!user) redirect("/admin/login");
  const success = await getAdminSuccess();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <BrandMark />
          <span>Horizoncraft</span>
        </Link>
        <p>Olá, {profile?.display_name ?? "Criador"}!</p>
        <nav aria-label="Navegação administrativa">
          <Link href="/admin">
            <LayoutDashboard /> Visão geral
          </Link>
          <Link href="/admin/capitulos">
            <BookOpen /> Capítulos
          </Link>
          <Link href="/admin/personagens">
            <Users /> Personagens
          </Link>
          <Link href="/admin/poderes">
            <Sparkles /> Poderes
          </Link>
          <Link href="/admin/galeria">
            <Images /> Galeria
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/" target="_blank">
            Ver site <ExternalLink />
          </Link>
          <form action={signOut}>
            <button type="submit">
              <LogOut /> Sair
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-main">
        <Notice success={success?.message} noticeId={success?.id} />
        {children}
      </div>
    </div>
  );
}
