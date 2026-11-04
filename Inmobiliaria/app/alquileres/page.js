import Link from "next/link";
import { connection } from "next/server";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import RentalBrowser from "@/components/rental-browser";
import { getPublishedRentals } from "@/lib/properties/public-rentals";
import { sampleRentals } from "@/data/sample-rentals";

export const metadata = {
  title: "Alquileres de temporada",
  description:
    "Explorá casas y departamentos para tus próximas vacaciones cerca del mar.",
  alternates: { canonical: "/alquileres" },
};

export const instant = false;

export default async function RentalsPage() {
  await connection();
  const publishedRentals = await getPublishedRentals();
  const rentals =
    publishedRentals?.length > 0 ? publishedRentals : sampleRentals;
  const showingReferenceContent = !publishedRentals?.length;

  return (
    <>
      <Link
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-foreground"
        href="#contenido"
      >
        Saltar al contenido
      </Link>
      <SiteHeader />
      <main className="min-h-[70vh] bg-background" id="contenido">
        <section
          aria-labelledby="rentals-title"
          className="bg-brand-dark px-5 py-16 text-white sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-medium text-white/75">
              Alquileres de temporada
            </p>
            <h1
              className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl"
              id="rentals-title"
            >
              Unos días cerca del mar empiezan con el lugar indicado.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Encontrá casas y departamentos para descansar, disfrutar la costa
              y vivir tus próximas vacaciones a tu manera.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="rental-list-title"
          className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">
                Alquileres de temporada
              </p>
              <h2
                className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
                id="rental-list-title"
              >
                Alojamientos para disfrutar la costa
              </h2>
            </div>
          </div>
          {showingReferenceContent && (
            <p className="mt-6 max-w-2xl border-l-2 border-brand-accent pl-4 text-sm leading-6 text-muted">
              Mientras se publican los alojamientos, se muestra contenido de
              referencia con imágenes ilustrativas.
            </p>
          )}
          <div className="mt-8">
            <RentalBrowser rentals={rentals} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
