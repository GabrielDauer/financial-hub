import "./globals.css";
import { AppShell } from "@/components/app-shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#09090b] text-zinc-100 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}