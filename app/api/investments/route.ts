import { NextResponse } from "next/server";

type StoredPosition = {
  key: string;
  ticker: string | null;
  product: string;
  assetClass: string;
  institution: string;
  quantity: number;
  investedAmount: number | null;
  avgPrice: number | null;
  costCoverage: "full" | "partial" | "unknown";
  valuationSource: "market" | "statement";
};

type QuoteRow = {
  ticker: string;
  price: number | null;
  previousClose: number | null;
  changePercent: number | null;
  asOf: string;
  priceEarnings: number | null;
  priceToBook: number | null;
  eps: number | null;
  grossMargin: number | null;
  netMargin: number | null;
  roe: number | null;
  revenue: number | null;
  netIncome: number | null;
  historyJson?: string;
};

async function readAppsScript(action: string) {
  const baseUrl = process.env.APPS_SCRIPT_BASE_URL;
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;

  if (!baseUrl || !secret) {
    throw new Error("Apps Script não configurado.");
  }

  const url = `${baseUrl}?action=${encodeURIComponent(action)}&secret=${encodeURIComponent(secret)}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Falha ao consultar Apps Script (${action})`);
  }

  return res.json();
}

export async function GET() {
  try {
    const [positions, quotes] = await Promise.all([
      readAppsScript("positions"),
      readAppsScript("quotes"),
    ]);

    const quoteMap = new Map<string, QuoteRow>(
      (quotes as QuoteRow[]).map((q) => [q.ticker, q])
    );

    const merged = (positions as StoredPosition[]).map((p) => {
      const quote = p.ticker ? quoteMap.get(p.ticker) : undefined;
      const currentValue =
        quote?.price && p.quantity ? quote.price * p.quantity : null;

      const profit =
        currentValue !== null && p.investedAmount !== null
          ? currentValue - p.investedAmount
          : null;

      return {
        ...p,
        quote,
        currentValue,
        profit,
      };
    });

    return NextResponse.json({
      ok: true,
      positions: merged,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao montar investimentos", details: String(error) },
      { status: 500 }
    );
  }
}