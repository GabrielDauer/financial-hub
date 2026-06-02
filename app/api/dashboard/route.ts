import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

export async function GET() {
  try {
    const [ibov, ifix, usd, selic, ipca] =
      await Promise.all([
        partnrFetch("quotes/IBOV?type=current"),
        partnrFetch("quotes/IFIX?type=current"),
        partnrFetch("quotes/USD?type=current"),
        partnrFetch("quotes/SELIC?type=current"),
        partnrFetch("quotes/IPCA?type=current"),
      ]);

    return NextResponse.json({
      market: {
        ibov,
        ifix,
        usd,
        selic,
        ipca,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar dashboard" },
      { status: 500 }
    );
  }
}