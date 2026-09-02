import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  actionHref,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <header className="admin-page-header">
      {backHref && (
        <Link className="admin-back" href={backHref}>
          <ArrowLeft /> Voltar
        </Link>
      )}
      <p>{eyebrow}</p>
      <div>
        <span>
          <h1>{title}</h1>
          <small>{description}</small>
        </span>
        {actionHref && actionLabel && (
          <Link className="admin-primary" href={actionHref}>
            {actionLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
