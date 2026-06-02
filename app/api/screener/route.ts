import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

export async function POST(req: Request) {
  const body = await req.json();

  const data = await partnrFetch(
    "screener",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  return NextResponse.json(data);
}