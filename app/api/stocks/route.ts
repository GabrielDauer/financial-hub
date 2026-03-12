import { NextResponse } from "next/server"

export async function GET(req:Request){

  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get("ticker")

  const r = await fetch(`https://brapi.dev/api/quote/${ticker}`)
  const data = await r.json()

  return NextResponse.json(data)
}