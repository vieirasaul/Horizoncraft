"use client";

import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";

export function PowerDeleteButton({
  powerName,
  characterCount,
}: {
  powerName: string;
  characterCount: number;
}) {
  return (
    <DeleteConfirmationDialog
      title={`Excluir “${powerName}”?`}
      description={
        characterCount
          ? `Este poder também será removido de ${characterCount} ${
              characterCount === 1 ? "personagem" : "personagens"
            }.`
          : "Este poder será removido permanentemente."
      }
      triggerLabel="Excluir poder"
      confirmLabel="Excluir poder"
      triggerIcon={<Trash2 aria-hidden="true" />}
    />
  );
}
