"use client";

import { useFormStatus } from "react-dom";
import "./admin-form.css";

export function SubmitButton({
  children = "Salvar",
  pendingLabel = "Salvando…",
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className="admin-primary" type="submit" disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
