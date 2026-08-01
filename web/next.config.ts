import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El contenido del libro vive en el mismo repo; la app nunca lo lee del disco,
  // siempre a través de la API de GitHub, para que PC y móvil vean lo mismo.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
