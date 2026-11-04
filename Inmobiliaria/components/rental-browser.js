"use client";

import { useMemo, useState } from "react";
import RentalCard from "@/components/rental-card";

const initialFilters = {
  search: "",
  propertyType: "all",
  bedrooms: "any",
  bathrooms: "any",
  guests: "any",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  sort: "recommended",
};

function filterRentals(rentals, filters) {
  const search = filters.search.trim().toLocaleLowerCase("es");
  const minimumPrice =
    filters.minPrice === "" ? null : Number(filters.minPrice);
  const maximumPrice =
    filters.maxPrice === "" ? null : Number(filters.maxPrice);
  const minimumGuests =
    filters.guests === "any" ? 0 : Number(filters.guests);
  const minimumBedrooms =
    filters.bedrooms === "any" ? 0 : Number(filters.bedrooms);
  const minimumBathrooms =
    filters.bathrooms === "any" ? 0 : Number(filters.bathrooms);
  const minimumArea = filters.minArea === "" ? null : Number(filters.minArea);

  const matches = rentals.filter((rental) => {
    const matchesSearch =
      search === "" ||
      `${rental.title} ${rental.location}`
        .toLocaleLowerCase("es")
        .includes(search);
    const matchesType =
      filters.propertyType === "all" ||
      rental.propertyType === filters.propertyType;
    const matchesBedrooms = rental.bedrooms >= minimumBedrooms;
    const matchesBathrooms = rental.bathrooms >= minimumBathrooms;
    const matchesGuests = rental.guests >= minimumGuests;
    const matchesMinimumPrice =
      minimumPrice === null || rental.priceAmount >= minimumPrice;
    const matchesPrice =
      maximumPrice === null || rental.priceAmount <= maximumPrice;
    const matchesArea = minimumArea === null || rental.areaM2 >= minimumArea;

    return (
      matchesSearch &&
      matchesType &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesGuests &&
      matchesMinimumPrice &&
      matchesPrice &&
      matchesArea
    );
  });

  if (filters.sort === "newest") {
    return matches.sort((first, second) =>
      (second.publicationDate ?? second.sampleDate).localeCompare(
        first.publicationDate ?? first.sampleDate,
      ),
    );
  }

  if (filters.sort === "price-asc") {
    return matches.sort((first, second) => first.priceAmount - second.priceAmount);
  }

  if (filters.sort === "price-desc") {
    return matches.sort((first, second) => second.priceAmount - first.priceAmount);
  }

  if (filters.sort === "area-desc") {
    return matches.sort((first, second) => second.areaM2 - first.areaM2);
  }

  return matches;
}

export default function RentalBrowser({ rentals }) {
  const [filters, setFilters] = useState(initialFilters);
  const filteredRentals = useMemo(
    () => filterRentals(rentals, filters),
    [rentals, filters],
  );

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  return (
    <>
      <section
        aria-label="Filtros de alquileres"
        className="mb-10 border border-border bg-white p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium">
            Buscar por nombre o zona
            <input
              autoComplete="off"
              className="min-h-12 border border-border bg-white px-3 font-normal outline-offset-2"
              name="search"
              onChange={updateFilter}
              placeholder="Ej.: Departamento o Costa"
              type="search"
              value={filters.search}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Tipo de alojamiento
            <select
              className="min-h-12 border border-border bg-white px-3 font-normal outline-offset-2"
              name="propertyType"
              onChange={updateFilter}
              value={filters.propertyType}
            >
              <option value="all">Todos los tipos</option>
              <option value="Departamento">Departamento</option>
              <option value="Casa">Casa</option>
              <option value="Cabaña">Cabaña</option>
              <option value="Loft">Loft</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Huéspedes
            <select
              className="min-h-12 border border-border bg-white px-3 font-normal outline-offset-2"
              name="guests"
              onChange={updateFilter}
              value={filters.guests}
            >
              <option value="any">Cualquier cantidad</option>
              <option value="2">2 o más</option>
              <option value="4">4 o más</option>
              <option value="6">6 o más</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Dormitorios
            <select
              className="min-h-12 border border-border bg-white px-3 font-normal outline-offset-2"
              name="bedrooms"
              onChange={updateFilter}
              value={filters.bedrooms}
            >
              <option value="any">Cualquier cantidad</option>
              <option value="1">1 o más</option>
              <option value="2">2 o más</option>
              <option value="3">3 o más</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Baños
            <select
              className="min-h-12 border border-border bg-white px-3 font-normal outline-offset-2"
              name="bathrooms"
              onChange={updateFilter}
              value={filters.bathrooms}
            >
              <option value="any">Cualquier cantidad</option>
              <option value="1">1 o más</option>
              <option value="2">2 o más</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Superficie mínima
            <span className="flex min-h-12 items-center border border-border px-3">
              <input
                className="min-w-0 flex-1 bg-transparent font-normal outline-offset-2"
                min="0"
                name="minArea"
                onChange={updateFilter}
                placeholder="Sin mínimo"
                type="number"
                value={filters.minArea}
              />
              <span className="ml-2 text-xs text-muted">m²</span>
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Precio mínimo
            <span className="flex min-h-12 items-center border border-border px-3">
              <span aria-hidden="true" className="mr-2 text-muted">
                $
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent font-normal outline-offset-2"
                min="0"
                name="minPrice"
                onChange={updateFilter}
                placeholder="Sin mínimo"
                type="number"
                value={filters.minPrice}
              />
              <span className="ml-2 text-xs text-muted">ARS</span>
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Precio máximo
            <span className="flex min-h-12 items-center border border-border px-3">
              <span aria-hidden="true" className="mr-2 text-muted">
                $
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent font-normal outline-offset-2"
                min="0"
                name="maxPrice"
                onChange={updateFilter}
                placeholder="Sin límite"
                type="number"
                value={filters.maxPrice}
              />
              <span className="ml-2 text-xs text-muted">ARS</span>
            </span>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-muted">
            {filteredRentals.length}{" "}
            {filteredRentals.length === 1 ? "alojamiento" : "alojamientos"}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 text-sm font-medium">
              Ordenar por
              <select
                className="min-h-11 border border-border bg-white px-3 font-normal"
                name="sort"
                onChange={updateFilter}
                value={filters.sort}
              >
                <option value="recommended">Recomendados</option>
                <option value="newest">Más recientes</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="area-desc">Mayor superficie</option>
              </select>
            </label>
            <button
              className="min-h-11 border border-brand-primary px-4 text-sm font-semibold text-brand-primary transition-colors hover:bg-background"
              onClick={clearFilters}
              type="button"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>
      {filteredRentals.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} />
          ))}
        </div>
      ) : (
        <div
          className="border border-border bg-white px-6 py-12 text-center sm:px-10"
          role="status"
        >
          <h2 className="text-xl font-semibold">
            No encontramos alojamientos
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Probá cambiar los filtros para encontrar otras opciones.
          </p>
          <button
            className="mt-6 min-h-11 bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:brightness-110"
            onClick={clearFilters}
            type="button"
          >
            Ver todos los alojamientos
          </button>
        </div>
      )}
    </>
  );
}
