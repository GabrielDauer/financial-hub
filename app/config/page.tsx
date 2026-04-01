import { UploadZone } from "@/components/upload-zone";

export default function ConfigPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-2 text-zinc-400">
          Conecte APIs bancárias quando disponíveis ou importe extratos por CSV/Excel.
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 text-lg font-medium">Conectar instituição</h2>
          <p className="mb-5 text-sm text-zinc-400">
            Configure token, client id e secret quando o banco expuser API para extrato,
            saldo e investimentos.
          </p>

          <div className="grid gap-3">
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Nome da instituição" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Client ID" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Client Secret" />
            <button className="rounded-2xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500">
              Salvar conexão
            </button>
          </div>
        </div>

        <UploadZone />
      </section>
    </div>
  );
}