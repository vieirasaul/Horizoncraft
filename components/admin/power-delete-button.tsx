"use client";

import { useId, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";

export function PowerDeleteButton({
  powerName,
  characterCount,
}: {
  powerName: string;
  characterCount: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const { pending } = useFormStatus();

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        className="danger-button"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Trash2 aria-hidden="true" /> Excluir poder
      </button>
      <dialog
        ref={dialogRef}
        className="power-delete-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="power-delete-dialog-card">
          <button
            className="power-delete-dialog-close"
            type="button"
            onClick={closeDialog}
            aria-label="Fechar confirmação"
          >
            <X aria-hidden="true" />
          </button>
          <span className="power-delete-dialog-icon" aria-hidden="true">
            <AlertTriangle />
          </span>
          <h2 id={titleId}>Excluir “{powerName}”?</h2>
          <p id={descriptionId}>
            {characterCount
              ? `Este poder também será removido de ${characterCount} ${
                  characterCount === 1 ? "personagem" : "personagens"
                }.`
              : "Este poder será removido permanentemente."}
          </p>
          <div className="power-delete-dialog-actions">
            <button
              className="admin-secondary"
              type="button"
              onClick={closeDialog}
              disabled={pending}
            >
              Cancelar
            </button>
            <button className="danger-button" type="submit" disabled={pending}>
              <Trash2 aria-hidden="true" />
              {pending ? "Excluindo..." : "Excluir poder"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
