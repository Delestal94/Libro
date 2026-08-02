/**
 * Fichas de personaje.
 *
 * Un fichero por personaje en `biblia/personajes/`. Los datos técnicos van en
 * cabecera YAML y la biografía en Markdown debajo, así que la ficha se lee y se
 * edita sin la app, entra en el buscador y admite `[[enlaces]]` como cualquier
 * otro documento. Nada de base de datos aparte.
 */

export const CARPETA = "biblia/personajes";

export type Campo = {
  clave: string;
  etiqueta: string;
  ayuda?: string;
  /** Se muestra en la tarjeta del listado, no sólo en la ficha completa. */
  destacado?: boolean;
};

/**
 * Campos **sugeridos**, no obligatorios ni cerrados: la ficha admite cualquier
 * clave que se le añada, y cualquiera de éstas se puede quitar. Sirven para no
 * empezar ante una hoja en blanco, nada más.
 *
 * `edad` y `edad_aparente` van separadas a propósito: en el género que te
 * interesa, la diferencia entre las dos suele ser el personaje entero.
 */
export const CAMPOS: Campo[] = [
  { clave: "alias", etiqueta: "Alias", ayuda: "Cómo lo llaman", destacado: true },
  { clave: "edad", etiqueta: "Edad", destacado: true },
  { clave: "edad_aparente", etiqueta: "Edad aparente", ayuda: "Si no coincide con la real" },
  { clave: "ocupacion", etiqueta: "Ocupación", destacado: true },
  { clave: "afiliacion", etiqueta: "Afiliación", ayuda: "Facción, casa, gremio" },
  { clave: "origen", etiqueta: "Origen", ayuda: "De dónde es" },
  { clave: "altura", etiqueta: "Altura" },
  { clave: "complexion", etiqueta: "Complexión" },
  { clave: "ojos", etiqueta: "Ojos" },
  { clave: "pelo", etiqueta: "Pelo" },
  { clave: "senas", etiqueta: "Señas particulares", ayuda: "Cicatrices, tatuajes, una manía" },
  { clave: "estado", etiqueta: "Estado", ayuda: "Vivo, muerto, desaparecido…", destacado: true },
];

export type Personaje = {
  ruta: string;
  slug: string;
  nombre: string;
  ficha: Record<string, string>;
  cuerpo: string;
};

// --- Cabecera YAML ---

/**
 * Parser deliberadamente pequeño: sólo `clave: valor` de una línea, que es todo
 * lo que necesita una ficha. Traer un parser de YAML entero para esto sería
 * cargar con toda su superficie de fallos a cambio de nada.
 */
export function separarCabecera(texto: string): { datos: Record<string, string>; cuerpo: string } {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { datos: {}, cuerpo: texto };

  const datos: Record<string, string> = {};
  for (const linea of m[1].split(/\r?\n/)) {
    const corte = linea.indexOf(":");
    if (corte < 1) continue;
    const clave = linea.slice(0, corte).trim();
    let valor = linea.slice(corte + 1).trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"') && valor.length > 1) ||
      (valor.startsWith("'") && valor.endsWith("'") && valor.length > 1)
    ) {
      valor = valor.slice(1, -1);
    }
    if (clave) datos[clave] = valor;
  }

  // Se quitan los saltos que separaban la cabecera del cuerpo: si no, cada
  // ciclo de leer y volver a guardar iría acumulando líneas en blanco.
  return { datos, cuerpo: texto.slice(m[0].length).replace(/^\n+/, "") };
}

export function componerCabecera(datos: Record<string, string>, cuerpo: string): string {
  const entradas = Object.entries(datos).filter(([, v]) => v?.trim());
  if (!entradas.length) return cuerpo;

  const lineas = entradas.map(([k, v]) => {
    // Se entrecomilla lo que YAML interpretaría mal, y las comillas internas
    // se escapan para que el valor sobreviva a un ciclo completo.
    const necesitaComillas = /^[\s>|&*!%@`{}[\]#-]|[:#]\s|["'\n]|^$/.test(v);
    return `${k}: ${necesitaComillas ? `"${v.replace(/"/g, '\\"')}"` : v}`;
  });

  return `---\n${lineas.join("\n")}\n---\n\n${cuerpo.replace(/^\n+/, "")}`;
}

// --- Fichas ---

export function slugDeRuta(ruta: string): string {
  return (ruta.split("/").pop() ?? "").replace(/\.md$/, "");
}

export function esPersonaje(ruta: string): boolean {
  return ruta.startsWith(`${CARPETA}/`) && ruta.endsWith(".md");
}

export function leerPersonaje(ruta: string, texto: string): Personaje {
  const { datos, cuerpo } = separarCabecera(texto);
  const slug = slugDeRuta(ruta);
  return {
    ruta,
    slug,
    // El nombre sale de la cabecera, del primer encabezado, o del fichero.
    nombre:
      datos.nombre?.trim() ||
      cuerpo.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
      slug.replace(/[-_]/g, " "),
    ficha: datos,
    cuerpo,
  };
}

/** Esqueleto de una ficha nueva: secciones sugeridas, ninguna obligatoria. */
export function fichaNueva(nombre: string, datos: Record<string, string> = {}): string {
  const cuerpo = `# ${nombre}

## Apariencia

## Personalidad

## Biografía

## Poder y precio

> Qué puede hacer y qué le cuesta. Un poder sin precio no genera tensión.

## Relaciones

## Voz

> Cómo habla. Qué palabras no usaría nunca.

## Notas
`;
  return componerCabecera({ nombre, ...datos }, cuerpo);
}

/** Clave técnica → etiqueta legible. Los campos inventados también tienen la suya. */
export function etiquetaDe(clave: string): string {
  const conocido = CAMPOS.find((c) => c.clave === clave);
  if (conocido) return conocido.etiqueta;
  const legible = clave.replace(/[-_]/g, " ").trim();
  return legible.charAt(0).toUpperCase() + legible.slice(1);
}

/** Convierte un texto libre en clave de campo: "Color favorito" → "color_favorito". */
export function aClave(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

/**
 * Los campos rellenos de una ficha: primero los sugeridos en su orden, después
 * los que hayas inventado tú, en el orden en que los añadiste.
 */
export function camposRellenos(p: Personaje): { clave: string; etiqueta: string; valor: string }[] {
  const conocidas = new Set(CAMPOS.map((c) => c.clave));

  const sugeridos = CAMPOS.filter((c) => p.ficha[c.clave]?.trim()).map((c) => ({
    clave: c.clave,
    etiqueta: c.etiqueta,
    valor: p.ficha[c.clave],
  }));

  const propios = Object.entries(p.ficha)
    // `nombre` se muestra como título de la ficha, no como una fila más.
    .filter(([k, v]) => k !== "nombre" && !conocidas.has(k) && v?.trim())
    .map(([k, v]) => ({ clave: k, etiqueta: etiquetaDe(k), valor: v }));

  return [...sugeridos, ...propios];
}

/** Iniciales para el avatar del listado: sin fotos, pero algo que distinga. */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
