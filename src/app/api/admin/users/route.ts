import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/supabase/middleware";

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

// GET: Fetch early access registrations and registered users
export async function GET() {
  try {
    const supabase = getSupabase();

    // Admin authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // Fetch early access registrations
    const { data: earlyAccess, error: earlyError } = await supabase
      .from("early_access")
      .select("*")
      .order("created_at", { ascending: false });

    if (earlyError) {
      console.error("Early access fetch error:", earlyError);
    }

    // Fetch registered users (profiles table)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Profiles fetch error:", profilesError);
    }

    return NextResponse.json({
      earlyAccess: earlyAccess || [],
      profiles: profiles || [],
    });
  } catch {
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
