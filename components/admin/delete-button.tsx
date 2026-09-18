"use client";

import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";

export function DeleteButton({
  label = "Excluir",
  confirmMessage = "Tem certeza? Esta ação não poderá ser desfeita.",
  title = "Confirmar exclusão",
}: {
  label?: string;
  confirmMessage?: string;
  title?: string;
}) {
  return (
    <DeleteConfirmationDialog
      title={title}
      description={confirmMessage}
      triggerLabel={label}
      confirmLabel={label}
    />
  );
}
