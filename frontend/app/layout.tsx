import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SLMS - Perpustakaan Kabupaten Bireuen",
    template: "%s | Perpustakaan Kabupaten Bireuen",
  },
  description:
    "Smart Library Management System - Platform digital terpadu Perpustakaan Kabupaten Bireuen. Cari buku, reservasi online, katalog digital, dan layanan perpustakaan modern.",
  keywords: [
    "perpustakaan",
    "bireuen",
    "katalog buku",
    "reservasi buku",
    "e-membership",
    "SLMS",
  ],
  authors: [{ name: "Perpustakaan Kabupaten Bireuen" }],
  openGraph: {
    title: "SLMS - Perpustakaan Kabupaten Bireuen",
    description:
      "Platform digital terpadu Perpustakaan Kabupaten Bireuen",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('slms_theme') === 'dark' || (!('slms_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (_) {}
        ` }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
