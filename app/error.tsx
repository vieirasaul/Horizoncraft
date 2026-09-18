"use client";

import { useEffect } from "react";
import "./states.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="error-screen">
      <p className="section-kicker">Algo saiu dos quadrinhos</p>
      <h1>Vamos tentar colocar tudo no lugar.</h1>
      <p>
        Você pode tentar novamente. Se o problema continuar, volte ao início.
      </p>
      <button className="button button-primary" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
