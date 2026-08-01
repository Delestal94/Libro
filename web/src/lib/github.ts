/**
 * Única puerta de acceso al contenido del libro.
 *
 * El repo de GitHub es la fuente de verdad: lo que se escribe desde el móvil
 * queda como commit, y un `git pull` en el PC lo trae. No hay base de datos ni
 * copia local, precisamente para que no existan dos versiones divergentes.
 */

const API = "https://api.github.com";

function config() {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) {
    throw new Error(
      "Faltan GITHUB_REPO o GITHUB_TOKEN en las variables de entorno.",
    );
  }
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`GITHUB_REPO debe tener el formato "usuario/repo" (recibido: "${repo}").`);
  }
  return { owner, name, token, rama: process.env.GITHUB_BRANCH || "main" };
}

async function api<T>(ruta: string, init?: RequestInit): Promise<T> {
  const { token } = config();
  const res = await fetch(`${API}${ruta}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const cuerpo = await res.text();
    throw new Error(`GitHub ${res.status} en ${ruta}: ${cuerpo.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

const b64aTexto = (b64: string) => Buffer.from(b64, "base64").toString("utf8");
const textoAB64 = (texto: string) => Buffer.from(texto, "utf8").toString("base64");

export type NodoArbol = {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
};

/** Todos los ficheros del repo en una sola llamada. */
export async function listarArbol(): Promise<NodoArbol[]> {
  const { owner, name, rama } = config();
  const datos = await api<{ tree: NodoArbol[]; truncated: boolean }>(
    `/repos/${owner}/${name}/git/trees/${encodeURIComponent(rama)}?recursive=1`,
  );
  return datos.tree.filter((n) => n.type === "blob");
}

/** Ficheros Markdown del libro, excluyendo la app y todo lo que no sea contenido. */
export async function listarDocumentos(): Promise<NodoArbol[]> {
  const arbol = await listarArbol();
  return arbol
    .filter((n) => n.path.endsWith(".md"))
    .filter((n) => !n.path.startsWith("web/"))
    .filter((n) => !n.path.startsWith("node_modules/"))
    .sort((a, b) => a.path.localeCompare(b.path, "es"));
}

export type Documento = { ruta: string; contenido: string; sha: string };

export async function leerArchivo(ruta: string): Promise<Documento | null> {
  const { owner, name, rama } = config();
  try {
    const datos = await api<{ content: string; sha: string; encoding: string }>(
      `/repos/${owner}/${name}/contents/${encodeURI(ruta)}?ref=${encodeURIComponent(rama)}`,
    );
    return {
      ruta,
      contenido: datos.encoding === "base64" ? b64aTexto(datos.content) : datos.content,
      sha: datos.sha,
    };
  } catch (e) {
    if (e instanceof Error && e.message.includes("GitHub 404")) return null;
    throw e;
  }
}

/**
 * Crea o actualiza un fichero. `sha` debe ser el de la versión que se editó:
 * si alguien (o tú desde el PC) lo cambió mientras tanto, GitHub devuelve 409
 * y el cambio no se pisa en silencio.
 */
export async function guardarArchivo(
  ruta: string,
  contenido: string,
  mensaje: string,
  sha?: string,
): Promise<{ sha: string }> {
  const { owner, name, rama } = config();
  const datos = await api<{ content: { sha: string } }>(
    `/repos/${owner}/${name}/contents/${encodeURI(ruta)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: mensaje,
        content: textoAB64(contenido),
        branch: rama,
        ...(sha ? { sha } : {}),
      }),
    },
  );
  return { sha: datos.content.sha };
}

export async function borrarArchivo(ruta: string, sha: string, mensaje: string): Promise<void> {
  const { owner, name, rama } = config();
  await api(`/repos/${owner}/${name}/contents/${encodeURI(ruta)}`, {
    method: "DELETE",
    body: JSON.stringify({ message: mensaje, sha, branch: rama }),
  });
}

/** Añade texto al final de un fichero, creándolo si no existe. */
export async function anexar(ruta: string, texto: string, mensaje: string): Promise<void> {
  const actual = await leerArchivo(ruta);
  const base = actual?.contenido ?? "";
  const separador = base.length && !base.endsWith("\n") ? "\n" : "";
  await guardarArchivo(ruta, base + separador + texto, mensaje, actual?.sha);
}

/**
 * Lee un fichero por su sha de blob. El árbol ya trae los shas, así que buscar
 * en todo el proyecto no necesita resolver rutas una por una.
 */
export async function leerBlob(sha: string): Promise<string> {
  const { owner, name } = config();
  const datos = await api<{ content: string; encoding: string }>(
    `/repos/${owner}/${name}/git/blobs/${sha}`,
  );
  return datos.encoding === "base64" ? b64aTexto(datos.content) : datos.content;
}

export function repoConfigurado(): boolean {
  return Boolean(process.env.GITHUB_REPO && process.env.GITHUB_TOKEN);
}
