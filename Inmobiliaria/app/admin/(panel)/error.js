"use client";

export default function AdminPanelError({ reset }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-sm font-semibold text-brand-accent">
        No se pudo completar la operación
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
        Hubo un problema al cargar el panel.
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        Revisá la conexión con Supabase y volvé a intentarlo. No se mostrarán
        cambios como completados si no se guardaron correctamente.
      </p>
      <button
        className="mt-6 min-h-11 bg-brand-primary px-5 text-sm font-semibold text-white"
        onClick={() => reset()}
        type="button"
      >
        Reintentar
      </button>
    </main>
  );
}
