import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Capture error details that Supabase may include in the redirect
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");

  // Determine the correct origin behind reverse proxy (Vercel, etc.)
  // request.url may contain an internal origin (e.g. localhost) instead of
  // the public domain when running behind a proxy.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : new URL(request.url).origin;

  // If Supabase returned an error (e.g. provider misconfiguration),
  // forward the details to the login page for display.
  if (authError) {
    console.error("[auth/callback] Supabase OAuth error:", authError, authErrorDescription);
    const errorParam = encodeURIComponent(authErrorDescription || authError);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed&detail=${errorParam}`);
  }

  if (code) {
    const cookieStore = cookies();

    // Collect cookies that Supabase wants to set so we can attach them
    // explicitly to the redirect response (cookies().set() alone may not
    // propagate to NextResponse.redirect() in all Next.js versions).
    const pendingCookies: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((cookie) => pendingCookies.push(cookie));
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore — we set them on the redirect response below
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);
      // Explicitly attach auth cookies to the redirect response
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }

    console.error("[auth/callback] Code exchange failed:", error.message);
    const errorParam = encodeURIComponent(error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed&detail=${errorParam}`);
  }

  console.error("[auth/callback] No code or error in callback URL");
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
