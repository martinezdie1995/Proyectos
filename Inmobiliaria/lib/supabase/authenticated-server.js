import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function createAuthenticatedSupabaseClient({
  writeCookies = false,
} = {}) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabase no está configurado. Copiá .env.example a .env.local y agregá los datos de tu proyecto.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      ...(writeCookies && {
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      }),
    },
  });
}
