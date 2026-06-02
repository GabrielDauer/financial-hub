"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/stat-card";

type Quote = {
  close_price: number;
  variation?: number;
};

type DashboardData = {
  market: {
    ibov: Quote;
    ifix: Quote;
    usd: Quote;
    selic: Quote;
    ipca: Quote;
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState("1Y");

  useEffect(() => {
    fetch(`/api/dashboard?period=${period}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, [period]);

  const market = data?.market;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Patrimônio consolidado, gastos recentes, mercado e indicadores
          macroeconômicos.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["1D", "5D", "1M", "6M", "1Y", "5Y"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`rounded-xl px-4 py-2 text-sm ${
              period === p
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Patrimônio Total"
          value="Calculado dinamicamente"
        />
        <StatCard
          title="Investimentos"
          value="Calculado dinamicamente"
        />
        <StatCard title="Liquidez" value="Calculado dinamicamente" />

        <StatCard
          title="IBOV"
          value={
            market?.ibov?.close_price
              ? market.ibov.close_price.toLocaleString("pt-BR")
              : "..."
          }
          subtitle={
            market?.ibov?.variation != null
              ? `${(market.ibov.variation * 100).toFixed(2)}%`
              : undefined
          }
        />

        <StatCard
          title="IFIX"
          value={
            market?.ifix?.close_price
              ? market.ifix.close_price.toLocaleString("pt-BR")
              : "..."
          }
          subtitle={
            market?.ifix?.variation != null
              ? `${(market.ifix.variation * 100).toFixed(2)}%`
              : undefined
          }
        />

        <StatCard
          title="USD/BRL"
          value={
            market?.usd?.close_price
              ? `R$ ${market.usd.close_price.toFixed(2)}`
              : "..."
          }
        />

        <StatCard
          title="SELIC"
          value={
            market?.selic?.close_price
              ? `${market.selic.close_price}%`
              : "..."
          }
        />

        <StatCard
          title="IPCA"
          value={
            market?.ipca?.close_price
              ? `${market.ipca.close_price}%`
              : "..."
          }
        />
      </div>
    </div>
  );
}
