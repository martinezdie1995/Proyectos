import { getSupabaseConfig } from "@/lib/supabase/config";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

const rentalSelection =
  "id, slug, title, description, operation, status, price, currency, price_period, bedrooms, bathrooms, guests, area_m2, amenities, published_at, is_featured, property_types(name), locations(name, region), property_images(id, storage_path, alt_text, sort_order, is_cover)";

const pricePeriods = {
  night: "por noche",
  week: "por semana",
  month: "por mes",
  total: "por estadía",
};

function getRelationName(relation) {
  return Array.isArray(relation) ? relation[0]?.name : relation?.name;
}

function formatPrice(price, currency) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(price));
}

async function toPublicRental(property, includeGallery = false) {
  const supabase = createPublicSupabaseClient();
  const images = [...(property.property_images ?? [])].sort(
    (first, second) =>
      Number(second.is_cover) - Number(first.is_cover) ||
      first.sort_order - second.sort_order,
  );
  const selectedImages = includeGallery
    ? images
    : images.slice(0, 1);
  const gallery = await Promise.all(
    selectedImages.map(async (image) => {
      const { data, error } = await supabase.storage
        .from("property-images")
        .createSignedUrl(image.storage_path, 60 * 60 * 24 * 7);

      if (error) {
        throw new Error(`No se pudo cargar una fotografía: ${error.message}`);
      }

      return {
        id: image.id,
        url: data.signedUrl,
        alt: image.alt_text || property.title,
      };
    }),
  );
  const locationName = getRelationName(property.locations);
  const region = Array.isArray(property.locations)
    ? property.locations[0]?.region
    : property.locations?.region;

  return {
    id: property.slug,
    title: property.title,
    description: property.description,
    location: [locationName, region].filter(Boolean).join(", "),
    propertyType: getRelationName(property.property_types) ?? "Propiedad",
    priceAmount: Number(property.price),
    price: formatPrice(property.price, property.currency),
    priceUnit: pricePeriods[property.price_period],
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    guests: property.guests,
    areaM2: property.area_m2 ? Number(property.area_m2) : null,
    details: [
      `${property.bedrooms} dormitorios`,
      ...(property.guests ? [`${property.guests} huéspedes`] : []),
      ...(property.amenities ?? []),
    ],
    publicationDate: property.published_at,
    image: gallery[0]?.url ?? null,
    imageAlt: gallery[0]?.alt ?? "",
    gallery,
    isReference: false,
  };
}

export async function getPublishedRentals() {
  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select(rentalSelection)
    .eq("status", "published")
    .eq("is_demo", false)
    .in("operation", ["rent", "seasonal_rent"])
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(24);

  if (error) {
    throw new Error(`No se pudieron cargar los alquileres: ${error.message}`);
  }

  return Promise.all((data ?? []).map((property) => toPublicRental(property)));
}

export async function getPublishedRentalBySlug(slug) {
  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select(rentalSelection)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_demo", false)
    .in("operation", ["rent", "seasonal_rent"])
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo cargar el alojamiento: ${error.message}`);
  }

  return data ? toPublicRental(data, true) : null;
}

export async function getPublishedRentalSlugs() {
  if (!getSupabaseConfig()) {
    return [];
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select("slug")
    .eq("status", "published")
    .eq("is_demo", false)
    .in("operation", ["rent", "seasonal_rent"]);

  if (error) {
    throw new Error(`No se pudieron cargar las URLs de alquileres: ${error.message}`);
  }

  return (data ?? []).map(({ slug }) => slug);
}
