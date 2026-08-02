/**
 * Fichas: personajes, lugares y criaturas.
 *
 * Los tres son lo mismo por debajo —un fichero Markdown con datos técnicos en
 * cabecera YAML y texto libre debajo—, así que comparten toda la maquinaria y
 * sólo se diferencian en la carpeta, los campos sugeridos y la plantilla.
 *
 * Al ser ficheros normales entran en el buscador y admiten `[[enlaces]]`, de
 * modo que mencionar un lugar en un capítulo hace que su ficha lo registre sola.
 */

export type Campo = {
  clave: string;
  etiqueta: string;
  ayuda?: string;
  /** Se muestra en la tarjeta del listado, no sólo en la ficha completa. */
  destacado?: boolean;
};

export type TipoFicha = "personajes" | "lugares" | "criaturas";

export type DefinicionTipo = {
  id: TipoFicha;
  /** Singular, para títulos y mensajes. */
  singular: string;
  plural: string;
  icono: string;
  descripcion: string;
  carpeta: string;
  campos: Campo[];
  secciones: string[];
};

export const TIPOS: Record<TipoFicha, DefinicionTipo> = {
  personajes: {
    id: "personajes",
    singular: "personaje",
    plural: "Personajes",
    icono: "☗",
    descripcion: "Quiénes son. No hace falta saber aún qué harán.",
    carpeta: "biblia/personajes",
    /*
      `edad` y `edad_aparente` van separadas a propósito: en este género, la
      diferencia entre las dos suele ser el personaje entero.
    */
    campos: [
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
    ],
    secciones: [
      "Apariencia",
      "Personalidad",
      "Biografía",
      "Poder y precio",
      "Relaciones",
      "Voz",
      "Notas",
    ],
  },

  lugares: {
    id: "lugares",
    singular: "lugar",
    plural: "Lugares",
    icono: "⌂",
    descripcion: "Ciudades y regiones, cada una con lo suyo.",
    carpeta: "biblia/lugares",
    /*
      `suena`, `huele` y `come` no son adorno: un lugar se recuerda por lo que
      se percibe en él antes que por su historia. Y `secreto` es la columna
      vertebral de un arco — lo que la ciudad esconde debajo de ser bonita.
    */
    campos: [
      { clave: "tipo_lugar", etiqueta: "Qué es", ayuda: "Ciudad, aldea, ruina, isla…", destacado: true },
      { clave: "region", etiqueta: "Región", destacado: true },
      { clave: "poblacion", etiqueta: "Población" },
      { clave: "clima", etiqueta: "Clima" },
      {
        clave: "tecnologia",
        etiqueta: "Tecnología mágica",
        ayuda: "Grado 0 a 4 — ver biblia/mundo.md",
        destacado: true,
      },
      { clave: "inspiracion", etiqueta: "Inspiración", ayuda: "Mitología o lugar real del que sale" },
      { clave: "tema", etiqueta: "Tema del arco", destacado: true },
      { clave: "suena", etiqueta: "Qué se oye", ayuda: "El sonido del sitio" },
      { clave: "huele", etiqueta: "Qué se huele" },
      { clave: "come", etiqueta: "Qué se come" },
      { clave: "fauna", etiqueta: "Fauna propia" },
      { clave: "secreto", etiqueta: "Lo que esconde", ayuda: "Lo que hay debajo de la postal" },
      { clave: "capitulo", etiqueta: "Capítulos" },
    ],
    secciones: [
      "Qué se ve al llegar",
      "Cómo funciona",
      "Quién manda",
      "Lo que esconde",
      "Qué pasa aquí",
      "Notas",
    ],
  },

  criaturas: {
    id: "criaturas",
    singular: "criatura",
    plural: "Criaturas",
    icono: "✦",
    descripcion: "Fauna propia. Tres bien hechas valen más que un bestiario.",
    carpeta: "biblia/criaturas",
    campos: [
      { clave: "clase", etiqueta: "Qué es", ayuda: "Bestia, ave, insecto, otra cosa", destacado: true },
      { clave: "habitat", etiqueta: "Dónde vive", destacado: true },
      { clave: "tamano", etiqueta: "Tamaño" },
      { clave: "dieta", etiqueta: "De qué se alimenta" },
      { clave: "suena", etiqueta: "Qué sonido hace" },
      { clave: "peligro", etiqueta: "Peligro", ayuda: "Inofensiva, esquiva, mortal…", destacado: true },
      { clave: "inteligencia", etiqueta: "Inteligencia" },
      { clave: "relacion", etiqueta: "Relación con la gente", ayuda: "Se caza, se cría, se teme, se adora" },
      { clave: "inspiracion", etiqueta: "De dónde sale" },
    ],
    secciones: ["Cómo es", "Cómo se comporta", "Qué cuentan de ella", "Notas"],
  },
};

