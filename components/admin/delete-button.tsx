"use client";
export function DeleteButton({
  label = "Excluir",
  confirmMessage = "Tem certeza? Esta ação não poderá ser desfeita.",
}: {
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <button
      className="danger-button"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
