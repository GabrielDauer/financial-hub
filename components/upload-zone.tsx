"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export function UploadZone() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<unknown[]>([]);

  async function onFileChange(file: File) {
    const form = new FormData();
    form.append("file", file);
    setLoading(true);

    const res = await fetch("/api/import", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    setRows(json.rows || []);
    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6">
      <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
        <UploadCloud className="h-8 w-8 text-blue-400" />
        <div className="text-sm text-zinc-300">
          Clique para enviar CSV ou Excel
        </div>
        <input
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileChange(file);
          }}
        />
      </label>

      <div className="mt-4 text-sm text-zinc-400">
        {loading ? "Importando..." : `${rows.length} linhas carregadas`}
      </div>
    </div>
  );
}