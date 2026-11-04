import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function proxy(request) {
  const config = getSupabaseConfig();

  if (!config) {
    if (request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(
        new URL("/admin/login?setup=required", request.url),
      );
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
