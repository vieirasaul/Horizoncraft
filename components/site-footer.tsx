import Link from "next/link";
import { Github, Linkedin, LogIn } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter({ isAuthenticated }: { isAuthenticated: boolean }) {
  const accountHref = isAuthenticated ? "/admin" : "/admin/login";
  const accountLabel = isAuthenticated ? "Painel" : "Entrar";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-brand-title">
            <BrandMark />
            <strong>Horizoncraft</strong>
          </div>
          <span>Um universo de heróis criado por Théo.</span>
        </div>
        <nav aria-label="Links do rodapé">
          <Link href="/">Início</Link>
          <Link href="/historias">Capítulos</Link>
          <Link href="/personagens">Personagens</Link>
          <Link href="/poderes">Poderes</Link>
          <Link href="/galeria">Galeria</Link>
          <Link className="footer-account" href={accountHref}>
            <LogIn size={16} /> {accountLabel}
          </Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <p className="footer-rights">
          Copyright &copy; {currentYear}. Todos os direitos reservados.{" "}
          <s>Copia não Guilerme</s>
        </p>
        <div className="production-credit">
          <span>Feito por Saul Vieira</span>
          <a
            href="https://github.com/vieirasaul"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Saul Vieira"
          >
            <Github aria-hidden="true" />
          </a>
          <a
            href="https://www.linkedin.com/in/vieirasaul/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Saul Vieira"
          >
            <Linkedin aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
