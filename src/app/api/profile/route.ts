import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    // Profile might not exist yet — return user metadata
    return NextResponse.json({
      profile: {
        name: user.user_metadata?.name || user.user_metadata?.full_name || "",
        email: user.email || "",
        company: user.user_metadata?.company || "",
        business_type: user.user_metadata?.businessType || "",
      },
    });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { name, company, business_type } = body;

  const { error } = await supabase
    .from("profiles")
    .update({ name, company, business_type, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
