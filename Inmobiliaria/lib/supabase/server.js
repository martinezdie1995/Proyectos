import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function createPublicSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabase no está configurado. Copiá .env.example a .env.local y agregá los datos de tu proyecto.",
    );
  }

  return createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
