import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context
          }
        },
      },
    }
  );
}

// POST: Register for early access
export async function POST(request: NextRequest) {
  try {
    const { email, businessType, companyName } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Try to insert into early_access table
    const { error } = await supabase.from("early_access").insert({
      email: email.trim().toLowerCase(),
      business_type: businessType || "restaurant",
      company_name: companyName || null,
    });

    if (error) {
      // Duplicate email (unique constraint)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "このメールアドレスは既に登録されています" },
          { status: 409 }
        );
      }
      console.error("Early access insert error:", error);
      // Fall through to localStorage fallback on client
      return NextResponse.json(
        { error: "登録処理中にエラーが発生しました。後ほど再度お試しください。" },
        { status: 500 }
      );
    }

    // Get updated count
    const { count } = await supabase
      .from("early_access")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      count: (count || 0) + 47, // base count + actual registrations
    });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// GET: Get current registration count
export async function GET() {
  try {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("early_access")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      count: (count || 0) + 47,
    });
  } catch {
    return NextResponse.json({ count: 47 });
  }
}
