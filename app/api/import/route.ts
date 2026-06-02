import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { parseCSV } from "@/lib/csvParser";
import {
  aggregatePositions,
  normalizeB3Rows,
  validateB3Rows,
} from "@/lib/b3-extract";

async function persistToAppsScript(payload: unknown) {
  const baseUrl = process.env.APPS_SCRIPT_BASE_URL;
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;

  if (!baseUrl || !secret) return;

  await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      action: "import_b3",
      ...payload,
    }),
    cache: "no-store",
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  let rows: Record<string, unknown>[] = [];

  try {
    if (ext === "xlsx" || ext === "xls") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames.includes("Movimentação")
        ? "Movimentação"
        : workbook.SheetNames[0];

      rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[sheetName],
        { defval: null }
      );
    } else if (ext === "csv") {
      const content = await file.text();
      rows = parseCSV(content);
    } else {
      return NextResponse.json(
        { error: "Formato não suportado. Use xlsx, xls ou csv." },
        { status: 400 }
      );
    }

    validateB3Rows(rows);

    const ledger = normalizeB3Rows(rows);
    const { positions, summary } = aggregatePositions(ledger);

    await persistToAppsScript({ ledger, positions, summary });

    return NextResponse.json({
      ok: true,
      importedRows: ledger.length,
      positions,
      summary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao importar extrato B3", details: String(error) },
      { status: 500 }
    );
  }
}