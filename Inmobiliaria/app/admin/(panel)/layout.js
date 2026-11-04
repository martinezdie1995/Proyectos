import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getAdminSession } from "@/lib/supabase/admin-session";

export default async function AdminPanelLayout({ children }) {
  await connection();

  if (!getSupabaseConfig()) {
    redirect("/admin/login?setup=required");
  }

  const adminSession = await getAdminSession();

  if (!adminSession) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold">Inmobiliaria</p>
            <p className="mt-1 text-xs text-white/70">Administración</p>
          </div>
          <div className="flex items-center gap-4">
            <nav aria-label="Administración" className="flex items-center gap-4">
              <Link
                className="text-sm text-white/80 transition-colors hover:text-white"
                href="/admin"
              >
                Resumen
              </Link>
              <Link
                className="text-sm text-white/80 transition-colors hover:text-white"
                href="/admin/propiedades"
              >
                Propiedades
              </Link>
              <Link
                className="text-sm text-white/80 transition-colors hover:text-white"
                href="/admin/consultas"
              >
                Consultas
              </Link>
            </nav>
            <p className="hidden text-sm text-white/80 sm:block">
              {adminSession.profile.full_name}
            </p>
            <form action={logoutAdmin}>
              <button
                className="min-h-10 border border-white/50 px-3 text-sm font-medium transition-colors hover:bg-white/10"
                type="submit"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
