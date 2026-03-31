export default function Home() {
  return (
    <div>

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="text-zinc-400 mt-2">
        Visão geral do seu patrimônio
      </p>

      <div className="grid grid-cols-3 gap-6 mt-10">

        <Card title="Patrimônio" value="R$ 120.000" />
        <Card title="Investimentos" value="R$ 95.000" />
        <Card title="Gastos mês" value="R$ 3.200" />

      </div>

    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="
      bg-[#111118]
      p-6
      rounded-xl
      border border-zinc-800
      hover:scale-[1.02]
      hover:border-blue-500
      transition-all duration-300
      cursor-pointer
    ">
      <h2 className="text-zinc-400 text-sm">{title}</h2>
      <p className="text-2xl mt-2 font-semibold">{value}</p>
    </div>
  )
}