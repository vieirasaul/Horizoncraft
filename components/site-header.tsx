import Link from "next/link";
import { ArrowRight, LogIn, Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
  const accountHref = isAuthenticated ? "/admin" : "/admin/login";
  const accountLabel = isAuthenticated ? "Painel" : "Entrar";

  return (
    <header className="site-header">
      <Link
        className="brand"
        href="/"
        aria-label="Horizoncraft, página inicial"
      >
        <BrandMark />
        <span className="brand-copy">
          <strong>Horizoncraft</strong>
          <small>Uma história criada por Théo</small>
        </span>
      </Link>
      <nav className="desktop-navigation" aria-label="Navegação principal">
        <Link href="/">Início</Link>
        <Link href="/historias">A história</Link>
        <Link href="/personagens">Personagens</Link>
        <Link href="/poderes">Poderes</Link>
        <Link href="/galeria">Galeria</Link>
        <Link className="account-link" href={accountHref}>
          <LogIn size={16} /> {accountLabel}
        </Link>
      </nav>
      <Link className="header-action" href="/historias">
        Começar a história <ArrowRight size={16} />
      </Link>
      <details className="mobile-navigation">
        <summary aria-label="Abrir menu">
          <Menu aria-hidden="true" />
        </summary>
        <nav aria-label="Navegação para celular">
          <Link href="/">Início</Link>
          <Link href="/historias">A história</Link>
          <Link href="/personagens">Personagens</Link>
          <Link href="/poderes">Poderes</Link>
          <Link href="/galeria">Galeria</Link>
          <Link className="account-link" href={accountHref}>
            <LogIn size={16} /> {accountLabel}
          </Link>
        </nav>
      </details>
    </header>
  );
}
