import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavInferior from "@/components/NavInferior";

export const metadata: Metadata = {
  title: "Escritorio",
  description: "Escribir y leer el libro desde cualquier sitio.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Escritorio" },
};

export const viewport: Viewport = {
  themeColor: "#12100e",
  // `cover` permite usar el área bajo el notch; el padding seguro lo compensa.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-fondo text-texto">
        {/* pb-28 reserva el hueco de la barra inferior fija. */}
        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-segura">{children}</main>
        <NavInferior />
      </body>
    </html>
  );
}
