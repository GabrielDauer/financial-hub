import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

type Candle = {
  date: string;
  open_price: number;
  close_price: number;
  highest_price: number;
  lowest_price: number;
  volume: number;
  variation: number;
  variation_value: number;
};

type QuoteChartResponse = {
  chart: Record<string, Candle[]>;
};

const periodMap: Record<string, string> = {
  "1D": "1d",
  "5D": "5d",
  "1M": "1M",
  "6M": "6M",
  "1Y": "1Y",
  "5Y": "5Y",

  "1d": "1d",
  "5d": "5d",
  "1mo": "1M",
  "3mo": "6M",
  "6mo": "6M",
  "1y": "1Y",
  "5y": "5Y",
};

function buildMarketData(series: Candle[]) {
  if (!series?.length) {
    return {
      current: null,
      variation: null,
      variationPercent: null,
      high: null,
      low: null,
      series: [],
    };
  }

  const first = series[0];
  const last = series[series.length - 1];

  const current = last.close_price;

  const variation = current - first.close_price;

  const variationPercent =
    first.close_price > 0
      ? ((current - first.close_price) /
          first.close_price) *
        100
      : null;

  return {
    current,
    variation,
    variationPercent,
    high: Math.max(
      ...series.map((p) => p.highest_price)
    ),
    low: Math.min(
      ...series.map((p) => p.lowest_price)
    ),
    series,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const uiPeriod =
      searchParams.get("period") ?? "1Y";

    const period =
      periodMap[uiPeriod] ?? "1Y";

    const [ibov, ifix, usd] =
      await Promise.all([
        partnrFetch<QuoteChartResponse>(
          "quotes/IBOV?type=chart"
        ),
        partnrFetch<QuoteChartResponse>(
          "quotes/IFIX?type=chart"
        ),
        partnrFetch<QuoteChartResponse>(
          "quotes/USD?type=chart"
        ),
      ]);

    const ibovSeries =
      ibov.chart?.[period] ?? [];

    const ifixSeries =
      ifix.chart?.[period] ?? [];

    const usdSeries =
      usd.chart?.[period] ?? [];

    return NextResponse.json({
      period,

      ibov: buildMarketData(
        ibovSeries
      ),

      ifix: buildMarketData(
        ifixSeries
      ),

      usd: buildMarketData(
        usdSeries
      ),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao consultar dados de mercado",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}