import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  getPublishedRentalBySlug,
  getPublishedRentals,
} from "@/lib/properties/public-rentals";
import { sampleRentals } from "@/data/sample-rentals";

export const instant = false;

export function generateStaticParams() {
  return sampleRentals.map((rental) => ({ slug: rental.id }));
}

export async function generateMetadata({ params }) {
  await connection();
  const { slug } = await params;
  const rental =
    (await getPublishedRentalBySlug(slug)) ??
    sampleRentals.find((item) => item.id === slug);

  if (!rental) {
    return {
      title: "Alojamiento no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const metadata = {
    title: `${rental.title} - Alquileres de temporada`,
    description: rental.description,
    alternates: { canonical: `/alquileres/${rental.id}` },
  };

  return rental.isReference
    ? { ...metadata, robots: { index: false, follow: false } }
    : metadata;
}

export default async function RentalDetailPage({ params }) {
  await connection();
  const { slug } = await params;
  const rental =
    (await getPublishedRentalBySlug(slug)) ??
    sampleRentals.find((item) => item.id === slug);

  if (!rental) {
    notFound();
  }

  const gallery =
    rental.gallery ??
    (rental.image
      ? [{ id: rental.id, url: rental.image, alt: rental.imageAlt }]
      : []);
  const otherRentals = rental.isReference
    ? sampleRentals.filter((item) => item.id !== rental.id)
    : (await getPublishedRentals())
        ?.filter((item) => item.id !== rental.id)
        .slice(0, 3) ?? [];

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-foreground"
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main className="min-h-[70vh] bg-background" id="contenido">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
          <Link
            className="text-sm font-semibold text-brand-primary hover:underline"
            href="/alquileres"
          >
            Volver a los alquileres
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
            <div>
              {gallery.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {gallery.map((image, index) => (
                    <div
                      className={`relative aspect-[4/3] overflow-hidden bg-border ${
                        index === 0 ? "sm:col-span-2 sm:aspect-[16/10]" : ""
                      }`}
                      key={image.id}
                    >
                      <Image
                        alt={image.alt}
                        className="object-cover"
                        fill
                        priority={index === 0}
                        sizes={
                          index === 0
                            ? "(max-width: 1024px) 100vw, 65vw"
                            : "(max-width: 640px) 100vw, 32vw"
                        }
                        src={image.url}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-brand-dark/5 px-6 text-center text-sm text-muted sm:aspect-[16/10]">
                  Fotografías próximamente
                </div>
              )}
              {rental.isReference && (
                <p className="mt-3 border-l-2 border-brand-accent pl-4 text-xs leading-5 text-muted">
                  Contenido de referencia. Las imágenes son ilustrativas y no
                  corresponden a una publicación real.
                </p>
              )}
            </div>

            <section aria-labelledby="rental-title">
              <p className="text-sm font-semibold text-brand-primary">
                {rental.propertyType} · Alquiler
              </p>
              <h1
                className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl"
                id="rental-title"
              >
                {rental.title}
              </h1>
              <p className="mt-3 text-sm text-muted">{rental.location}</p>
              <p className="mt-7 text-2xl font-semibold text-brand-primary">
                {rental.price}
              </p>
              <p className="mt-1 text-sm text-muted">{rental.priceUnit}</p>

              <p className="mt-7 leading-7 text-foreground">
                {rental.description}
              </p>

              <h2 className="mt-8 border-t border-border pt-6 text-lg font-semibold">
                Características
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <div className="border border-border bg-white p-4">
                  <dt className="text-xs text-muted">Dormitorios</dt>
                  <dd className="mt-1 font-semibold">{rental.bedrooms}</dd>
                </div>
                <div className="border border-border bg-white p-4">
                  <dt className="text-xs text-muted">Baños</dt>
                  <dd className="mt-1 font-semibold">{rental.bathrooms}</dd>
                </div>
                <div className="border border-border bg-white p-4">
                  <dt className="text-xs text-muted">Huéspedes</dt>
                  <dd className="mt-1 font-semibold">
                    {rental.guests ?? "No especificado"}
                  </dd>
                </div>
                <div className="border border-border bg-white p-4">
                  <dt className="text-xs text-muted">Superficie</dt>
                  <dd className="mt-1 font-semibold">
                    {rental.areaM2 ? `${rental.areaM2} m²` : "No especificada"}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-muted">
                Un espacio pensado para descansar y disfrutar de la costa a tu
                manera.
              </p>
            </section>
          </div>

          {otherRentals.length > 0 && (
            <section aria-labelledby="other-rentals-title" className="mt-16">
              <h2
                className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl"
                id="other-rentals-title"
              >
                Más alojamientos
              </h2>
              <p className="mt-3 text-sm text-muted">
                Descubrí más opciones para tu próxima estadía.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {otherRentals.map((item) => (
                  <Link
                    className="border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-primary hover:border-brand-primary"
                    href={`/alquileres/${item.id}`}
                    key={item.id}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
