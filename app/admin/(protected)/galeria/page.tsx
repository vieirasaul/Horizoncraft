import Link from "next/link";
import { Pencil, Upload } from "lucide-react";
import { deleteGalleryItem } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
type PageProps = { searchParams: Promise<{ sucesso?: string; erro?: string }> };
export default async function AdminGalleryPage({ searchParams }: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: items } = await client!
    .from("gallery_items")
    .select("id,title,image_path,status,updated_at")
    .order("updated_at", { ascending: false });
  const query = await searchParams;
  return (
    <main>
      <AdminPageHeader
        title="Galeria"
        description="Envie desenhos e relacione cada arte ao Horizoncraft."
        actionHref="/admin/galeria/novo"
        actionLabel="Novo desenho"
      />
      <section className="admin-content">
        <Notice success={query.sucesso} error={query.erro} />
        {items?.length ? (
          <div className="admin-list">
            {items.map((item) => (
              <article key={item.id}>
                <span className={`admin-status status-${item.status}`}>
                  {item.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.image_path.split("/").at(-1)}</p>
                </div>
                <Link
                  className="icon-button"
                  href={`/admin/galeria/${item.id}`}
                  aria-label={`Editar ${item.title}`}
                >
                  <Pencil />
                </Link>
                <form action={deleteGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input
                    type="hidden"
                    name="image_path"
                    value={item.image_path}
                  />
                  <DeleteButton />
                </form>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <h2>Envie o primeiro desenho quando ele estiver pronto.</h2>
            <p>Use um arquivo JPEG, PNG ou WebP com até 3 MB.</p>
            <Link className="admin-primary" href="/admin/galeria/novo">
              <Upload aria-hidden="true" /> Enviar desenho
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
