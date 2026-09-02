"use client";
export function DeleteButton({ label = "Excluir" }: { label?: string }) {
  return (
    <button
      className="danger-button"
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Tem certeza? Esta ação não poderá ser desfeita."))
          event.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
