"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/actions";

const initialState = { error: "" };

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 grid gap-5">
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          autoComplete="username"
          className="min-h-12 border border-border bg-white px-3 font-normal"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Contraseña
        <input
          autoComplete="current-password"
          className="min-h-12 border border-border bg-white px-3 font-normal"
          name="password"
          required
          type="password"
        />
      </label>

      {state.error && (
        <p className="text-sm leading-6 text-brand-accent" role="alert">
          {state.error}
        </p>
      )}

      <button
        className="min-h-12 bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Ingresando…" : "Ingresar al panel"}
      </button>
    </form>
  );
}
