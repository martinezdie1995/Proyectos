import Link from "next/link";
import { connection } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import AdminLoginForm from "@/components/admin-login-form";

export const metadata = {
  title: "Acceso de administración",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminLoginPage({ searchParams }) {
  await connection();
  const params = await searchParams;
  const isConfigured = Boolean(getSupabaseConfig());

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.8fr_1.2fr]">
      <section className="flex flex-col justify-between bg-brand-dark px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-12">
        <Link
          className="w-fit text-sm font-semibold tracking-wide text-white"
          href="/"
        >
          Inmobiliaria
        </Link>
        <div className="my-16 max-w-md">
          <p className="text-sm text-white/70">Administración</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Todo lo importante, en un solo lugar.
          </h1>
          <p className="mt-5 max-w-sm leading-7 text-white/75">
            Gestioná el catálogo y las consultas de la inmobiliaria desde un
            espacio privado.
          </p>
        </div>
        <p className="text-xs text-white/55">
          Acceso reservado para administradores autorizados.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold text-brand-primary">
            Panel privado
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">
            Iniciar sesión
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Usá las credenciales de tu cuenta administradora.
          </p>

          {params.error === "unauthorized" && (
            <p
              className="mt-6 border-l-4 border-brand-accent bg-white px-4 py-3 text-sm leading-6"
              role="alert"
            >
              Esta cuenta no tiene permisos de administración.
            </p>
          )}

          {params.setup === "required" && isConfigured && (
            <p
              className="mt-6 border-l-4 border-brand-primary bg-white px-4 py-3 text-sm leading-6"
              role="status"
            >
              Para ingresar, la cuenta debe existir en Supabase Auth y tener un
              perfil con rol de administrador.
            </p>
          )}

          {!isConfigured ? (
            <div
              className="mt-8 border border-border bg-white p-5 text-sm leading-6"
              role="status"
            >
              <p className="font-semibold text-foreground">
                Falta conectar Supabase
              </p>
              <p className="mt-2 text-muted">
                Copiá <code>.env.example</code> como <code>.env.local</code> y
                completá la URL y la clave publicable de tu proyecto. No
                agregues una clave service role al navegador.
              </p>
            </div>
          ) : (
            <AdminLoginForm />
          )}
        </div>
      </section>
    </main>
  );
}
