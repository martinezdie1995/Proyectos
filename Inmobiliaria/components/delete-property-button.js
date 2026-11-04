"use client";

import { useFormStatus } from "react-dom";
import { deleteProperty } from "@/app/admin/(panel)/propiedades/actions";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-10 border border-brand-accent px-3 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-white disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}

export default function DeletePropertyButton({ propertyId }) {
  return (
    <form
      action={deleteProperty}
      onSubmit={(event) => {
        if (!window.confirm("¿Querés eliminar esta propiedad y sus fotos?")) {
          event.preventDefault();
        }
      }}
    >
      <input name="property_id" type="hidden" value={propertyId} />
      <DeleteButton />
    </form>
  );
}
