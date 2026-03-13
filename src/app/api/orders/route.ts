import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrders, createOrder, updateOrderStatus } from "@/lib/db";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const orders = await getOrders(supabase);
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { order } = body;

  if (!order || !order.id || !order.items?.length) {
    return NextResponse.json({ error: "注文データが不正です" }, { status: 400 });
  }

  const result = await createOrder(supabase, user.id, order);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, orderId: order.id });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { orderId, status, deliveryDate, note } = body;

  if (!orderId || !status) {
    return NextResponse.json({ error: "注文IDとステータスが必要です" }, { status: 400 });
  }

  const updates: { delivery_date?: string; note?: string } = {};
  if (deliveryDate) updates.delivery_date = deliveryDate;
  if (note !== undefined) updates.note = note;

  const result = await updateOrderStatus(supabase, orderId, status, updates);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
