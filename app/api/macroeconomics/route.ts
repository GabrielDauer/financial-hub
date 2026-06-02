import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

export async function GET() {
  const data = await partnrFetch(
    "macroeconomics/indicators"
  );

  return NextResponse.json(data);
}