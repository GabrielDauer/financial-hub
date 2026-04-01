"use client";

import { useState } from "react";
import { ChartCard } from "@/components/chart-card";
import { StatCard } from "@/components/stat-card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const presetTickers = ["ITUB4", "PETR4", "VALE3", "WEGE3", "BBAS3"];

export default function AcoesPage() {
  const [selected, setSelected] = useState<string[]>(["ITUB4"]);
  const [range, setRange] = useState("1y");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleTicker(ticker: string) {
    setSelected((current) =>
      current.includes(ticker)
        ? current.filter((t) => t !== ticker)
        : [...current, ticker]
    );
  }

  async function analyze() {
    setLoading(true);
    const res = await fetch(`/api/stocks?tickers=${selected.join(",")}&range=${range}`);
    const json = await res.json();
    setData(json.results || []);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Radar de ações</h1>
        <p className="mt-2 text-zinc-400">
          Compare múltiplos ativos e veja fundamentos, preço, retorno e evolução.
        </p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 text-sm text-zinc-400">Selecione os ativos</div>
        <div className="flex flex-wrap gap-3">
          {presetTickers.map((ticker) => {
            const active = selected.includes(ticker);
            return (
              <button
                key={ticker}
                onClick={() => toggleTicker(ticker)}
                className={`rounded-full px-4 py-2 text-sm ${
                  active
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {ticker}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {["5d", "1mo", "3mo", "6mo", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-2xl px-4 py-2 text-sm ${
                range === r ? "bg-zinc-100 text-zinc-900" : "bg-white/5 text-zinc-300"
              }`}
            >
              {r}
            </button>
          ))}

          <button
            onClick={analyze}
            className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-500"
          >
            {loading ? "Analisando..." : "Analisar"}
          </button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        {data.map((stock) => {
          const historical = (stock.historicalDataPrice || []).map((p: any) => ({
            date: new Date(p.date * 1000).toLocaleDateString("pt-BR"),
            close: p.close,
          }));

          const bars = [
            {
              name: "Receita líquida",
              valor: stock?.financialData?.totalRevenue || 0,
            },
            {
              name: "Lucro líquido",
              valor: stock?.financialData?.netIncomeToCommon || 0,
            },
          ];

          return (
            <div key={stock.symbol} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-semibold">{stock.symbol}</div>
                  <div className="text-sm text-zinc-400">{stock.longName}</div>
                </div>
                <div className="rounded-2xl bg-white/5 px-3 py-2 text-right">
                  <div className="text-xs text-zinc-400">Cotação</div>
                  <div className="text-lg font-semibold">
                    R$ {stock.regularMarketPrice ?? "-"}
                  </div>
                  <div className={`text-sm ${(stock.regularMarketChangePercent ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {stock.regularMarketChangePercent?.toFixed?.(2)}%
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Valorização 12m" value={`${stock?.financialData?.fiftyTwoWeekChangePercent ?? "-"}%`} />
                <StatCard title="P/L" value={String(stock?.defaultKeyStatistics?.priceToEarnings ?? "-")} />
                <StatCard title="P/VP" value={String(stock?.defaultKeyStatistics?.priceToBook ?? "-")} />
                <StatCard title="LPA" value={String(stock?.defaultKeyStatistics?.earningsPerShare ?? "-")} />
                <StatCard title="ROE" value={String(stock?.financialData?.returnOnEquity ?? "-")} />
                <StatCard title="Margem bruta" value={String(stock?.financialData?.grossMargins ?? "-")} />
                <StatCard title="Margem líquida" value={String(stock?.financialData?.profitMargins ?? "-")} />
                <StatCard title="Tag Along" value={String(stock?.tagAlong ?? "-")} />
              </div>

              <ChartCard title="Preço">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historical}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="close" stroke="#60a5fa" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Receita líquida x Lucro líquido">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bars}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}