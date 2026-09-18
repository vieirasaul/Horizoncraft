"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Users,
} from "lucide-react";
import "./mobile-navigation.css";

export function AdminMobileNavigation({
  displayName,
  signOutAction,
}: {
  displayName: string;
  signOutAction: () => Promise<void>;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <details className="admin-mobile-navigation" ref={detailsRef}>
      <summary aria-label="Abrir menu administrativo">
        <Menu aria-hidden="true" />
      </summary>
      <div className="admin-mobile-menu">
        <p>Olá, {displayName}!</p>
        <nav aria-label="Navegação administrativa para celular">
          <Link href="/admin" onClick={closeMenu}>
            <LayoutDashboard /> Visão geral
          </Link>
          <Link href="/admin/capitulos" onClick={closeMenu}>
            <BookOpen /> Capítulos
          </Link>
          <Link href="/admin/personagens" onClick={closeMenu}>
            <Users /> Personagens
          </Link>
          <Link href="/admin/poderes" onClick={closeMenu}>
            <Sparkles /> Poderes
          </Link>
          <Link href="/admin/galeria" onClick={closeMenu}>
            <Images /> Galeria
          </Link>
        </nav>
        <div className="admin-mobile-actions">
          <Link href="/" target="_blank" onClick={closeMenu}>
            <ExternalLink /> Ver site
          </Link>
          <form action={signOutAction}>
            <button type="submit">
              <LogOut /> Sair
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}
