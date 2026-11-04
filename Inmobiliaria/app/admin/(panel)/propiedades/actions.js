"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin-session";

const operations = new Set(["sale", "rent", "seasonal_rent"]);
const statuses = new Set([
  "draft",
  "published",
  "reserved",
  "sold",
  "rented",
  "unavailable",
]);
const pricePeriods = new Set(["night", "week", "month", "total"]);
const imageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const maxImageSize = 10 * 1024 * 1024;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readText(formData, name, maximumLength) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length <= maximumLength ? normalized : null;
}

function makeSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getInteger(formData, name, { minimum, maximum, optional = false }) {
  const value = formData.get(name);

  if (optional && (value === null || value === "")) {
    return null;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return undefined;
  }

  const parsed = Number(value);
  return parsed >= minimum && parsed <= maximum ? parsed : undefined;
}

function getDecimal(formData, name, { minimum, optional = false }) {
  const value = formData.get(name);

  if (optional && (value === null || value === "")) {
    return null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= minimum ? parsed : undefined;
}

async function getLocationId(supabase, formData) {
  const name = readText(formData, "location", 120);
  const region = readText(formData, "region", 120);
  const country = readText(formData, "country", 120);
  const slug = makeSlug(`${name ?? ""}-${region ?? ""}-${country ?? ""}`);

  if (!name || !country || !slug) {
    return { error: "Ingresá una ubicación y un país válidos." };
  }

  const { data, error } = await supabase
    .from("locations")
    .upsert(
      { name, region: region || null, country, slug },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (error) {
    return { error: "No se pudo guardar la ubicación." };
  }

  return { id: data.id };
}

export async function saveProperty(_previousState, formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return { error: "Iniciá sesión con una cuenta administradora." };
  }

  const { supabase } = adminSession;
  const id = readText(formData, "id", 36);
  const title = readText(formData, "title", 180);
  const description = readText(formData, "description", 10000);
  const requestedSlug = readText(formData, "slug", 180);
  const slug = makeSlug(requestedSlug || title || "");
  const operation = readText(formData, "operation", 30);
  const status = readText(formData, "status", 30);
  const propertyTypeId = readText(formData, "property_type_id", 36);
  const price = getDecimal(formData, "price", { minimum: 0 });
  const currency = readText(formData, "currency", 3);
  const pricePeriod = readText(formData, "price_period", 20);
  const bedrooms = getInteger(formData, "bedrooms", {
    minimum: 0,
    maximum: 100,
  });
  const bathrooms = getInteger(formData, "bathrooms", {
    minimum: 0,
    maximum: 100,
  });
  const guests = getInteger(formData, "guests", {
    minimum: 1,
    maximum: 200,
    optional: true,
  });
  const area = getDecimal(formData, "area_m2", {
    minimum: 0.01,
    optional: true,
  });
  const amenitiesText = readText(formData, "amenities", 2000);

  if (
    (id && !uuidPattern.test(id)) ||
    !title ||
    title.length < 5 ||
    description === null ||
    !slug ||
    !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
    !operations.has(operation) ||
    !statuses.has(status) ||
    !propertyTypeId ||
    !uuidPattern.test(propertyTypeId) ||
    price === undefined ||
    !currency ||
    !/^[A-Z]{3}$/.test(currency) ||
    !pricePeriods.has(pricePeriod) ||
    bedrooms === undefined ||
    bathrooms === undefined ||
    guests === undefined ||
    area === undefined ||
    amenitiesText === null
  ) {
    return { error: "Revisá los campos del formulario antes de guardar." };
  }

  const location = await getLocationId(supabase, formData);

  if (location.error) {
    return { error: location.error };
  }

  let publishedAt = null;
  if (id) {
    const { data: current, error: currentError } = await supabase
      .from("properties")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    if (currentError || !current) {
      return { error: "No se pudo encontrar la propiedad para editar." };
    }

    publishedAt = current.published_at;
  }

  const property = {
    slug,
    title,
    description,
    operation,
    status,
    property_type_id: propertyTypeId,
    location_id: location.id,
    price,
    currency,
    price_period: pricePeriod,
    bedrooms,
    bathrooms,
    guests,
    area_m2: area,
    amenities: amenitiesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    is_featured: formData.get("is_featured") === "on",
    published_at:
      status === "published" ? publishedAt || new Date().toISOString() : null,
  };

  const result = id
    ? await supabase.from("properties").update(property).eq("id", id)
    : await supabase.from("properties").insert(property).select("id").single();

  if (result.error) {
    return {
      error:
        "No se pudo guardar la propiedad. Verificá que el slug no esté en uso y que la migración esté aplicada.",
    };
  }

  redirect(`/admin/propiedades/${id || result.data.id}`);
}

export async function uploadPropertyImages(_previousState, formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return { error: "Iniciá sesión con una cuenta administradora." };
  }

  const { supabase } = adminSession;
  const propertyId = readText(formData, "property_id", 36);
  const altText = readText(formData, "alt_text", 300);
  const files = formData
    .getAll("images")
    .filter((file) => file instanceof File && file.size > 0);

  if (
    !propertyId ||
    !uuidPattern.test(propertyId) ||
    altText === null ||
    altText.length < 4 ||
    files.length === 0 ||
    files.length > 12
  ) {
    return {
      error:
        "Elegí entre 1 y 12 imágenes e ingresá una descripción de al menos 4 caracteres.",
    };
  }

  if (
    files.some(
      (file) =>
        !imageTypes.has(file.type) ||
        file.size > maxImageSize ||
        file.size === 0,
    )
  ) {
    return {
      error: "Usá imágenes JPG, PNG, WebP o AVIF de hasta 10 MB cada una.",
    };
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .maybeSingle();

  if (propertyError || !property) {
    return { error: "No se encontró la propiedad." };
  }

  const { data: currentImages, error: imagesError } = await supabase
    .from("property_images")
    .select("id, is_cover")
    .eq("property_id", propertyId);

  if (imagesError) {
    return { error: "No se pudieron consultar las fotografías actuales." };
  }

  const uploadedPaths = [];
  const imageRecords = [];

  for (const [index, file] of files.entries()) {
    const path = `${propertyId}/${randomUUID()}.${imageTypes.get(file.type)}`;
    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      const { error: cleanupError } =
        uploadedPaths.length > 0
          ? await supabase.storage
              .from("property-images")
              .remove(uploadedPaths)
          : { error: null };

      if (cleanupError) {
        throw new Error(
          "Falló una carga y no se pudieron eliminar todos los archivos temporales.",
        );
      }

      return { error: "No se pudieron subir las fotografías seleccionadas." };
    }

    uploadedPaths.push(path);
    imageRecords.push({
      property_id: propertyId,
      storage_path: path,
      alt_text: altText,
      sort_order: currentImages.length + index,
      is_cover:
        currentImages.length === 0 &&
        !currentImages.some((image) => image.is_cover) &&
        index === 0,
    });
  }

  const { error: insertError } = await supabase
    .from("property_images")
    .insert(imageRecords);

  if (insertError) {
    const { error: cleanupError } = await supabase.storage
      .from("property-images")
      .remove(uploadedPaths);

    if (cleanupError) {
      throw new Error(
        "No se guardaron las fotografías y no se pudieron eliminar todos los archivos temporales.",
      );
    }

    return { error: "No se pudieron asociar las fotografías a la propiedad." };
  }

  redirect(`/admin/propiedades/${propertyId}?photos=uploaded`);
}

