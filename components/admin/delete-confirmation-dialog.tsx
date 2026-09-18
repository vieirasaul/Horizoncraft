"use client";

import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteConfirmationDialog({
  title = "Confirmar exclusão",
  description = "Esta ação não poderá ser desfeita.",
  triggerLabel = "Excluir",
  confirmLabel,
  triggerIcon,
  showTriggerLabel = true,
  triggerAriaLabel,
  onConfirm,
  disabled = false,
}: {
  title?: string;
  description?: ReactNode;
  triggerLabel?: string;
  confirmLabel?: string;
  triggerIcon?: ReactNode;
  showTriggerLabel?: boolean;
  triggerAriaLabel?: string;
  onConfirm?: () => void | Promise<void>;
  disabled?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const { pending } = useFormStatus();
  const [busy, setBusy] = useState(false);
  const isBusy = pending || busy;
  const resolvedConfirmLabel = confirmLabel ?? triggerLabel;

  function closeDialog() {
    if (!isBusy) dialogRef.current?.close();
  }

  async function confirm() {
    if (!onConfirm) return;
    setBusy(true);
    try {
      await onConfirm();
      dialogRef.current?.close();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="danger-button"
        type="button"
        disabled={disabled || isBusy}
        aria-label={
          showTriggerLabel ? undefined : (triggerAriaLabel ?? triggerLabel)
        }
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerIcon}
        {showTriggerLabel && triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        className="delete-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="delete-dialog-card">
          <button
            className="delete-dialog-close"
            type="button"
            onClick={closeDialog}
            aria-label="Fechar confirmação"
            disabled={isBusy}
          >
            <X aria-hidden="true" />
          </button>
          <span className="delete-dialog-icon" aria-hidden="true">
            <AlertTriangle />
          </span>
          <h2 id={titleId}>{title}</h2>
          <p id={descriptionId}>{description}</p>
          <div className="delete-dialog-actions">
            <button
              className="admin-secondary"
              type="button"
              onClick={closeDialog}
              disabled={isBusy}
            >
              Cancelar
            </button>
            <button
              className="danger-button"
              type={onConfirm ? "button" : "submit"}
              onClick={onConfirm ? () => void confirm() : undefined}
              disabled={isBusy}
            >
              <Trash2 aria-hidden="true" />
              {isBusy ? "Excluindo..." : resolvedConfirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
