import { Zap } from "lucide-react";
import type { ThemeColor } from "@/lib/types";

export function PowerBadge({
  name,
  accent = "blue",
}: {
  name: string;
  accent?: ThemeColor;
}) {
  return (
    <span className={`power-badge accent-${accent}`}>
      <Zap aria-hidden="true" />
      {name}
    </span>
  );
}