export async function setCoverImage(formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    throw new Error("Iniciá sesión con una cuenta administradora.");
  }

  const { supabase } = adminSession;
  const propertyId = readText(formData, "property_id", 36);
  const imageId = readText(formData, "image_id", 36);

  if (
    !propertyId ||
    !imageId ||
    !uuidPattern.test(propertyId) ||
    !uuidPattern.test(imageId)
  ) {
    throw new Error("La fotografía seleccionada no es válida.");
  }

  const { data: target, error: targetError } = await supabase
    .from("property_images")
    .select("id, property_id")
    .eq("id", imageId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (targetError || !target) {
    throw new Error("No se encontró la fotografía seleccionada.");
  }

  const { data: current, error: currentError } = await supabase
    .from("property_images")
    .select("id")
    .eq("property_id", propertyId)
    .eq("is_cover", true)
    .maybeSingle();

  if (currentError) {
    throw new Error("No se pudo consultar la portada actual.");
  }

  if (current?.id === imageId) {
    redirect(`/admin/propiedades/${propertyId}`);
  }

  if (current) {
    const { error: unsetError } = await supabase
      .from("property_images")
      .update({ is_cover: false })
      .eq("id", current.id);

    if (unsetError) {
      throw new Error("No se pudo actualizar la fotografía de portada.");
    }
  }

  const { error: setError } = await supabase
    .from("property_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  if (setError) {
    if (current) {
      const { error: restoreError } = await supabase
        .from("property_images")
        .update({ is_cover: true })
        .eq("id", current.id);

      if (restoreError) {
        throw new Error(
          "No se pudo cambiar la portada y tampoco restaurar la anterior.",
        );
      }
    }

    throw new Error("No se pudo actualizar la fotografía de portada.");
  }

  redirect(`/admin/propiedades/${propertyId}`);
}

