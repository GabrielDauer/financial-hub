export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Financial Hub</h1>

      <p>Plataforma de análise financeira</p>

      <div style={{ marginTop: 20 }}>
        <a href="/acoes">Radar de ações</a>
        <br />
        <a href="/investimentos">Investimentos</a>
        <br />
        <a href="/gastos">Gastos</a>
        <br />
        <a href="/config">Configurações</a>
      </div>
    </div>
  );
}