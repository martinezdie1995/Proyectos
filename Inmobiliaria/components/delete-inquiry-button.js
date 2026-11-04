"use client";

import { useFormStatus } from "react-dom";
import { deleteInquiry } from "@/app/admin/(panel)/consultas/actions";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-10 border border-brand-accent px-3 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-white disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Eliminando…" : "Eliminar consulta"}
    </button>
  );
}

export default function DeleteInquiryButton({ inquiryId }) {
  return (
    <form
      action={deleteInquiry}
      onSubmit={(event) => {
        if (!window.confirm("¿Querés eliminar esta consulta?")) {
          event.preventDefault();
        }
      }}
    >
      <input name="inquiry_id" type="hidden" value={inquiryId} />
      <DeleteButton />
    </form>
  );
}
