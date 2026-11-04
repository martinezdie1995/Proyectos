import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import RentalCard from "@/components/rental-card";
import InquiryForm from "@/components/inquiry-form";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getPublishedRentals } from "@/lib/properties/public-rentals";
import { sampleRentals } from "@/data/sample-rentals";

export const metadata = {
  alternates: { canonical: "/" },
};

export const instant = false;

export default async function Home() {
  await connection();
  const publishedRentals = await getPublishedRentals();
  const rentals =
    publishedRentals?.length > 0 ? publishedRentals.slice(0, 3) : sampleRentals;
  const showingReferenceContent = !publishedRentals?.length;
  const hasInquiryConfiguration = Boolean(getSupabaseConfig());

  return (
    <>
      <Link
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-foreground"
        href="#contenido"
      >
        Saltar al contenido
      </Link>
      <SiteHeader />
      <main id="contenido">
        <section
          aria-labelledby="hero-title"
          className="relative isolate flex min-h-[620px] items-center bg-brand-dark text-white sm:min-h-[690px]"
          id="inicio"
        >
          <Image
            alt=""
            className="absolute inset-0 -z-20 object-cover"
            fill
            priority
            sizes="100vw"
            src="/images/portada.jpg"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-black/15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/90 via-brand-dark/65 to-brand-dark/25"
          />
          <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
            <div className="max-w-3xl">
              <p className="mb-6 text-sm font-medium tracking-wide text-white/85">
                Alquileres de temporada cerca del mar
              </p>
              <h1
                className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
                id="hero-title"
              >
                Tus días de playa empiezan acá.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                Descubrí casas y departamentos para disfrutar la costa a tu
                manera.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-13 items-center justify-center bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                  href="/alquileres"
                >
                  Ver alquileres
                </Link>
                <a
                  className="inline-flex min-h-13 items-center justify-center border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  href="#nosotros"
                >
                  Conocé la inmobiliaria
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="properties-title"
          className="bg-white px-5 py-20 sm:px-8 sm:py-28"
          id="propiedades"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-primary">
                Alquileres de temporada
              </p>
              <h2
                className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl"
                id="properties-title"
              >
                Tu descanso, cerca del mar.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
                Conocé alojamientos publicados para disfrutar de tu próxima
                estadía junto al mar.
              </p>
            </div>

            {showingReferenceContent && (
              <p className="mt-6 max-w-2xl border-l-2 border-brand-accent pl-4 text-sm leading-6 text-muted">
                Mientras se publican los alojamientos, esta sección muestra
                contenido de referencia con imágenes ilustrativas.
              </p>
            )}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="about-title"
          className="bg-background px-5 py-20 sm:px-8 sm:py-28"
          id="nosotros"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-sm font-semibold text-brand-primary">
                La inmobiliaria
              </p>
              <h2
                className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl"
                id="about-title"
              >
                Cada búsqueda tiene su propia historia.
              </h2>
            </div>
            <div className="max-w-2xl lg:pt-10">
              <p className="text-lg leading-8 text-foreground sm:text-xl sm:leading-9">
                Una escapada empieza mucho antes de llegar a la playa: empieza
                al encontrar un lugar donde bajar el ritmo y disfrutar.
              </p>
              <p className="mt-5 text-base leading-7 text-muted">
                Estamos construyendo un espacio para acercarte alquileres
                temporarios en la costa. También podrás consultar por otras
                propiedades cuando se cargue el catálogo.
              </p>
              <a
                className="mt-8 inline-flex min-h-12 items-center border-b-2 border-brand-accent text-sm font-semibold text-foreground transition-colors hover:text-brand-accent"
                href="#contacto"
              >
                Conocé cómo contactarnos
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-title"
          className="bg-brand-dark px-5 py-20 text-white sm:px-8 sm:py-24"
          id="contacto"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/70">
                Estamos para acompañarte
              </p>
              <h2
                className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl"
                id="contact-title"
              >
                Empezá a planear tu próxima escapada.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
                Escribinos para conocer más sobre nuestros alojamientos y
                servicios.
              </p>
            </div>
            {hasInquiryConfiguration ? (
              <div className="w-full max-w-xl">
                <InquiryForm />
              </div>
            ) : (
              <p className="border-l-2 border-brand-accent pl-4 text-sm leading-6 text-white/75">
                El formulario de contacto estará disponible próximamente.
              </p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
