import { NextResponse } from "next/server";
import { partnrFetch } from "@/lib/partnr";

export async function GET() {
  try {
    const indicators =
      await partnrFetch<any[]>(
        "macroeconomics/indicators"
      );

    return NextResponse.json(indicators);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}