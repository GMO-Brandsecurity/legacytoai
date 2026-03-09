import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ restaurant });
}

export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    genre,
    address,
    seats,
    open_time,
    close_time,
    closed_days,
    monthly_budget,
    order_method,
    preferred_delivery_time,
  } = body;

  // Upsert: insert if no restaurant exists, update if one does
  const { data: existing } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("restaurants")
      .update({
        name,
        genre,
        area: address,
        seats: seats ? parseInt(seats, 10) : 0,
        open_time,
        close_time,
        closed_days,
        monthly_budget: monthly_budget ? parseInt(monthly_budget, 10) : 0,
        order_method,
        preferred_delivery_time,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("restaurants")
      .insert({
        user_id: user.id,
        name: name || "",
        genre,
        area: address,
        seats: seats ? parseInt(seats, 10) : 0,
        open_time,
        close_time,
        closed_days,
        monthly_budget: monthly_budget ? parseInt(monthly_budget, 10) : 0,
        order_method,
        preferred_delivery_time,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
