export function Notice({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;
  const errorMessage =
    error === "poder-existente"
      ? "Já existe um poder com esse nome. Escolha outro nome."
      : "Não foi possível concluir a ação. Revise os dados e tente de novo.";
  return (
    <div
      className={`admin-notice ${error ? "notice-error" : "notice-success"}`}
      role="status"
    >
      {error ? errorMessage : "Ação concluída com sucesso."}
    </div>
  );
}
