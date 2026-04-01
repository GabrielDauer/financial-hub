"use client";
import { StatCard } from "@/components/stat-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Patrimônio consolidado, gastos recentes e evolução da carteira.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Patrimônio total" value="R$ 128.500" />
        <StatCard title="Investimentos hoje" value="R$ 85.240" subtitle="+12,4% em 12 meses" />
        <StatCard title="Desde o primeiro investimento" value="+28,9%" />
        <StatCard title="Gasto M-1" value="R$ 4.450" />
        <StatCard title="Em aberto este mês" value="R$ 2.980" />
        <StatCard title="Liquidez imediata" value="R$ 18.700" />
      </div>
    </div>
  );
}