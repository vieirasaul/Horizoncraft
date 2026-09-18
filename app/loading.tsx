import { LoadingState } from "@/components/loading-state";
import "./states.css";

export default function LoadingPage() {
  return (
    <main className="loading-screen">
      <LoadingState />
    </main>
  );
}