export async function deletePropertyImage(formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    throw new Error("Iniciá sesión con una cuenta administradora.");
  }

  const { supabase } = adminSession;
  const propertyId = readText(formData, "property_id", 36);
  const imageId = readText(formData, "image_id", 36);

  if (
    !propertyId ||
    !imageId ||
    !uuidPattern.test(propertyId) ||
    !uuidPattern.test(imageId)
  ) {
    throw new Error("La fotografía seleccionada no es válida.");
  }

  const { data: image, error: imageError } = await supabase
    .from("property_images")
    .select("storage_path, is_cover")
    .eq("id", imageId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (imageError || !image) {
    throw new Error("No se encontró la fotografía seleccionada.");
  }

  const { error: deleteError } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId)
    .eq("property_id", propertyId);

  if (deleteError) {
    throw new Error("No se pudo actualizar la galería.");
  }

  if (image.is_cover) {
    const { data: nextImage, error: nextImageError } = await supabase
      .from("property_images")
      .select("id")
      .eq("property_id", propertyId)
      .order("sort_order")
      .limit(1)
      .maybeSingle();

    if (nextImageError) {
      throw new Error("No se pudo seleccionar la nueva foto principal.");
    }

    if (nextImage) {
      const { error: coverError } = await supabase
        .from("property_images")
        .update({ is_cover: true })
        .eq("id", nextImage.id);

      if (coverError) {
        throw new Error("No se pudo seleccionar la nueva foto principal.");
      }
    }
  }

  const { error: removeError } = await supabase.storage
    .from("property-images")
    .remove([image.storage_path]);

  if (removeError) {
    redirect(`/admin/propiedades/${propertyId}?cleanup=failed`);
  }

  redirect(`/admin/propiedades/${propertyId}`);
}

export async function deleteProperty(formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    throw new Error("Iniciá sesión con una cuenta administradora.");
  }

  const { supabase } = adminSession;
  const propertyId = readText(formData, "property_id", 36);

  if (!propertyId || !uuidPattern.test(propertyId)) {
    throw new Error("La propiedad seleccionada no es válida.");
  }

  const { data: images, error: imagesError } = await supabase
    .from("property_images")
    .select("storage_path")
    .eq("property_id", propertyId);

  if (imagesError) {
    throw new Error("No se pudieron consultar las fotografías de la propiedad.");
  }

  const { error: deleteError } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (deleteError) {
    throw new Error("No se pudo eliminar la propiedad.");
  }

  if (images.length > 0) {
    const { error: removeError } = await supabase.storage
      .from("property-images")
      .remove(images.map((image) => image.storage_path));

    if (removeError) {
      redirect("/admin/propiedades?cleanup=failed");
    }
  }

  redirect("/admin/propiedades");
}
