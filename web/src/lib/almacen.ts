/**
 * Almacén local del navegador: borradores y guardados pendientes.
 *
 * Existe para que perder la cobertura, o que el móvil mate la pestaña, nunca
 * cueste texto escrito. Es una red de seguridad, no una copia del libro:
 * la fuente de verdad sigue siendo GitHub.
 */

const PREFIJO_BORRADOR = "borrador:";
const CLAVE_COLA = "cola-guardados";

export type Borrador = { texto: string; sha: string; ts: number };
export type Pendiente = { ruta: string; contenido: string; sha: string; ts: number };

function disponible(): boolean {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    // Safari en navegación privada lanza al tocar localStorage.
    return false;
  }
}

function leer<T>(clave: string): T | null {
  if (!disponible()) return null;
  try {
    const bruto = localStorage.getItem(clave);
    return bruto ? (JSON.parse(bruto) as T) : null;
  } catch {
    return null;
  }
}

function escribir(clave: string, valor: unknown): void {
  if (!disponible()) return;
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Cuota llena: se prefiere seguir escribiendo a romper la app.
  }
}

// --- Borradores: lo que hay en el editor pero aún no está en GitHub ---

export function guardarBorrador(ruta: string, texto: string, sha: string): void {
  escribir(PREFIJO_BORRADOR + ruta, { texto, sha, ts: Date.now() } satisfies Borrador);
}

export function leerBorrador(ruta: string): Borrador | null {
  return leer<Borrador>(PREFIJO_BORRADOR + ruta);
}

export function limpiarBorrador(ruta: string): void {
  if (!disponible()) return;
  try {
    localStorage.removeItem(PREFIJO_BORRADOR + ruta);
  } catch {
    /* nada que hacer */
  }
}

// --- Cola: guardados que no salieron porque no había red ---

export function cola(): Pendiente[] {
  return leer<Pendiente[]>(CLAVE_COLA) ?? [];
}

/** Encola un guardado. Si ya había uno del mismo fichero, lo reemplaza. */
export function encolar(p: Omit<Pendiente, "ts">): void {
  const resto = cola().filter((x) => x.ruta !== p.ruta);
  escribir(CLAVE_COLA, [...resto, { ...p, ts: Date.now() }]);
}

export function desencolar(ruta: string): void {
  escribir(
    CLAVE_COLA,
    cola().filter((x) => x.ruta !== ruta),
  );
}

/** Un fallo de red se reintenta; uno del servidor, no: reintentarlo no arregla nada. */
export function esFalloDeRed(e: unknown): boolean {
  return e instanceof TypeError || (typeof navigator !== "undefined" && !navigator.onLine);
}
