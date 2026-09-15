import { redirect } from "next/navigation";

export default function LegacyNewChapterPage() {
  redirect("/admin/capitulos/novo");
}
