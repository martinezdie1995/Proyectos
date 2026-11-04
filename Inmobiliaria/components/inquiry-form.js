"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/contacto/actions";

const initialState = { error: "", success: "" };

export default function InquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4 border-t border-white/20 pt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nombre
          <input
            autoComplete="name"
            className="min-h-12 border border-white/35 bg-white px-3 font-normal text-foreground"
            maxLength={120}
            minLength={2}
            name="name"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input
            autoComplete="email"
            className="min-h-12 border border-white/35 bg-white px-3 font-normal text-foreground"
            maxLength={254}
            name="email"
            required
            type="email"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Teléfono (opcional)
        <input
          autoComplete="tel"
          className="min-h-12 border border-white/35 bg-white px-3 font-normal text-foreground"
          maxLength={40}
          name="phone"
          type="tel"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        ¿En qué podemos ayudarte?
        <textarea
          className="min-h-32 border border-white/35 bg-white px-3 py-3 font-normal text-foreground"
          maxLength={5000}
          minLength={10}
          name="message"
          required
          rows={4}
        />
      </label>
      <div aria-hidden="true" className="absolute -left-[10000px]">
        <label>
          Sitio web
          <input
            autoComplete="off"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </label>
      </div>

      {state.error && (
        <p className="text-sm leading-6 text-red-100" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm leading-6 text-white" role="status">
          {state.success}
        </p>
      )}

      <button
        className="min-h-12 w-fit bg-white px-6 text-sm font-semibold text-brand-dark transition-colors hover:bg-background disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
