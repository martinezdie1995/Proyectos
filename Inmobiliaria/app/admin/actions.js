"use server";

import { redirect } from "next/navigation";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase/authenticated-server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function loginAdmin(_previousState, formData) {
  if (!getSupabaseConfig()) {
    return {
      error:
        "El acceso todavía no está configurado. Completá las variables de Supabase en .env.local.",
    };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length === 0
  ) {
    return { error: "Ingresá un email y una contraseña válidos." };
  }

  const supabase = await createAuthenticatedSupabaseClient({
    writeCookies: true,
  });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { error: "No pudimos iniciar sesión con esos datos." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw new Error("No se pudo cerrar la sesión sin permisos.");
    }

    return {
      error: profileError
        ? "No pudimos verificar los permisos de esta cuenta."
        : "Esta cuenta no tiene permisos de administración.",
    };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createAuthenticatedSupabaseClient({
    writeCookies: true,
  });
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("No se pudo cerrar la sesión de administración.");
  }

  redirect("/admin/login");
}
