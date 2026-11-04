import { createAuthenticatedSupabaseClient } from "@/lib/supabase/authenticated-server";

export async function getAdminSession({ writeCookies = false } = {}) {
  const supabase = await createAuthenticatedSupabaseClient({ writeCookies });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("No se pudo verificar la sesión de administración.");
  }

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("No se pudo verificar el permiso de administración.");
  }

  if (profile?.role !== "admin") {
    return null;
  }

  return { supabase, profile, user };
}
