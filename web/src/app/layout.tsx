import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavInferior from "@/components/NavInferior";
import NavLateral from "@/components/NavLateral";
import Conexion from "@/components/Conexion";
import ModoTema from "@/components/ModoTema";
import ContenedorPrincipal from "@/components/ContenedorPrincipal";

export const metadata: Metadata = {
  title: "Escritorio",
  description: "Escribir y leer el libro desde cualquier sitio.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Escritorio" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
  // `cover` permite usar el área bajo el notch; el padding seguro lo compensa.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

// Aplica el tema guardado antes de pintar: sin esto habría un parpadeo del
// color por defecto (oscuro) al cargar una página en modo claro forzado.
const SCRIPT_TEMA = `try{var t=localStorage.getItem("tema");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="min-h-dvh bg-fondo text-texto">
        <Conexion />
        <NavLateral />
        {/* pb-28 reserva el hueco de la barra inferior fija; en desktop no hay
            barra inferior (la nav vive en NavLateral) así que se anula.
            lg:pl-56 reserva el hueco de la sidebar en un elemento aparte del
            que centra: mezclar mx-auto con un margen fijo en la misma caja
            hace que el auto pierda y todo quede pegado a la izquierda. */}
        <main className="pb-28 pt-segura lg:pb-8 lg:pl-56">
          <ContenedorPrincipal>{children}</ContenedorPrincipal>
        </main>
        <NavInferior />
        <ModoTema />
      </body>
    </html>
  );
}
