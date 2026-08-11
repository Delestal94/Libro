import { test } from "node:test";
import assert from "node:assert/strict";
import {
  agregarAnotacion,
  contarApariciones,
  editarAnotacion,
  extraerAnotaciones,
  normalizarTexto,
  posicionDeAparicion,
  quitarAnotacion,
  ENCABEZADO_ANOTACIONES,
} from "./anotaciones.ts";

const nueva = (extra: Partial<Parameters<typeof agregarAnotacion>[1]> = {}) => ({
  id: "abc123",
  ruta: "manuscrito/01-el-brindis.md",
  texto: "De cómo sonaba, no.",
  aparicion: 0,
  comentario: "",
  color: "dorado" as const,
  ...extra,
});

// --- Normalización y conteo ------------------------------------------------

test("normalizar colapsa saltos de linea y espacios repetidos", () => {
  // El caso real: el markdown parte los parrafos largos en varias lineas.
  assert.equal(normalizarTexto("de lo que\nhubiera y  al   anochecer"), "de lo que hubiera y al anochecer");
  assert.equal(normalizarTexto("  con bordes  "), "con bordes");
});

test("contar apariciones cuenta todas, incluidas las solapadas", () => {
  assert.equal(contarApariciones("—Ya. —Ya. —Ya.", "—Ya."), 3);
  assert.equal(contarApariciones("aaaa", "aa"), 3);
  assert.equal(contarApariciones("nada", "xyz"), 0);
});

test("posicion de aparicion encuentra la enesima", () => {
  const pajar = "uno dos uno dos uno";
  assert.equal(posicionDeAparicion(pajar, "uno", 0), 0);
  assert.equal(posicionDeAparicion(pajar, "uno", 1), 8);
  assert.equal(posicionDeAparicion(pajar, "uno", 2), 16);
});

test("si quedan menos apariciones que antes, cae en la ultima en vez de perderse", () => {
  // El capitulo se edito y de tres «—Ya.» quedan dos: la anotacion apuntaba a
  // la tercera. Marcar la parecida es mejor que no marcar nada.
  assert.equal(posicionDeAparicion("—Ya. —Ya.", "—Ya.", 5), 5);
});

test("si el texto ya no esta, no se inventa un sitio", () => {
  assert.equal(posicionDeAparicion("otro texto", "—Ya.", 0), -1);
});

// --- Tabla: crear, leer, editar, quitar ------------------------------------