export const LISTA_TIPOS = Object.values(TIPOS);

export function esTipoValido(t: string): t is TipoFicha {
  return t === "personajes" || t === "lugares" || t === "criaturas";
}

/**
 * Los slugs los genera `aSlug`, que sólo produce minúsculas, dígitos y guiones.
 * Se valida con **lista de permitidos** y no prohibiendo `..` o `/`: una lista de
 * prohibidos siempre se queda corta —caracteres de control, codificaciones raras—
 * y aquí el slug acaba siendo un nombre de fichero.
 */
export function slugValido(slug: unknown): slug is string {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 60;
}

export type Ficha = {
  tipo: TipoFicha;
  ruta: string;
  slug: string;
  nombre: string;
  datos: Record<string, string>;
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
    if (valor.startsWith('"') && valor.endsWith('"') && valor.length > 1) {
      // Se deshace el escapado que puso `componerCabecera`. Sin esto, un valor
      // con comillas dentro va acumulando barras en cada ciclo de edición.
      valor = valor.slice(1, -1).replace(/\\(["\\])/g, "$1");
    } else if (valor.startsWith("'") && valor.endsWith("'") && valor.length > 1) {
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

/** A qué tipo de ficha pertenece una ruta, si es que pertenece a alguno. */
export function tipoDeRuta(ruta: string): TipoFicha | null {
  if (!ruta.endsWith(".md")) return null;
  for (const t of LISTA_TIPOS) {
    if (ruta.startsWith(`${t.carpeta}/`)) return t.id;
  }
  return null;
}

export function esFicha(ruta: string): boolean {
  return tipoDeRuta(ruta) !== null;
}

export function leerFicha(ruta: string, texto: string): Ficha | null {
  const tipo = tipoDeRuta(ruta);
  if (!tipo) return null;

  const { datos, cuerpo } = separarCabecera(texto);
  const slug = slugDeRuta(ruta);

  return {
    tipo,
    ruta,
    slug,
    // El nombre sale de la cabecera, del primer encabezado, o del fichero.
    nombre:
      datos.nombre?.trim() ||
      cuerpo.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
      slug.replace(/[-_]/g, " "),
    datos,
    cuerpo,
  };
}

/** Esqueleto de una ficha nueva: secciones sugeridas, ninguna obligatoria. */
export function fichaNueva(
  tipo: TipoFicha,
  nombre: string,
  datos: Record<string, string> = {},
): string {
  const cuerpo = `# ${nombre}\n\n${TIPOS[tipo].secciones.map((s) => `## ${s}\n`).join("\n")}`;
  return componerCabecera({ nombre, ...datos }, cuerpo);
}

/** Clave técnica → etiqueta legible. Los campos inventados también tienen la suya. */
export function etiquetaDe(tipo: TipoFicha, clave: string): string {
  const conocido = TIPOS[tipo].campos.find((c) => c.clave === clave);
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
export function camposRellenos(f: Ficha): { clave: string; etiqueta: string; valor: string }[] {
  const definidos = TIPOS[f.tipo].campos;
  const conocidas = new Set(definidos.map((c) => c.clave));

  const sugeridos = definidos
    .filter((c) => f.datos[c.clave]?.trim())
    .map((c) => ({ clave: c.clave, etiqueta: c.etiqueta, valor: f.datos[c.clave] }));

  const propios = Object.entries(f.datos)
    // `nombre` se muestra como título de la ficha, no como una fila más.
    .filter(([k, v]) => k !== "nombre" && !conocidas.has(k) && v?.trim())
    .map(([k, v]) => ({ clave: k, etiqueta: etiquetaDe(f.tipo, k), valor: v }));

  return [...sugeridos, ...propios];
}

/** Iniciales para el avatar del listado: sin fotos, pero algo que distinga. */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
