import Link from "next/link";
import { LogIn, Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import "./site-header.css";

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
        <Link href="/capitulos">Capítulos</Link>
        <Link href="/personagens">Personagens</Link>
        <Link href="/poderes">Poderes</Link>
        <Link href="/galeria">Galeria</Link>
      </nav>
      <Link className="header-action" href={accountHref}>
        <LogIn size={16} /> {accountLabel}
      </Link>
      <details className="mobile-navigation">
        <summary aria-label="Abrir menu">
          <Menu aria-hidden="true" />
        </summary>
        <nav aria-label="Navegação para celular">
          <Link href="/">Início</Link>
          <Link href="/capitulos">Capítulos</Link>
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
