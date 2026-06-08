import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMOR Protocol — Agentes de IA Autónomos",
  description:
    "Creamos agentes de IA que no solo chatean, sino que ejecutan acciones de forma autónoma: atención al cliente, pre-venta, voz, conocimiento interno y análisis de datos.",
  keywords: [
    "agentes IA",
    "automatización",
    "CRM",
    "chatbot inteligente",
    "IA empresa",
    "CMOR Protocol",
  ],
  authors: [{ name: "CMOR Protocol" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon-192x192.png",
  },
  openGraph: {
    title: "CMOR Protocol — Agentes de IA Autónomos",
    description:
      "Agentes de IA que ejecutan acciones reales en tu negocio. No chatbots. Agentes autónomos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
