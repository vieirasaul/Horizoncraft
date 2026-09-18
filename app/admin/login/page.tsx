import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { signIn } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
import "../admin.css";

type PageProps = { searchParams: Promise<{ erro?: string }> };
const errors: Record<string, string> = {
  campos: "Preencha um e-mail válido e uma senha com pelo menos 8 caracteres.",
  configuracao: "O Supabase ainda não foi configurado neste projeto.",
  credenciais: "E-mail ou senha incorretos.",
  permissao: "Esta conta não possui permissão de administrador.",
};
export const metadata: Metadata = {
  title: "Entrar no Horizoncraft",
  description: "Acesso privado ao painel administrativo do Horizoncraft.",
};
export default async function LoginPage({ searchParams }: PageProps) {
  const { user } = await getAuthenticatedAdmin();
  if (user) redirect("/admin");
  const error = errors[(await searchParams).erro ?? ""];
  return (
    <main className="admin-login">
      <section>
        <div className="admin-brand">
          <BrandMark />
          <span>Horizoncraft</span>
        </div>
        <h1>Entrar no Horizoncraft</h1>
        {error && (
          <div className="admin-notice notice-error" role="alert">
            {error}
          </div>
        )}
        <form action={signIn} className="admin-form">
          <label>
            E-mail
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            Senha
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </label>
          <SubmitButton pendingLabel="Entrando…">Entrar</SubmitButton>
        </form>
        <Link className="back-link login-back-link" href="/">
          <ArrowLeft size={17} /> Voltar ao site
        </Link>
      </section>
    </main>
  );
}
