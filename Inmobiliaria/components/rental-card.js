import Image from "next/image";
import Link from "next/link";

export default function RentalCard({ rental }) {
  return (
    <article className="overflow-hidden border border-border bg-white">
      <Link
        aria-label={`Ver detalles de ${rental.title}`}
        className="group block focus-visible:outline-offset-[-3px]"
        href={`/alquileres/${rental.id}`}
      >
        <div className="relative aspect-[4/3] bg-border">
          {rental.image ? (
            <Image
              alt={rental.imageAlt}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={rental.image}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-dark/5 px-6 text-center text-sm text-muted">
              Fotografías próximamente
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-sm text-muted">{rental.location}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] group-hover:text-brand-primary">
            {rental.title}
          </h3>
          <p className="mt-4 text-lg font-semibold text-brand-primary">
            {rental.price}
          </p>
          <p className="text-xs text-muted">{rental.priceUnit}</p>
          <ul
            aria-label={`Características de ${rental.title}`}
            className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs leading-5 text-foreground sm:text-sm"
          >
            <li>{rental.bedrooms} dormitorios</li>
            <li>{rental.bathrooms} baños</li>
            {rental.areaM2 && <li>{rental.areaM2} m²</li>}
            {rental.details.slice(1).map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          {rental.isReference && (
            <p className="mt-4 text-xs font-medium text-brand-accent">
              Contenido de referencia · imagen ilustrativa
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
