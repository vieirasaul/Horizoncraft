import type { Metadata } from "next";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/nunito-sans/800.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Horizoncraft — Uma história criada por Théo",
    template: "%s | Horizoncraft",
  },
  description:
    "Conheça os personagens, descubra seus poderes e acompanhe a história de Horizoncraft.",
  applicationName: "Horizoncraft",
  openGraph: {
    title: "Horizoncraft — Uma história criada por Théo",
    description:
      "Conheça os personagens, descubra seus poderes e acompanhe uma história que está apenas começando.",
    type: "website",
    locale: "pt_BR",
    siteName: "Horizoncraft",
  },
  twitter: {
    card: "summary",
    title: "Horizoncraft",
    description: "Uma história de heróis, poderes e aventuras.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
