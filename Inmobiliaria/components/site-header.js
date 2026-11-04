"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/alquileres", label: "Alquileres" },
  { href: "/#nosotros", label: "La inmobiliaria" },
  { href: "/#contacto", label: "Contacto" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-dark text-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          aria-label="Inmobiliaria, ir al inicio"
          className="flex items-center gap-3"
          href="/"
          onClick={closeMenu}
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center border border-white/35"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24">
              <path
                d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-[0.12em]">
            INMOBILIARIA
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          id="mobile-navigation"
          className={`${menuOpen ? "grid" : "hidden"} absolute inset-x-0 top-full gap-1 border-t border-white/10 bg-brand-dark px-5 py-4 lg:static lg:flex lg:items-center lg:gap-9 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {links.map(({ href, label }) => (
            <Link
              className="py-3 text-sm text-white/80 transition-colors hover:text-white lg:py-2"
              href={href}
              key={href}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <Link
            className="mt-2 inline-flex min-h-11 items-center justify-center bg-brand-accent px-5 text-sm font-semibold text-white transition-colors hover:brightness-110 lg:mt-0"
            href="/alquileres"
            onClick={closeMenu}
          >
            Quiero alquilar
          </Link>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="flex size-11 items-center justify-center text-white lg:hidden"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {menuOpen ? (
            <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
            </svg>
          ) : (
            <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
