import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sami'na — Belajar Bahasa Arab dengan Menyimak",
  description: "Platform latihan istima' bahasa Arab interaktif untuk pelajar Indonesia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