test("agregar crea la tabla y se relee igual", () => {
  const { contenido, anotacion } = agregarAnotacion(ENCABEZADO_ANOTACIONES, nueva());
  assert.match(contenido, /# Anotaciones/);

  const leidas = extraerAnotaciones(contenido);
  assert.equal(leidas.length, 1);
  assert.deepEqual(leidas[0], anotacion);
  assert.equal(leidas[0].aparicion, 0);
  assert.equal(leidas[0].color, "dorado");
});

test("la aparicion sobrevive al ciclo de escritura y lectura", () => {
  const { contenido } = agregarAnotacion(ENCABEZADO_ANOTACIONES, nueva({ texto: "—Ya.", aparicion: 7 }));
  assert.equal(extraerAnotaciones(contenido)[0].aparicion, 7);
});

test("el texto se guarda normalizado, venga como venga", () => {
  const { contenido } = agregarAnotacion(
    ENCABEZADO_ANOTACIONES,
    nueva({ texto: "de lo que\nhubiera  y al anochecer" }),
  );
  assert.equal(extraerAnotaciones(contenido)[0].texto, "de lo que hubiera y al anochecer");
});

test("una barra dentro de la cita no parte la tabla", () => {
  const { contenido, anotacion } = agregarAnotacion(
    ENCABEZADO_ANOTACIONES,
    nueva({ texto: "esto | no es una columna", comentario: "ni esto | tampoco" }),
  );
  assert.deepEqual(extraerAnotaciones(contenido)[0], anotacion);
});

test("agregar dos veces el mismo id no duplica: la cola puede reintentar", () => {
  const primera = agregarAnotacion(ENCABEZADO_ANOTACIONES, nueva());
  const segunda = agregarAnotacion(primera.contenido, nueva());
  assert.equal(extraerAnotaciones(segunda.contenido).length, 1);
  assert.equal(segunda.anotacion.id, primera.anotacion.id);
  // Y no reescribe el fichero: el servidor lo usa para no hacer un commit vacio.
  assert.equal(segunda.contenido, primera.contenido);
});

test("editar cambia comentario y color sin tocar el anclaje", () => {
  const { contenido, anotacion } = agregarAnotacion(
    ENCABEZADO_ANOTACIONES,
    nueva({ texto: "—Ya.", aparicion: 3, comentario: "primero" }),
  );

  const r = editarAnotacion(contenido, anotacion.id, { comentario: "editado", color: "rosa" });
  assert.ok(r);
  assert.equal(r!.anotacion.comentario, "editado");
  assert.equal(r!.anotacion.color, "rosa");
  assert.equal(r!.anotacion.texto, "—Ya.");
  assert.equal(r!.anotacion.aparicion, 3, "la aparicion no se puede perder al editar");
});

test("editar algo que no existe devuelve null en vez de romper", () => {
  const { contenido } = agregarAnotacion(ENCABEZADO_ANOTACIONES, nueva());
  assert.equal(editarAnotacion(contenido, "no-existe", { comentario: "x" }), null);
});

test("quitar elimina solo esa fila", () => {
  let doc = ENCABEZADO_ANOTACIONES;
  const a = agregarAnotacion(doc, nueva({ id: "aaa", texto: "primera" }));
  doc = a.contenido;
  const b = agregarAnotacion(doc, nueva({ id: "bbb", texto: "segunda" }));
  doc = b.contenido;

  const leidas = extraerAnotaciones(quitarAnotacion(doc, "aaa"));
  assert.equal(leidas.length, 1);
  assert.equal(leidas[0].id, "bbb");
});

test("quitar algo que ya no esta no rompe: la cola puede reintentar", () => {
  const { contenido } = agregarAnotacion(ENCABEZADO_ANOTACIONES, nueva());
  assert.equal(extraerAnotaciones(quitarAnotacion(contenido, "fantasma")).length, 1);
});

// --- Migración desde las tablas de versiones anteriores ---------------------

const TABLA_V1 = `# Anotaciones

| Id | Capítulo | Cita | Comentario | Fecha |
|---|---|---|---|---|
| viejo1 | manuscrito/01-el-brindis.md | una cita vieja | con nota | 2026-08-10T00:00:00.000Z |
`;

const TABLA_V2 = `# Anotaciones

| Id | Capítulo | Cita | Comentario | Color | Fecha |
|---|---|---|---|---|---|
| viejo2 | manuscrito/01-el-brindis.md | otra cita | | celeste | 2026-08-10T00:00:00.000Z |
`;

test("una tabla vieja sin Color ni Aparicion se lee con valores por defecto", () => {
  const [a] = extraerAnotaciones(TABLA_V1);
  assert.equal(a.texto, "una cita vieja");
  assert.equal(a.comentario, "con nota");
  assert.equal(a.color, "dorado");
  assert.equal(a.aparicion, 0);
});

test("una tabla con Color pero sin Aparicion conserva el color", () => {
  assert.equal(extraerAnotaciones(TABLA_V2)[0].color, "celeste");
});

test("escribir en una tabla vieja la migra sin perder lo que habia", () => {
  const { contenido } = agregarAnotacion(TABLA_V1, nueva({ id: "nuevo", texto: "cita nueva", color: "verde" }));

  const leidas = extraerAnotaciones(contenido);
  assert.equal(leidas.length, 2);
  assert.equal(leidas[0].id, "viejo1");
  assert.equal(leidas[0].texto, "una cita vieja", "la fila vieja sigue entera");
  assert.equal(leidas[0].comentario, "con nota");
  assert.equal(leidas[1].texto, "cita nueva");
  assert.equal(leidas[1].color, "verde");

  // Y la tabla ya tiene las columnas de hoy.
  assert.match(contenido, /\| Id \| Capítulo \| Texto \| Comentario \| Color \| Aparición \| Fecha \|/);
});

test("editar en una tabla vieja tambien la migra", () => {
  const r = editarAnotacion(TABLA_V1, "viejo1", { color: "naranja" });
  assert.ok(r);
  assert.equal(r!.anotacion.color, "naranja");
  assert.equal(r!.anotacion.texto, "una cita vieja");
});

test("una fila sin texto se ignora en vez de colarse como anotacion vacia", () => {
  const roto = `# Anotaciones

| Id | Capítulo | Texto | Comentario | Color | Aparición | Fecha |
|---|---|---|---|---|---|---|
| x | cap.md |  |  | dorado | 0 | 2026-08-10T00:00:00.000Z |
`;
  assert.deepEqual(extraerAnotaciones(roto), []);
});

test("un color inventado cae al de por defecto en vez de romper el pintado", () => {
  const raro = `# Anotaciones

| Id | Capítulo | Texto | Comentario | Color | Aparición | Fecha |
|---|---|---|---|---|---|---|
| x | cap.md | algo |  | fucsia | 0 | 2026-08-10T00:00:00.000Z |
`;
  assert.equal(extraerAnotaciones(raro)[0].color, "dorado");
});

test("una aparicion no numerica cae a 0", () => {
  const raro = `# Anotaciones

| Id | Capítulo | Texto | Comentario | Color | Aparición | Fecha |
|---|---|---|---|---|---|---|
| x | cap.md | algo |  | dorado | ??? | 2026-08-10T00:00:00.000Z |
`;
  assert.equal(extraerAnotaciones(raro)[0].aparicion, 0);
});

test("extraer de un documento sin tabla devuelve lista vacia", () => {
  assert.deepEqual(extraerAnotaciones("# Anotaciones\n\nnada todavía\n"), []);
});
