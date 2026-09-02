export function Notice({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;
  return (
    <div
      className={`admin-notice ${error ? "notice-error" : "notice-success"}`}
      role="status"
    >
      {error
        ? "Não foi possível concluir a ação. Revise os dados e tente de novo."
        : "Ação concluída com sucesso."}
    </div>
  );
}
