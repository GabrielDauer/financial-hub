import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

type QuoteChartResponse = {
  chart: Record<string, unknown>;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const period =
    searchParams.get("period") ?? "1Y";

  const [ibov, ifix, usd] = await Promise.all([
    partnrFetch<QuoteChartResponse>(`quotes/IBOV?type=chart`),
    partnrFetch<QuoteChartResponse>(`quotes/IFIX?type=chart`),
    partnrFetch<QuoteChartResponse>(`quotes/USD?type=chart`),
  ]);

  return NextResponse.json({
    ibov: ibov.chart[period],
    ifix: ifix.chart[period],
    usd: usd.chart[period],
  });
}