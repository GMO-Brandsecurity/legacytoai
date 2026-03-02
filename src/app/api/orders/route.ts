import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrders } from "@/lib/db";

export async function GET() {
  const supabase = await createSupabaseServer();
  const orders = await getOrders(supabase);
  return NextResponse.json({ orders });
}
