import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  const data = await partnrFetch(
    `quotes/${ticker}?type=current`
  );

  return NextResponse.json(data);
}