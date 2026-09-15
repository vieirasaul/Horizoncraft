import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<{ erro?: string }> };

export default async function LegacyAdminStoriesPage({
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const nextQuery = new URLSearchParams();
  if (query.erro) nextQuery.set("erro", query.erro);
  redirect(
    `/admin/capitulos${nextQuery.size ? `?${nextQuery.toString()}` : ""}`,
  );
}
