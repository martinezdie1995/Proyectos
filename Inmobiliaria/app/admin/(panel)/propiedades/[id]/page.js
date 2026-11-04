import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getAdminSession } from "@/lib/supabase/admin-session";
import AdminImageUploadForm from "@/components/admin-image-upload-form";
import AdminPropertyForm from "@/components/admin-property-form";
import DeletePropertyButton from "@/components/delete-property-button";
import PropertyImageControls from "@/components/property-image-controls";

export const metadata = {
  title: "Editar propiedad | Administración",
  robots: { index: false, follow: false },
};

export const instant = false;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPropertyPage({ params, searchParams }) {
  await connection();
  const { id } = await params;
  const query = await searchParams;

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const adminSession = await getAdminSession();

  if (!adminSession) {
    redirect("/admin/login?error=unauthorized");
  }

  const { supabase } = adminSession;
  const [propertyResult, typesResult] = await Promise.all([
    supabase
      .from("properties")
      .select(
        "*, property_types(name), locations(name, region, country), property_images(id, storage_path, alt_text, sort_order, is_cover)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("property_types").select("id, name").order("name"),
  ]);

  if (propertyResult.error || typesResult.error) {
    throw new Error("No se pudo cargar la información de la propiedad.");
  }

  if (!propertyResult.data) {
    notFound();
  }

  const property = propertyResult.data;
  const images = await Promise.all(
    [...property.property_images]
      .sort((first, second) => first.sort_order - second.sort_order)
      .map(async (image) => {
        const { data, error } = await supabase.storage
          .from("property-images")
          .createSignedUrl(image.storage_path, 3600);

        if (error) {
          throw new Error("No se pudo cargar una fotografía de propiedad.");
        }

        return { ...image, signedUrl: data.signedUrl };
      }),
  );

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        className="text-sm font-semibold text-brand-primary hover:underline"
        href="/admin/propiedades"
      >
        Volver a propiedades
      </Link>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <section>
          <p className="text-sm font-semibold text-brand-primary">
            Editando publicación
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {property.title}
          </h1>
        </section>
        <DeletePropertyButton propertyId={property.id} />
      </div>

      <AdminPropertyForm
        property={property}
        propertyTypes={typesResult.data}
      />

      <section aria-labelledby="gallery-title" className="mt-14">
        <p className="text-sm font-semibold text-brand-primary">Galería</p>
        <h2
          className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl"
          id="gallery-title"
        >
          Fotografías de la propiedad
        </h2>
        <AdminImageUploadForm propertyId={property.id} />

        {query.cleanup === "failed" && (
          <p
            className="mt-4 border-l-4 border-brand-accent bg-white px-5 py-4 text-sm leading-6"
            role="alert"
          >
            La fotografía se quitó de la galería, pero no se pudo limpiar el
            archivo de Storage. Revisá el bucket de fotografías.
          </p>
        )}

        {query.photos === "uploaded" && (
          <p className="mt-4 text-sm font-medium text-brand-primary" role="status">
            Las fotografías se subieron correctamente.
          </p>
        )}

        {images.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <article
                className="border border-border bg-white"
                key={image.id}
              >
                <div className="relative aspect-[4/3] bg-background">
                  <Image
                    alt={image.alt_text}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={image.signedUrl}
                    unoptimized
                  />
                  {image.is_cover && (
                    <span className="absolute left-3 top-3 bg-brand-dark px-3 py-2 text-xs font-semibold text-white">
                      Foto principal
                    </span>
                  )}
                </div>
                <div className="grid gap-3 p-4">
                  <p className="min-h-5 text-sm text-muted">
                    {image.alt_text || "Sin descripción"}
                  </p>
                  <PropertyImageControls
                    imageId={image.id}
                    isCover={image.is_cover}
                    propertyId={property.id}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p
            className="mt-6 border border-border bg-white px-5 py-8 text-sm leading-6 text-muted"
            role="status"
          >
            Todavía no hay fotografías. Subí imágenes para completar la ficha.
          </p>
        )}
      </section>
    </main>
  );
}
