import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prumo · Triagem de suporte da Agenda Bela",
  description: "Estudo de caso: agente de IA que faz a triagem do suporte de uma empresa fictícia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
