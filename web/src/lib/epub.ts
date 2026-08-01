/**
 * Generación de EPUB 3 sin dependencias pesadas.
 *
 * Un EPUB es un zip con una estructura fija. Se construye a mano en vez de
 * tirar de Pandoc porque Pandoc no corre en Vercel, y porque así exportar el
 * libro funciona igual desde el móvil que desde el PC.
 */

import { zipSync, strToU8, type Zippable } from "fflate";

export type CapituloEpub = { titulo: string; html: string };

export type MetadatosEpub = {
  titulo: string;
  autor: string;
  idioma?: string;
};

function escaparXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * XHTML es XML estricto: las etiquetas vacías de HTML deben cerrarse o el
 * lector de ebooks rechaza el fichero entero. `marked` emite HTML5, así que
 * hay que cerrarlas aquí.
 */
export function aXhtml(html: string): string {
  return html.replace(/<(br|hr|img|meta|link|source)([^>]*?)\/?>/g, (_, etiqueta, attrs) => {
    // Se quita la barra de cierre y cualquier espacio sobrante, para que
    // `<br>`, `<br/>` y `<br />` acaben todos igual.
    const limpio = String(attrs).replace(/\s*\/?\s*$/, "");
    return `<${etiqueta}${limpio}/>`;
  });
}

const CSS = `
body { font-family: Georgia, "Iowan Old Style", Palatino, serif; line-height: 1.7;
       margin: 0 1.2em; text-align: justify; hyphens: auto; }
h1 { font-size: 1.6em; text-align: center; margin: 2.5em 0 1.5em; font-weight: 600;
     page-break-before: always; }
h2 { font-size: 1.25em; margin: 2em 0 .6em; }
p { margin: 0 0 .2em; text-indent: 1.4em; }
p:first-of-type, h1 + p, h2 + p, hr + p { text-indent: 0; margin-top: .8em; }
blockquote { margin: 1.5em 2em; font-style: italic; }
hr { border: 0; border-top: 1px solid #999; width: 35%; margin: 2.5em auto; }
em { font-style: italic; } strong { font-weight: bold; }
a { color: inherit; text-decoration: none; }
`.trim();

function paginaXhtml(titulo: string, cuerpo: string, idioma: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${idioma}" lang="${idioma}">
<head>
  <meta charset="utf-8"/>
  <title>${escaparXml(titulo)}</title>
  <link rel="stylesheet" type="text/css" href="estilo.css"/>
</head>
<body>
<h1>${escaparXml(titulo)}</h1>
${cuerpo}
</body>
</html>`;
}

export function construirEpub(meta: MetadatosEpub, capitulos: CapituloEpub[]): Uint8Array {
  const idioma = meta.idioma ?? "es";
  const id = `urn:uuid:${crypto.randomUUID()}`;
  const ahora = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const nombres = capitulos.map((_, i) => `cap${String(i + 1).padStart(3, "0")}.xhtml`);

  const manifiesto = nombres
    .map((n, i) => `    <item id="c${i}" href="${n}" media-type="application/xhtml+xml"/>`)
    .join("\n");
  const lomo = nombres.map((_, i) => `    <itemref idref="c${i}"/>`).join("\n");

  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="libro-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="libro-id">${id}</dc:identifier>
    <dc:title>${escaparXml(meta.titulo)}</dc:title>
    <dc:creator>${escaparXml(meta.autor)}</dc:creator>
    <dc:language>${idioma}</dc:language>
    <meta property="dcterms:modified">${ahora}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="estilo.css" media-type="text/css"/>
${manifiesto}
  </manifest>
  <spine>
${lomo}
  </spine>
</package>`;

  const nav = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"
      xml:lang="${idioma}" lang="${idioma}">
<head><meta charset="utf-8"/><title>Índice</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Índice</h1>
    <ol>
${capitulos
  .map((c, i) => `      <li><a href="${nombres[i]}">${escaparXml(c.titulo)}</a></li>`)
  .join("\n")}
    </ol>
  </nav>
</body>
</html>`;

  const contenedor = `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  const ficheros: Zippable = {
    // `mimetype` debe ir primero y SIN comprimir: lo exige la especificación.
    mimetype: [strToU8("application/epub+zip"), { level: 0 }],
    "META-INF/container.xml": [strToU8(contenedor), { level: 6 }],
    "OEBPS/content.opf": [strToU8(opf), { level: 6 }],
    "OEBPS/nav.xhtml": [strToU8(nav), { level: 6 }],
    "OEBPS/estilo.css": [strToU8(CSS), { level: 6 }],
  };

  capitulos.forEach((c, i) => {
    ficheros[`OEBPS/${nombres[i]}`] = [
      strToU8(paginaXhtml(c.titulo, aXhtml(c.html), idioma)),
      { level: 6 },
    ];
  });

  return zipSync(ficheros);
}
