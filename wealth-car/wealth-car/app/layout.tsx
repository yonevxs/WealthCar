import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wealth Car — Informações do seu veículo",
  description:
    "Wealth Car conecta seu veículo ao mundo digital, oferecendo dados precisos e em tempo real sobre seu desempenho.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
