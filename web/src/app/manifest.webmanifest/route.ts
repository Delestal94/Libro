/** Permite "Añadir a pantalla de inicio" en el móvil y abrirla como app. */
export function GET() {
  return Response.json({
    name: "Escritorio",
    short_name: "Escritorio",
    description: "Escribir y leer el libro desde cualquier sitio.",
    start_url: "/",
    display: "standalone",
    background_color: "#12100e",
    theme_color: "#12100e",
    orientation: "portrait",
    icons: [{ src: "/icono.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  });
}
