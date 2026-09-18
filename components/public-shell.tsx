import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
import "./public-shell.css";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const { user } = await getAuthenticatedAdmin();
  const isAuthenticated = Boolean(user);

  return (
    <div className="site-shell">
      <SiteHeader isAuthenticated={isAuthenticated} />
      {children}
      <SiteFooter isAuthenticated={isAuthenticated} />
    </div>
  );
}
