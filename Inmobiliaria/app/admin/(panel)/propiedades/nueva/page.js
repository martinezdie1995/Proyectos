import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin-session";
import AdminPropertyForm from "@/components/admin-property-form";

export const metadata = {
  title: "Nueva propiedad | Administración",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function NewPropertyPage() {
  await connection();
  const adminSession = await getAdminSession();

  if (!adminSession) {
    redirect("/admin/login?error=unauthorized");
  }

  const { data: propertyTypes, error } = await adminSession.supabase
    .from("property_types")
    .select("id, name")
    .order("name");

  if (error) {
    throw new Error("No se pudieron cargar los tipos de propiedad.");
  }

  if (propertyTypes.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="text-3xl font-semibold">Faltan tipos de propiedad</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Aplicá la migración inicial de Supabase para cargar las opciones de
          Casa, Departamento, Cabaña y Loft.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center border border-brand-primary px-4 text-sm font-semibold text-brand-primary"
          href="/admin/propiedades"
        >
          Volver a propiedades
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        className="text-sm font-semibold text-brand-primary hover:underline"
        href="/admin/propiedades"
      >
        Volver a propiedades
      </Link>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
        Nueva propiedad
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Completá la información y guardá la publicación como borrador o
        publicala.
      </p>
      <AdminPropertyForm propertyTypes={propertyTypes} />
    </main>
  );
}
