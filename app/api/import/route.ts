import { NextResponse } from "next/server";
import { parseCSV } from "@/lib/csvParser";
import { parseExcel } from "@/lib/excelParser";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase();

  try {
    if (ext === "csv") {
      const content = await file.text();
      const rows = parseCSV(content);
      return NextResponse.json({ ok: true, rows });
    }

    if (ext === "xlsx" || ext === "xls") {
      const buffer = await file.arrayBuffer();
      const rows = parseExcel(buffer);
      return NextResponse.json({ ok: true, rows });
    }

    return NextResponse.json({ error: "Formato não suportado" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao importar", details: String(error) },
      { status: 500 }
    );
  }
}