import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function checkStagingAuth(request: NextRequest): NextResponse | null {
  const isPreview = process.env.VERCEL_ENV === "preview";
  const stagingPassword = process.env.STAGING_PASSWORD;

  if (!isPreview || !stagingPassword) {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [, password] = decoded.split(":");
      if (password === stagingPassword) {
        return null;
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staging Environment"',
    },
  });
}

export async function middleware(request: NextRequest) {
  const stagingBlock = checkStagingAuth(request);
  if (stagingBlock) {
    return stagingBlock;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.svg
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
