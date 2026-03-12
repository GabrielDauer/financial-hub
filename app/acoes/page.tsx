"use client"

import { useState } from "react"

export default function Acoes(){

  const [ticker,setTicker] = useState("")
  const [data,setData] = useState<any>(null)

  async function analyze(){

    const res = await fetch(`/api/stocks?ticker=${ticker}`)
    const json = await res.json()

    setData(json)
  }

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold">Radar de ações</h1>

      <input
        className="border p-2 mt-4"
        placeholder="PETR4"
        onChange={(e)=>setTicker(e.target.value)}
      />

      <button
        onClick={analyze}
        className="ml-2 bg-blue-500 text-white px-4 py-2"
      >
        analisar
      </button>

      {data && (

        <pre className="mt-6">
          {JSON.stringify(data,null,2)}
        </pre>

      )}

    </div>
  )
}