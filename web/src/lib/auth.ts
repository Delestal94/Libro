/**
 * Autenticación de un solo usuario: una contraseña, una cookie firmada.
 *
 * Sin dependencias y sólo con Web Crypto, para que el mismo código valga en el
 * middleware (runtime edge, donde no existe `Buffer`) y en las rutas de API.
 */

export const COOKIE = "sesion";
const DURACION_MS = 1000 * 60 * 60 * 24 * 90; // 90 días: es un móvil personal

function secreto(): string {
  const s = process.env.AUTH_SECRET || process.env.SITE_PASSWORD;
  if (!s) throw new Error("Falta SITE_PASSWORD en las variables de entorno.");
  return s;
}

const bytes = (s: string) => new TextEncoder().encode(s);

function aBase64Url(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  let bin = "";
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function firmar(mensaje: string): Promise<string> {
  const clave = await crypto.subtle.importKey(
    "raw",
    bytes(secreto()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return aBase64Url(await crypto.subtle.sign("HMAC", clave, bytes(mensaje)));
}

/** Comparación en tiempo constante: no filtra cuántos caracteres coinciden. */
function igualSeguro(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

export async function crearSesion(): Promise<{ valor: string; maxAge: number }> {
  const expira = Date.now() + DURACION_MS;
  const firma = await firmar(String(expira));
  return { valor: `${expira}.${firma}`, maxAge: Math.floor(DURACION_MS / 1000) };
}

export async function sesionValida(cookie: string | undefined): Promise<boolean> {
  if (!cookie) return false;
  const corte = cookie.lastIndexOf(".");
  if (corte < 1) return false;

  const expira = cookie.slice(0, corte);
  const firma = cookie.slice(corte + 1);

  const ms = Number(expira);
  if (!Number.isFinite(ms) || ms < Date.now()) return false;

  try {
    return igualSeguro(firma, await firmar(expira));
  } catch {
    return false;
  }
}

export async function contrasenaCorrecta(intento: string): Promise<boolean> {
  const real = process.env.SITE_PASSWORD;
  if (!real) return false;
  // Se comparan los HMAC y no las cadenas: iguala la longitud y evita
  // que el tiempo de respuesta revele nada sobre la contraseña.
  const [a, b] = await Promise.all([firmar(intento), firmar(real)]);
  return igualSeguro(a, b);
}
