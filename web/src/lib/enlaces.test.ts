import { test } from "node:test";
import assert from "node:assert/strict";
import {
  construirIndice,
  enlacesAHtml,
  enlacesRotos,
  extraerEnlaces,
  resolver,
  retroenlaces,
} from "./enlaces.ts";

const DOCS = [
  { ruta: "biblia/personajes.md", titulo: "Personajes", contenido: "" },
  { ruta: "biblia/mundo.md", titulo: "Mundo y reglas", contenido: "" },
  { ruta: "manuscrito/03-la-torre-ambar.md", titulo: "La Torre Ámbar", contenido: "" },
];
const INDICE = construirIndice(DOCS);

test("extrae enlaces y no repite destinos", () => {
  const e = extraerEnlaces("Ver [[Mundo]] y [[Mundo]] otra vez, y [[Personajes]].");
  assert.deepEqual(
    e.map((x) => x.destino),
    ["Mundo", "Personajes"],
  );
});

test("soporta la forma [[destino|texto]]", () => {
  const [e] = extraerEnlaces("[[biblia/mundo.md|las reglas]]");
  assert.equal(e.destino, "biblia/mundo.md");
  assert.equal(e.texto, "las reglas");
});

test("resuelve ignorando acentos, mayusculas y guiones", () => {
  const esperado = "manuscrito/03-la-torre-ambar.md";
  for (const forma of ["La Torre Ámbar", "la torre ambar", "LA-TORRE-AMBAR", "03-la-torre-ambar"]) {
    assert.equal(resolver(forma, INDICE), esperado, `fallo con: ${forma}`);
  }
});

test("resuelve por ruta completa y por titulo", () => {
  assert.equal(resolver("biblia/mundo.md", INDICE), "biblia/mundo.md");
  assert.equal(resolver("Mundo y reglas", INDICE), "biblia/mundo.md");
});

test("detecta enlaces rotos", () => {
  assert.deepEqual(enlacesRotos("[[Mundo y reglas]] y [[Rey del Invierno]]", INDICE), [
    "Rey del Invierno",
  ]);
});

test("retroenlaces: quien apunta a un documento, una vez por documento", () => {
  const docs = [
    { ruta: "manuscrito/01-a.md", titulo: "A", contenido: "Fue a [[La Torre Ámbar]].\nY otra vez [[la torre ambar]]." },
    { ruta: "manuscrito/02-b.md", titulo: "B", contenido: "Nada que ver aquí." },
    { ruta: "biblia/mundo.md", titulo: "Mundo y reglas", contenido: "La [[Torre Ámbar]] no existe con ese nombre." },
  ];
  const r = retroenlaces("manuscrito/03-la-torre-ambar.md", docs, INDICE);
  assert.deepEqual(
    r.map((x) => x.desde),
    ["manuscrito/01-a.md"],
  );
  assert.equal(r[0].contexto, "Fue a La Torre Ámbar.");
});

test("un documento no se enlaza a si mismo", () => {
  const docs = [
    { ruta: "biblia/mundo.md", titulo: "Mundo y reglas", contenido: "Yo soy [[Mundo y reglas]]." },
  ];
  assert.deepEqual(retroenlaces("biblia/mundo.md", docs, INDICE), []);
});

test("a HTML: existentes enlazan, rotos se marcan", () => {
  const html = enlacesAHtml("[[Mundo y reglas]] y [[Rey del Invierno]]", INDICE);
  assert.match(html, /<a class="enlace-wiki" href="\/editar\/biblia\/mundo\.md">Mundo y reglas<\/a>/);
  assert.match(html, /<span class="enlace-roto"[^>]*>Rey del Invierno<\/span>/);
});

test("a HTML: escapa el texto para que no se cuele marcado", () => {
  const html = enlacesAHtml('[[x|<img src=x onerror="alert(1)">]]', INDICE);
  assert.ok(!html.includes("<img"), "no debe emitir la etiqueta img");
  assert.match(html, /&lt;img/);
});

test("ignora corchetes vacios o sueltos", () => {
  assert.deepEqual(extraerEnlaces("[[]] y [[   ]] y [ [no] ]"), []);
});
