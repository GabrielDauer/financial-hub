import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  const data = await partnrFetch(
    `companies/${ticker}/ratios?frequency=TTM`
  );

  return NextResponse.json(data);
}