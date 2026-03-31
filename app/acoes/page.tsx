"use client"

import { useState } from "react"

export default function Acoes(){

  const [ticker,setTicker] = useState("")
  const [data,setData] = useState<any>(null)
  const [loading,setLoading] = useState(false)

  async function analyze(){

    setLoading(true)

    const res = await fetch(`/api/stocks?ticker=${ticker}`)
    const json = await res.json()

    setData(json)
    setLoading(false)
  }

  const stock = data?.results?.[0]

  return (

    <div>

      <h1 className="text-3xl font-bold">
        Radar de ações
      </h1>

      <div className="flex gap-3 mt-6">

        <input
          className="
            bg-[#111118]
            border border-zinc-700
            p-3 rounded-lg
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
          placeholder="Digite o ticker (ex: PETR4)"
          onChange={(e)=>setTicker(e.target.value)}
        />

        <button
          onClick={analyze}
          className="
            bg-blue-600
            px-6
            rounded-lg
            hover:bg-blue-500
            transition
          "
        >
          {loading ? "Carregando..." : "Analisar"}
        </button>

      </div>

      {loading && (
        <div className="mt-6 animate-pulse text-zinc-400">
          Buscando dados...
        </div>
      )}

      {stock && (

        <div className="mt-10 grid grid-cols-3 gap-6">

          <Metric title="Preço" value={`R$ ${stock.regularMarketPrice}`} />
          <Metric title="Empresa" value={stock.longName} />
          <Metric title="Variação" value={`${stock.regularMarketChangePercent}%`} />

        </div>

      )}

    </div>
  )
}

function Metric({ title, value }: any) {
  return (
    <div className="
      bg-[#111118]
      p-6
      rounded-xl
      border border-zinc-800
      hover:border-blue-500
      transition
    ">
      <h2 className="text-zinc-400 text-sm">{title}</h2>
      <p className="text-lg mt-2">{value}</p>
    </div>
  )
}