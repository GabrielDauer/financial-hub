import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tickers = searchParams.get("tickers");
  const range = searchParams.get("range") || "1y";
  const token = process.env.BRAPI_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: true, message: "Token da BRAPI não configurado" },
      { status: 500 }
    );
  }

  if (!tickers) {
    return NextResponse.json({ error: "Nenhum ticker informado" }, { status: 400 });
  }

  const url = `https://brapi.dev/api/quote/${tickers}?range=${range}&fundamental=true&token=${token}`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  return NextResponse.json(data);
}