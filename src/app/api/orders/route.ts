import { NextResponse } from "next/server";
import { orders } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ orders });
}
