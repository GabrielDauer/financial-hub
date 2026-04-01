"use client";
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
} from "recharts";

const allocation = [
  { name: "Ações", value: 42000 },
  { name: "FIIs", value: 18000 },
  { name: "Renda fixa", value: 25000 },
];

const evolution = [
  { mes: "Jan", rent: 1.2 },
  { mes: "Fev", rent: 2.1 },
  { mes: "Mar", rent: -0.8 },
  { mes: "Abr", rent: 3.3 },
  { mes: "Mai", rent: 2.4 },
];

const riskReturn = [
  { ativo: "ITUB4", risco: 4, retorno: 9 },
  { ativo: "WEGE3", risco: 7, retorno: 15 },
  { ativo: "TESOURO", risco: 1, retorno: 4 },
];

export default function InvestimentosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Investimentos</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Visão consolidada da carteira com foco em valor intrínseco, qualidade dos ativos,
          margem de segurança e consistência de retorno.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Valor atual" value="R$ 85.240" subtitle="Mercado hoje" />
        <StatCard title="Capital investido" value="R$ 73.500" subtitle="Aportes acumulados" />
        <StatCard title="Lucro" value="R$ 11.740" subtitle="+15,97%" />
        <StatCard title="Rentab. 12 meses" value="+12,4%" subtitle="Desde o primeiro aporte: +28,9%" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Rentabilidade da carteira">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolution}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rent" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Alocação">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                {allocation.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#60a5fa", "#22c55e", "#f59e0b"][i % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Risco x retorno">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis type="number" dataKey="risco" name="Risco" />
            <YAxis type="number" dataKey="retorno" name="Retorno" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={riskReturn} fill="#60a5fa" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 leading-7 text-zinc-300">
        <h2 className="mb-3 text-lg font-medium text-white">Leitura técnica consolidada</h2>
        <p>
          Pela ótica de Benjamin Graham, a carteira deve privilegiar margem de segurança,
          múltiplos razoáveis e geração de caixa consistente. Pela ótica de Peter Lynch,
          os melhores ativos são os que o investidor entende, com crescimento sustentável e
          fundamentos simples de acompanhar. Aqui, o ideal é exibir concentração por tese,
          lucro sobre custo, retorno anualizado e qualidade do negócio.
        </p>
      </section>
    </div>
  );
}