import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import "./admin-form.css";
import "./page-header.css";

export function AdminPageHeader({
  title,
  description,
  backHref,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  backHref?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-heading">
        {backHref && (
          <Link className="admin-back" href={backHref}>
            <ArrowLeft aria-hidden="true" /> Voltar
          </Link>
        )}
        <h1>{title}</h1>
        <p className="admin-page-description">{description}</p>
      </div>
      {actionHref && actionLabel && (
        <Link className="admin-primary" href={actionHref}>
          <Plus aria-hidden="true" /> {actionLabel}
        </Link>
      )}
    </header>
  );
}
