"use client";

import {
  deletePropertyImage,
  setCoverImage,
} from "@/app/admin/(panel)/propiedades/actions";

export default function PropertyImageControls({
  propertyId,
  imageId,
  isCover,
}) {
  return (
    <div className="grid gap-3">
      {!isCover && (
        <form action={setCoverImage}>
          <input name="property_id" type="hidden" value={propertyId} />
          <input name="image_id" type="hidden" value={imageId} />
          <button
            className="min-h-10 w-full border border-brand-primary px-3 text-sm font-semibold text-brand-primary hover:bg-background"
            type="submit"
          >
            Elegir como foto principal
          </button>
        </form>
      )}
      <form
        action={deletePropertyImage}
        onSubmit={(event) => {
          if (!window.confirm("¿Querés eliminar esta fotografía?")) {
            event.preventDefault();
          }
        }}
      >
        <input name="property_id" type="hidden" value={propertyId} />
        <input name="image_id" type="hidden" value={imageId} />
        <button
          className="min-h-10 w-full border border-brand-accent px-3 text-sm font-semibold text-brand-accent hover:bg-background"
          type="submit"
        >
          Eliminar fotografía
        </button>
      </form>
    </div>
  );
}
