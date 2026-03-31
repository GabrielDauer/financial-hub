import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get("ticker")

  const token = process.env.BRAPI_TOKEN

  const r = await fetch(
    `https://brapi.dev/api/quote/${ticker}?token=${token}`
  )

  const data = await r.json()

  return NextResponse.json(data)
}