"use client";

import { useActionState } from "react";
import { uploadPropertyImages } from "@/app/admin/(panel)/propiedades/actions";

const initialState = { error: "" };

export default function AdminImageUploadForm({ propertyId }) {
  const [state, formAction, pending] = useActionState(
    uploadPropertyImages,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-6 grid gap-4 border border-border bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6"
    >
      <input name="property_id" type="hidden" value={propertyId} />
      <label className="grid gap-2 text-sm font-medium">
        Fotografías
        <input
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="min-h-12 border border-border bg-white px-3 py-2 text-sm font-normal"
          multiple
          name="images"
          required
          type="file"
        />
        <span className="text-xs font-normal text-muted">
          Hasta 12 imágenes, 10 MB por archivo. JPG, PNG, WebP o AVIF.
        </span>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Descripción de las imágenes
        <input
          className="min-h-12 border border-border px-3 font-normal"
          maxLength={300}
          minLength={4}
          name="alt_text"
          placeholder="Ej.: Living comedor con salida al balcón"
          required
        />
      </label>
      <button
        className="min-h-12 bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Subiendo…" : "Subir fotografías"}
      </button>
      {state.error && (
        <p className="text-sm leading-6 text-brand-accent sm:col-span-3" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
