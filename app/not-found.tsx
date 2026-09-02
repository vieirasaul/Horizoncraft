import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
export default function NotFoundPage() {
  return (
    <PublicShell>
      <main className="not-found">
        <Radar />
        <p className="section-kicker">Página fora do mapa · Erro 404</p>
        <h1>Este mundo não está no mapa.</h1>
        <p>
          A rota que você procurou pode ter mudado ou ainda não foi descoberta.
        </p>
        <Link className="button button-primary" href="/">
          <ArrowLeft /> Voltar ao início
        </Link>
      </main>
    </PublicShell>
  );
}
