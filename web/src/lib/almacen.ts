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

// --- Anotaciones pendientes de llegar a GitHub -----------------------------

/**
 * Subrayar tiene que sentirse instantáneo y no perderse nunca, y cada
 * anotación es un commit: entre las dos cosas hace falta una cola.
 *
 * La marca se pinta en el momento y la operación queda aquí hasta que el
 * servidor la confirma. Si se cae la red, si salta un límite de la API o si
 * se cierra la pestaña a media escritura, la operación sigue en el móvil y
 * sale sola en cuanto se puede.
 *
 * Todas las operaciones llevan `id` y son idempotentes en el servidor, así
 * que reintentar de más nunca duplica un subrayado.
 */
const CLAVE_ANOTACIONES = "cola-anotaciones";

export type OperacionAnotacion =
  | {
      tipo: "crear";
      id: string;
      ruta: string;
      texto: string;
      aparicion: number;
      comentario: string;
      color: string;
      ts: number;
    }
  | { tipo: "editar"; id: string; comentario: string; color: string; ts: number }
  | { tipo: "borrar"; id: string; ts: number };

/**
 * `Omit` sobre una unión se queda con las claves comunes y pierde las ramas.
 * Ésta se aplica a cada miembro por separado, que es lo que hace falta para
 * poder encolar cualquiera de las tres operaciones sin su marca de tiempo.
 */
export type SinTs<T> = T extends unknown ? Omit<T, "ts"> : never;

export function colaAnotaciones(): OperacionAnotacion[] {
  return leer<OperacionAnotacion[]>(CLAVE_ANOTACIONES) ?? [];
}

/**
 * Encola una operación. Las que se pisan entre sí se colapsan: varias
 * ediciones del mismo subrayado dejan sólo la última, y borrar algo que
 * todavía no se había llegado a crear cancela las dos — así una tarde de
 * pruebas no acaba en veinte commits inútiles.
 */
export function encolarAnotacion(op: SinTs<OperacionAnotacion>): void {
  const cola = colaAnotaciones();
  const siguiente = { ...op, ts: Date.now() } as OperacionAnotacion;

  if (siguiente.tipo === "borrar") {
    const previas = cola.filter((o) => o.id === siguiente.id);
    const seCreoAqui = previas.some((o) => o.tipo === "crear");
    const resto = cola.filter((o) => o.id !== siguiente.id);
    escribir(CLAVE_ANOTACIONES, seCreoAqui ? resto : [...resto, siguiente]);
    return;
  }

  if (siguiente.tipo === "editar") {
    // Si la creación sigue pendiente, se edita ahí mismo y no se encola nada.
    const creacion = cola.find((o) => o.id === siguiente.id && o.tipo === "crear");
    if (creacion && creacion.tipo === "crear") {
      const actualizada = { ...creacion, comentario: siguiente.comentario, color: siguiente.color };
      escribir(
        CLAVE_ANOTACIONES,
        cola.map((o) => (o === creacion ? actualizada : o)),
      );
      return;
    }
    const resto = cola.filter((o) => !(o.id === siguiente.id && o.tipo === "editar"));
    escribir(CLAVE_ANOTACIONES, [...resto, siguiente]);
    return;
  }

  escribir(CLAVE_ANOTACIONES, [...cola, siguiente]);
}

export function desencolarAnotacion(op: OperacionAnotacion): void {
  escribir(
    CLAVE_ANOTACIONES,
    colaAnotaciones().filter((o) => !(o.id === op.id && o.tipo === op.tipo && o.ts === op.ts)),
  );
}
