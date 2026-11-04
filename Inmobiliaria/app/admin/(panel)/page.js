import Link from "next/link";
import { connection } from "next/server";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase/authenticated-server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminDashboardPage() {
  await connection();

  if (!getSupabaseConfig()) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-sm font-semibold text-brand-primary">
          Configuración pendiente
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Conectá Supabase para abrir el panel.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Completá la URL y la clave publicable en <code>.env.local</code>. El
          panel mostrará métricas cuando pueda consultar tu proyecto.
        </p>
      </main>
    );
  }

  const supabase = await createAuthenticatedSupabaseClient();
  const results = await Promise.all([
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_demo", false),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("operation", "sale")
      .eq("is_demo", false),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .in("operation", ["rent", "seasonal_rent"])
      .eq("is_demo", false),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "reserved")
      .eq("is_demo", false),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "sold")
      .eq("is_demo", false),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("is_demo", true),
  ]);
  const failedQuery = results.find(({ error }) => error);

  if (failedQuery?.error) {
    throw new Error("No se pudieron cargar las métricas de administración.");
  }

  const metrics = [
    { label: "Propiedades en el panel", count: results[0].count },
    { label: "Publicadas", count: results[1].count },
    { label: "En venta", count: results[2].count },
    { label: "En alquiler", count: results[3].count },
    { label: "Reservadas", count: results[4].count },
    { label: "Vendidas", count: results[5].count },
    { label: "Consultas recibidas", count: results[6].count },
    { label: "Contenido de referencia", count: results[7].count },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <section aria-labelledby="dashboard-title">
        <p className="text-sm font-semibold text-brand-primary">
          Resumen de actividad
        </p>
        <h1
          className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl"
          id="dashboard-title"
        >
          El estado de tu inmobiliaria.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          El total incluye el contenido de referencia visible en el panel; las
          demás métricas de propiedades cuentan solo publicaciones reales.
        </p>
      </section>

      <section
        aria-label="Métricas de propiedades y consultas"
        className="mt-10 grid border-l border-t border-border bg-white sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <div
            className="min-h-36 border-b border-r border-border p-5 sm:p-6"
            key={metric.label}
          >
            <p className="text-sm text-muted">{metric.label}</p>
            <p className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-brand-dark">
              {(metric.count ?? 0).toLocaleString("es-AR")}
            </p>
          </div>
        ))}
      </section>

      <Link
        className="mt-8 inline-flex min-h-12 items-center bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        href="/admin/propiedades"
      >
        Gestionar propiedades
      </Link>
    </main>
  );
}
