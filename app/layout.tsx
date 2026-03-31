import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="bg-[#0b0b0f] text-white">

        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-72 bg-[#111118] border-r border-zinc-800 p-6 flex flex-col">

            <h1 className="text-2xl font-bold mb-10 tracking-tight">
              Financial Hub
            </h1>

            <nav className="flex flex-col gap-3 text-sm">

              <a href="/"
                className="hover:bg-zinc-800 p-3 rounded-lg transition">
                🏠 Dashboard
              </a>

              <a href="/acoes"
                className="hover:bg-zinc-800 p-3 rounded-lg transition">
                📊 Radar de ações
              </a>

              <a href="/investimentos"
                className="hover:bg-zinc-800 p-3 rounded-lg transition">
                💰 Investimentos
              </a>

              <a href="/gastos"
                className="hover:bg-zinc-800 p-3 rounded-lg transition">
                💸 Gastos
              </a>

              <a href="/config"
                className="hover:bg-zinc-800 p-3 rounded-lg transition">
                ⚙️ Config
              </a>

            </nav>

            <div className="mt-auto text-xs text-zinc-500">
              v1.0 • Financial Hub
            </div>

          </aside>

          {/* Conteúdo */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>

      </body>
    </html>
  )
}