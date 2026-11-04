import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin-session";
import DeletePropertyButton from "@/components/delete-property-button";

export const metadata = {
  title: "Propiedades | Administración",
  robots: { index: false, follow: false },
};

export const instant = false;

const operationNames = {
  sale: "Venta",
  rent: "Alquiler",
  seasonal_rent: "Alquiler de temporada",
};

const statusNames = {
  draft: "Borrador",
  published: "Publicada",
  reserved: "Reservada",
  sold: "Vendida",
  rented: "Alquilada",
  unavailable: "No disponible",
};

const statusFilters = {
  draft: "Borrador",
  published: "Publicada",
  reserved: "Reservada",
  sold: "Vendida",
  rented: "Alquilada",
  unavailable: "No disponible",
};

const operationFilters = {
  sale: "Venta",
  rent: "Alquiler",
  seasonal_rent: "Alquiler de temporada",
};

function getRelationName(relation) {
  return Array.isArray(relation) ? relation[0]?.name : relation?.name;
}

function getQueryValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function AdminPropertiesPage({ searchParams }) {
  await connection();
  const query = await searchParams;
  const search = getQueryValue(query.q);
  const selectedStatus = Object.hasOwn(statusFilters, query.status)
    ? query.status
    : "";
  const selectedOperation = Object.hasOwn(operationFilters, query.operation)
    ? query.operation
    : "";
  const adminSession = await getAdminSession();

  if (!adminSession) {
    redirect("/admin/login?error=unauthorized");
  }

  const { supabase } = adminSession;
  const { data: properties, error } = await supabase
    .from("properties")
    .select(
      "id, slug, title, status, operation, price, currency, is_demo, property_types(name), locations(name), property_images(id, storage_path, is_cover)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No se pudieron cargar las propiedades.");
  }

  const normalizedSearch = search.toLocaleLowerCase("es-AR");
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        property.title,
        getRelationName(property.locations),
        getRelationName(property.property_types),
      ].some((value) =>
        value?.toLocaleLowerCase("es-AR").includes(normalizedSearch),
      );

    return (
      matchesSearch &&
      (!selectedStatus || property.status === selectedStatus) &&
      (!selectedOperation || property.operation === selectedOperation)
    );
  });

  const propertyCards = await Promise.all(
    filteredProperties.map(async (property) => {
      const cover =
        property.property_images.find((image) => image.is_cover) ??
        property.property_images[0];

      if (!cover) {
        return { ...property, coverUrl: null };
      }

      const { data, error: imageError } = await supabase.storage
        .from("property-images")
        .createSignedUrl(cover.storage_path, 3600);

      if (imageError) {
        throw new Error("No se pudo cargar una fotografía de propiedad.");
      }

      return { ...property, coverUrl: data.signedUrl };
    }),
  );

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <section>
          <p className="text-sm font-semibold text-brand-primary">
            Catálogo privado
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Propiedades
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Creá y actualizá las publicaciones de la inmobiliaria.
          </p>
        </section>
        <Link
          className="inline-flex min-h-12 items-center justify-center bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          href="/admin/propiedades/nueva"
        >
          Nueva propiedad
        </Link>
      </div>

      {query.cleanup === "failed" && (
        <p
          className="mt-6 border-l-4 border-brand-accent bg-white px-5 py-4 text-sm leading-6"
          role="alert"
        >
          La propiedad se eliminó, pero no se pudieron limpiar todos los
          archivos de Storage. Revisá el bucket de fotografías.
        </p>
      )}

      <form
        action="/admin/propiedades"
        className="mt-8 grid gap-4 border border-border bg-white p-5 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_12rem_14rem_auto] lg:items-end"
        role="search"
      >
        <label className="grid gap-2 text-sm font-medium">
          Buscar propiedad
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={search}
            name="q"
            placeholder="Título, localidad o tipo"
            type="search"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Estado
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={selectedStatus}
            name="status"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusFilters).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Operación
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={selectedOperation}
            name="operation"
          >
            <option value="">Todas las operaciones</option>
            {Object.entries(operationFilters).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="min-h-12 bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          type="submit"
        >
          Buscar
        </button>
      </form>

      <p className="mt-5 text-sm text-muted" role="status">
        Mostrando {propertyCards.length} de {properties.length} propiedades
      </p>

      {properties.length === 0 ? (
        <section
          className="mt-10 border border-border bg-white px-6 py-14 text-center"
          role="status"
        >
          <h2 className="text-xl font-semibold">Todavía no hay propiedades</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Creá la primera publicación para comenzar a organizar el catálogo.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center bg-brand-primary px-5 text-sm font-semibold text-white"
            href="/admin/propiedades/nueva"
          >
            Crear propiedad
          </Link>
        </section>
      ) : propertyCards.length === 0 ? (
        <section
          className="mt-5 border border-border bg-white px-6 py-12 text-center"
          role="status"
        >
          <h2 className="text-xl font-semibold">
            No encontramos propiedades con esos filtros
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Probá con otro término o quitá alguno de los filtros.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center border border-brand-primary px-5 text-sm font-semibold text-brand-primary"
            href="/admin/propiedades"
          >
            Limpiar filtros
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid gap-4">
          {propertyCards.map((property) => (
            <article
              className="grid gap-4 border border-border bg-white p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:p-5"
              key={property.id}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background sm:aspect-[4/3]">
                {property.coverUrl ? (
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="180px"
                    src={property.coverUrl}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
                    Sin fotografías
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-primary">
                  {statusNames[property.status]} ·{" "}
                  {operationNames[property.operation]}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{property.title}</h2>
                {property.is_demo && (
                  <p className="mt-1 text-xs font-semibold text-brand-accent">
                    Registro de prueba · no se publica
                  </p>
                )}
                <p className="mt-1 text-sm text-muted">
                  {getRelationName(property.property_types)} ·{" "}
                  {getRelationName(property.locations)}
                </p>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {property.currency}{" "}
                  {Number(property.price).toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-stretch">
                <Link
                  className="inline-flex min-h-10 items-center justify-center border border-brand-primary px-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-background"
                  href={`/admin/propiedades/${property.id}`}
                >
                  Editar
                </Link>
                <DeletePropertyButton propertyId={property.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
