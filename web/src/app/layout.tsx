import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReUse!",
  description: "Plataforma ReUse! — reutilização de itens e consumo consciente",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full font-sans antialiased bg-reuse-bg text-reuse-text">
        {children}
      </body>
    </html>
  );
}
