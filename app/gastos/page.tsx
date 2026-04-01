"use client";
import { StatCard } from "@/components/stat-card";
import { ChartCard } from "@/components/chart-card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

const monthlyExpenses = [
  { mes: "Jan", valor: 4200 },
  { mes: "Fev", valor: 3900 },
  { mes: "Mar", valor: 4700 },
  { mes: "Abr", valor: 4450 },
];

const installments = [
  { item: "Notebook", restante: 1800 },
  { item: "Viagem", restante: 2400 },
  { item: "Curso", restante: 950 },
];

const provisions = [
  { mes: "Mai", valor: 1200 },
  { mes: "Jun", valor: 1800 },
  { mes: "Jul", valor: 900 },
];

export default function GastosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Gastos</h1>
        <p className="mt-2 text-zinc-400">
          Acompanhe despesas mensais, parcelamentos em aberto e provisões futuras.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Gasto mês passado" value="R$ 4.450" />
        <StatCard title="Aberto neste mês" value="R$ 2.980" />
        <StatCard title="Parcelado em aberto" value="R$ 5.150" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Gastos por mês">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyExpenses}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Provisão de gastos">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={provisions}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line dataKey="valor" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-4 text-lg font-medium">Parcelados em aberto</h2>
        <div className="space-y-3">
          {installments.map((row) => (
            <div key={row.item} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>{row.item}</span>
              <span className="text-zinc-300">R$ {row.restante}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}