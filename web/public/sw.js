/**
 * Service worker.
 *
 * Objetivo modesto y honesto: que la app **abra** sin cobertura y que se pueda
 * releer lo último visto. No intenta ser una copia del libro — la fuente de
 * verdad es GitHub, y fingir lo contrario acabaría mostrando texto viejo como
 * si fuera el bueno.
 */

const CACHE = "escritorio-v1";

self.addEventListener("install", (evento) => {
  // Activar de inmediato: no tiene sentido esperar a que se cierren pestañas.
  self.skipWaiting();
  evento.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // El login y las escrituras nunca se cachean.
  if (url.pathname.startsWith("/api/login") || url.pathname === "/login") return;

  /*
    Red primero, caché como red de seguridad.
    Al revés (caché primero) sería más rápido, pero mostraría capítulos viejos
    tras editarlos en otro dispositivo: justo el fallo que este proyecto evita.
  */
  evento.respondWith(
    (async () => {
      try {
        const respuesta = await fetch(req);
        if (respuesta.ok) {
          const cache = await caches.open(CACHE);
          cache.put(req, respuesta.clone());
        }
        return respuesta;
      } catch (e) {
        const guardada = await caches.match(req);
        if (guardada) {
          return guardada;
        }
        if (req.mode === "navigate") {
          return new Response(paginaSinConexion(), {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
        throw e;
      }
    })(),
  );
});

function paginaSinConexion() {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sin conexión</title>
<style>
  body{margin:0;min-height:100dvh;display:flex;align-items:center;justify-content:center;
       background:#12100e;color:#e9e3d6;font-family:system-ui,sans-serif;text-align:center;padding:2rem}
  h1{font-weight:600;font-size:1.25rem;margin:0 0 .5rem}
  p{color:#a49b8c;font-size:.9rem;margin:0 0 1.5rem;line-height:1.6}
  button{min-height:48px;padding:0 1.5rem;border:0;border-radius:8px;
         background:#c9a227;color:#12100e;font-weight:600;font-size:1rem}
</style></head>
<body><div>
  <h1>Sin conexión</h1>
  <p>Esta pantalla aún no se había abierto, así que no está guardada.<br>
     Lo que tuvieras escrito sigue a salvo en el móvil.</p>
  <button onclick="location.reload()">Reintentar</button>
</div></body></html>`;
}
