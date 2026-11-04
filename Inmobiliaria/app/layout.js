import { Montserrat } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Alquileres de temporada cerca del mar | Inmobiliaria",
    template: "%s | Inmobiliaria",
  },
  description:
    "Encontrá casas y departamentos para disfrutar tus vacaciones cerca del mar.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Inmobiliaria",
    title: "Alquileres de temporada cerca del mar | Inmobiliaria",
    description:
      "Encontrá casas y departamentos para disfrutar tus vacaciones cerca del mar.",
    images: [
      {
        url: "/images/portada.jpg",
        width: 1200,
        alt: "Propiedad costera de portada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alquileres de temporada cerca del mar | Inmobiliaria",
    description:
      "Encontrá casas y departamentos para disfrutar tus vacaciones cerca del mar.",
    images: ["/images/portada.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html data-scroll-behavior="smooth" lang="es-AR">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
