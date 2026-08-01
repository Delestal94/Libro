import { test } from "node:test";
import assert from "node:assert/strict";
import { unzipSync, strFromU8 } from "fflate";
import { aXhtml, construirEpub } from "./epub.ts";

const META = { titulo: "El préstamo de los nombres", autor: "Miguel Ignacio" };
const CAPS = [
  { titulo: "La torre Ámbar", html: "<p>Primero.</p>\n<hr>\n<p>Después.</p>" },
  { titulo: "El Archivo", html: "<p>Un <em>nombre</em> & otro.</p><br>" },
];

const abrir = () => unzipSync(construirEpub(META, CAPS));

test("contiene los ficheros obligatorios de un EPUB", () => {
  const z = abrir();
  for (const f of ["mimetype", "META-INF/container.xml", "OEBPS/content.opf", "OEBPS/nav.xhtml"]) {
    assert.ok(z[f], `falta ${f}`);
  }
});

test("mimetype es el primer fichero y tiene el contenido exacto", () => {
  const bytes = construirEpub(META, CAPS);
  assert.equal(strFromU8(abrir()["mimetype"]), "application/epub+zip");

  // La especificación exige que 'mimetype' sea la primera entrada del zip.
  const cabecera = strFromU8(bytes.slice(30, 38));
  assert.equal(cabecera, "mimetype", "mimetype debe ir primero en el archivo");
});

test("mimetype va sin comprimir, como exige la especificacion", () => {
  const bytes = construirEpub(META, CAPS);
  // Bytes 8-9 de la cabecera local: metodo de compresion. 0 = almacenado.
  const metodo = bytes[8] | (bytes[9] << 8);
  assert.equal(metodo, 0, "mimetype no puede ir comprimido");
});

test("hay un XHTML por capitulo y estan en el indice", () => {
  const z = abrir();
  assert.ok(z["OEBPS/cap001.xhtml"]);
  assert.ok(z["OEBPS/cap002.xhtml"]);
  assert.ok(!z["OEBPS/cap003.xhtml"]);

  const nav = strFromU8(z["OEBPS/nav.xhtml"]);
  assert.match(nav, /cap001\.xhtml/);
  assert.match(nav, /cap002\.xhtml/);
});

test("el OPF declara titulo, autor y todos los capitulos en el lomo", () => {
  const opf = strFromU8(abrir()["OEBPS/content.opf"]);
  assert.match(opf, /<dc:title>El préstamo de los nombres<\/dc:title>/);
  assert.match(opf, /<dc:creator>Miguel Ignacio<\/dc:creator>/);
  assert.match(opf, /<itemref idref="c0"\/>/);
  assert.match(opf, /<itemref idref="c1"\/>/);
});

test("las etiquetas vacias se cierran: XHTML es XML estricto", () => {
  assert.equal(aXhtml("<p>a</p><br>"), "<p>a</p><br/>");
  assert.equal(aXhtml("<hr>"), "<hr/>");
  assert.equal(aXhtml('<img src="x.png">'), '<img src="x.png"/>');
  // Si ya venía cerrada, no se duplica la barra.
  assert.equal(aXhtml("<br/>"), "<br/>");
  assert.equal(aXhtml("<br />"), "<br/>");
});

/**
 * Verificador de buena formación con pila: cada etiqueta que se abre debe
 * cerrarse, y en el orden correcto. Es la comprobación que hace un lector de
 * ebooks antes de rechazar un fichero.
 */
function malFormado(xml: string): string | null {
  const pila: string[] = [];

  for (const [etiqueta] of xml.matchAll(/<[^>]+>/g)) {
    if (etiqueta.startsWith("<?") || etiqueta.startsWith("<!")) continue;
    if (etiqueta.endsWith("/>")) continue;

    if (etiqueta.startsWith("</")) {
      const nombre = etiqueta.slice(2, -1).trim();
      const ultima = pila.pop();
      if (ultima !== nombre) return `cierra </${nombre}> pero estaba abierta <${ultima ?? "nada"}>`;
    } else {
      pila.push(etiqueta.slice(1, -1).trim().split(/\s/)[0]);
    }
  }

  return pila.length ? `quedan sin cerrar: ${pila.join(", ")}` : null;
}

test("el verificador de buena formacion detecta errores de verdad", () => {
  assert.equal(malFormado("<p>hola</p>"), null);
  assert.equal(malFormado("<p><em>x</em></p>"), null);
  assert.equal(malFormado("<p>x<br/></p>"), null);
  assert.ok(malFormado("<p>x"), "debe detectar una etiqueta sin cerrar");
  assert.ok(malFormado("<p><em>x</p></em>"), "debe detectar el anidamiento cruzado");
  assert.ok(malFormado("<p>x<br></p>"), "debe detectar <br> sin cerrar");
});

test("cada capitulo es XML bien formado", () => {
  const z = abrir();
  for (const nombre of ["OEBPS/cap001.xhtml", "OEBPS/cap002.xhtml"]) {
    const xml = strFromU8(z[nombre]);
    assert.match(xml, /^<\?xml version="1\.0" encoding="utf-8"\?>/);
    assert.equal(malFormado(xml), null, `${nombre} está mal formado`);
  }
});

test("el indice y el OPF tambien son XML bien formado", () => {
  const z = abrir();
  for (const nombre of ["OEBPS/nav.xhtml", "OEBPS/content.opf", "META-INF/container.xml"]) {
    assert.equal(malFormado(strFromU8(z[nombre])), null, `${nombre} está mal formado`);
  }
});

test("los caracteres especiales del titulo se escapan en el XML", () => {
  const z = unzipSync(
    construirEpub({ titulo: 'Tú & "yo" <siempre>', autor: "X" }, [
      { titulo: "A & B", html: "<p>x</p>" },
    ]),
  );
  const opf = strFromU8(z["OEBPS/content.opf"]);
  assert.match(opf, /Tú &amp; &quot;yo&quot; &lt;siempre&gt;/);
  assert.ok(!opf.includes("<siempre>"), "no debe colarse marcado sin escapar");
});
