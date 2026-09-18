"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ADMIN_SUCCESS_COOKIE } from "@/lib/admin-flash-cookie";
import "./notice.css";

export function Notice({
  success,
  error,
  noticeId,
}: {
  success?: string;
  error?: string;
  noticeId?: string;
}) {
  const errorMessage =
    error === "poder-existente"
      ? "Já existe um poder com esse nome. Escolha outro nome."
      : "Não foi possível concluir a ação. Revise os dados e tente de novo.";
  const message = error ? errorMessage : success;
  const currentNotice = noticeId ?? `${error ? "error" : "success"}:${message}`;
  const [dismissedNotice, setDismissedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      document.cookie = `${ADMIN_SUCCESS_COOKIE}=; Path=/admin; Max-Age=0; SameSite=Lax`;
    }
  }, [success]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(
      () => setDismissedNotice(currentNotice),
      4000,
    );
    return () => window.clearTimeout(timeout);
  }, [currentNotice, success]);

  useEffect(() => {
    const hideNotice = () => setDismissedNotice(currentNotice);
    document.addEventListener("submit", hideNotice, true);
    return () => document.removeEventListener("submit", hideNotice, true);
  }, [currentNotice]);

  if (!message || dismissedNotice === currentNotice) return null;

  return (
    <div
      className={`admin-notice ${error ? "notice-error" : "notice-success"}`}
      role={error ? "alert" : "status"}
    >
      <span>{message}</span>
      {error && (
        <button
          type="button"
          onClick={() => setDismissedNotice(currentNotice)}
          aria-label="Fechar aviso"
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
