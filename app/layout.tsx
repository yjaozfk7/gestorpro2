import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GestorPro",
  description: "Gerencie seu negócio de forma simples e eficiente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
