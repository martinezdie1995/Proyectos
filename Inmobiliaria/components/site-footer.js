import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-brand-dark px-5 pb-8 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="text-sm font-semibold tracking-[0.1em]"
          href="/"
        >
          INMOBILIARIA
        </Link>
        <p className="text-xs text-white/60">
          © Inmobiliaria · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
