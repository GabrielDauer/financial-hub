"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/stat-card";
import { ChartCard } from "@/components/chart-card";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

type Position = {
  ticker: string | null;
  product: string;
  assetClass: string;
  quantity: number;
  investedAmount: number | null;
  currentValue: number | null;
  profit: number | null;
};

const COLORS = [
  "#60a5fa",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

function brl(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function InvestimentosPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/investments");
      const json = await res.json();

      setPositions(json.positions || []);
    } finally {
      setLoading(false);
    }
  }

  const metrics = useMemo(() => {
    const invested = positions.reduce(
      (acc, item) => acc + (item.investedAmount || 0),
      0
    );

    const current = positions.reduce(
      (acc, item) => acc + (item.currentValue || 0),
      0
    );

    const profit = current - invested;

    const profitability =
      invested > 0 ? (profit / invested) * 100 : 0;

    return {
      invested,
      current,
      profit,
      profitability,
    };
  }, [positions]);

  const allocation = useMemo(() => {
    const grouped = positions.reduce(
      (acc, item) => {
        const key = item.assetClass || "Outros";

        acc[key] =
          (acc[key] || 0) +
          (item.currentValue || item.investedAmount || 0);

        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [positions]);

  const riskReturn = useMemo(() => {
    return positions
      .filter((p) => p.currentValue)
      .map((p) => ({
        ativo: p.ticker || p.product,
        risco: Math.max(
          1,
          Math.min(
            10,
            ((p.currentValue || 0) /
              (metrics.current || 1)) *
              100
          )
        ),
        retorno:
          p.investedAmount && p.currentValue
            ? ((p.currentValue - p.investedAmount) /
                p.investedAmount) *
              100
            : 0,
      }));
  }, [positions, metrics.current]);

  const evolution = useMemo(() => {
    const invested =
      metrics.invested === 0 ? 1 : metrics.invested;

    return [
      {
        mes: "Início",
        rent: 0,
      },
      {
        mes: "Hoje",
        rent:
          ((metrics.current - invested) / invested) *
          100,
      },
    ];
  }, [metrics]);

  if (loading) {
    return (
      <div className="text-zinc-400">
        Carregando investimentos...
      </div>
    );
  }

  const hasData = positions.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Investimentos
        </h1>

        <p className="mt-2 max-w-3xl text-zinc-400">
          Visão consolidada da carteira baseada nos dados
          importados da B3 e cotações atualizadas.
        </p>
      </div>

      {!hasData && (
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-300">
          Nenhum investimento encontrado.
          <br />
          Vá em Configurações → Importar B3.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Valor atual"
          value={brl(metrics.current)}
          subtitle="Mercado hoje"
        />

        <StatCard
          title="Capital investido"
          value={brl(metrics.invested)}
          subtitle="Aportes acumulados"
        />

        <StatCard
          title="Lucro"
          value={brl(metrics.profit)}
          subtitle={`${metrics.profitability.toFixed(
            2
          )}%`}
        />

        <StatCard
          title="Rentabilidade"
          value={`${metrics.profitability.toFixed(2)}%`}
          subtitle="Baseado no custo médio"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Rentabilidade da carteira">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolution}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />

              <XAxis
                dataKey="mes"
                tick={{ fill: "#a1a1aa" }}
              />

              <YAxis
                tick={{ fill: "#a1a1aa" }}
                unit="%"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="rent"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Alocação da carteira">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocation}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                label
              >
                {allocation.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>

              <Legend />

              <Tooltip
                formatter={(value) =>
                  brl(Number(value))
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Risco x Retorno">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />

            <XAxis
              type="number"
              dataKey="risco"
              name="Risco"
              tick={{ fill: "#a1a1aa" }}
            />

            <YAxis
              type="number"
              dataKey="retorno"
              name="Retorno"
              tick={{ fill: "#a1a1aa" }}
              unit="%"
            />

            <Tooltip />

            <Scatter
              data={riskReturn}
              fill="#60a5fa"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 leading-7 text-zinc-300">
        <h2 className="mb-3 text-lg font-medium text-white">
          Metodologia
        </h2>

        <p>
          A rentabilidade é calculada pela fórmula:
        </p>

        <div className="mt-3 rounded-xl bg-black/30 p-4 font-mono text-sm">
          (Valor Atual - Capital Investido) ÷
          Capital Investido × 100
        </div>

        <p className="mt-4">
          Os dados são obtidos da importação da B3,
          custo médio informado e cotações atualizadas
          dos ativos.
        </p>
      </section>
    </div>
  );
}