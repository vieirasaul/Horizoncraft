import "./loading-state.css";

type LoadingStateProps = {
  variant?: "page" | "panel";
};

export function LoadingState({ variant = "page" }: LoadingStateProps) {
  return (
    <div
      className={`loading-state loading-state-${variant}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="loading-portal" aria-hidden="true" />
      <p>Carregando...</p>
    </div>
  );
}
