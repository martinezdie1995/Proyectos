"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProperty } from "@/app/admin/(panel)/propiedades/actions";

const initialState = { error: "" };

export default function AdminPropertyForm({ property, propertyTypes }) {
  const [state, formAction, pending] = useActionState(
    saveProperty,
    initialState,
  );
  const location = property?.locations;

  return (
    <form action={formAction} className="mt-8 grid gap-8">
      <input name="id" type="hidden" value={property?.id ?? ""} />

      <section
        aria-labelledby="property-info-title"
        className="grid gap-5 border border-border bg-white p-5 sm:grid-cols-2 sm:p-7"
      >
        <h2
          className="text-xl font-semibold sm:col-span-2"
          id="property-info-title"
        >
          Información de la propiedad
        </h2>
        <label className="grid gap-2 text-sm font-medium">
          Título
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.title ?? ""}
            maxLength={180}
            minLength={5}
            name="title"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          URL amigable
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.slug ?? ""}
            maxLength={180}
            name="slug"
            placeholder="Se genera desde el título si queda vacío"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Descripción
          <textarea
            className="min-h-36 border border-border px-3 py-3 font-normal"
            defaultValue={property?.description ?? ""}
            maxLength={10000}
            name="description"
            rows={5}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Tipo de propiedad
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={property?.property_type_id ?? propertyTypes[0]?.id}
            name="property_type_id"
            required
          >
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Operación
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={property?.operation ?? "seasonal_rent"}
            name="operation"
          >
            <option value="seasonal_rent">Alquiler de temporada</option>
            <option value="rent">Alquiler</option>
            <option value="sale">Venta</option>
          </select>
        </label>
      </section>

      <section
        aria-labelledby="property-location-title"
        className="grid gap-5 border border-border bg-white p-5 sm:grid-cols-3 sm:p-7"
      >
        <h2
          className="text-xl font-semibold sm:col-span-3"
          id="property-location-title"
        >
          Ubicación
        </h2>
        <label className="grid gap-2 text-sm font-medium">
          Localidad
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={location?.name ?? ""}
            maxLength={120}
            name="location"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Provincia o región
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={location?.region ?? ""}
            maxLength={120}
            name="region"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          País
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={location?.country ?? "Argentina"}
            maxLength={120}
            name="country"
            required
          />
        </label>
      </section>

      <section
        aria-labelledby="property-price-title"
        className="grid gap-5 border border-border bg-white p-5 sm:grid-cols-3 sm:p-7"
      >
        <h2
          className="text-xl font-semibold sm:col-span-3"
          id="property-price-title"
        >
          Precio y características
        </h2>
        <label className="grid gap-2 text-sm font-medium">
          Precio
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.price ?? ""}
            min="0"
            name="price"
            required
            step="0.01"
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Moneda
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={property?.currency ?? "ARS"}
            name="currency"
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Precio por
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={property?.price_period ?? "night"}
            name="price_period"
          >
            <option value="night">Noche</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="total">Total</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Dormitorios
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.bedrooms ?? 0}
            min="0"
            max="100"
            name="bedrooms"
            required
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Baños
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.bathrooms ?? 0}
            min="0"
            max="100"
            name="bathrooms"
            required
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Huéspedes
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.guests ?? ""}
            min="1"
            max="200"
            name="guests"
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Superficie (m²)
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.area_m2 ?? ""}
            min="0.01"
            name="area_m2"
            step="0.01"
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Servicios y comodidades
          <input
            className="min-h-12 border border-border px-3 font-normal"
            defaultValue={property?.amenities?.join(", ") ?? ""}
            maxLength={2000}
            name="amenities"
            placeholder="Ej.: Wi-Fi, patio, estacionamiento"
          />
        </label>
      </section>

      <section
        aria-labelledby="property-publish-title"
        className="grid gap-5 border border-border bg-white p-5 sm:grid-cols-2 sm:p-7"
      >
        <h2
          className="text-xl font-semibold sm:col-span-2"
          id="property-publish-title"
        >
          Publicación
        </h2>
        <label className="grid gap-2 text-sm font-medium">
          Estado
          <select
            className="min-h-12 border border-border bg-white px-3 font-normal"
            defaultValue={property?.status ?? "draft"}
            name="status"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicada</option>
            <option value="reserved">Reservada</option>
            <option value="sold">Vendida</option>
            <option value="rented">Alquilada</option>
            <option value="unavailable">No disponible</option>
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-3 text-sm font-medium">
          <input
            defaultChecked={property?.is_featured ?? false}
            name="is_featured"
            type="checkbox"
          />
          Destacar en el catálogo
        </label>
      </section>

      {state.error && (
        <p
          className="border-l-4 border-brand-accent bg-white px-4 py-3 text-sm leading-6"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-12 items-center justify-center border border-border px-5 text-sm font-semibold text-foreground"
          href="/admin/propiedades"
        >
          Cancelar
        </Link>
        <button
          className="min-h-12 bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          {pending ? "Guardando…" : "Guardar propiedad"}
        </button>
      </div>
    </form>
  );
}
