import { test } from "node:test";
import assert from "node:assert/strict";
import {
  agregarAnotacion,
  editarAnotacion,
  extraerAnotaciones,
  quitarAnotacion,
  ENCABEZADO_ANOTACIONES,
} from "./anotaciones.ts";

test("agregar anotacion crea la tabla si no existia", () => {
  const { contenido, anotacion } = agregarAnotacion(ENCABEZADO_ANOTACIONES, {
    ruta: "manuscrito/03-lo-que-hace-un-huerfano.md",
    cita: "De cómo sonaba, no.",
    comentario: "",
    color: "dorado",
  });

  assert.ok(anotacion.id);
  assert.equal(anotacion.ruta, "manuscrito/03-lo-que-hace-un-huerfano.md");
  assert.equal(anotacion.cita, "De cómo sonaba, no.");
  assert.equal(anotacion.color, "dorado");
  assert.match(contenido, /# Anotaciones/);

  const leidas = extraerAnotaciones(contenido);
  assert.equal(leidas.length, 1);
  assert.deepEqual(leidas[0], anotacion);
});

test("subrayado sin comentario se distingue de uno con comentario", () => {
  let doc = ENCABEZADO_ANOTACIONES;
  doc = agregarAnotacion(doc, {
    ruta: "cap.md",
    cita: "solo subrayado",
    comentario: "",
    color: "verde",
  }).contenido;
  doc = agregarAnotacion(doc, {
    ruta: "cap.md",
    cita: "con nota",
    comentario: "esto hay que revisarlo",
    color: "rosa",
  }).contenido;

  const anotaciones = extraerAnotaciones(doc);
  assert.equal(anotaciones.length, 2);
  assert.equal(anotaciones[0].comentario, "");
  assert.equal(anotaciones[0].color, "verde");
  assert.equal(anotaciones[1].comentario, "esto hay que revisarlo");
  assert.equal(anotaciones[1].color, "rosa");
});

test("una cita con barras sobrevive al ciclo completo", () => {
  const { contenido, anotacion } = agregarAnotacion(ENCABEZADO_ANOTACIONES, {
    ruta: "cap.md",
    cita: "esto | no es una columna",
    comentario: "ni esto | tampoco",
    color: "celeste",
  });
  const leidas = extraerAnotaciones(contenido);
  assert.deepEqual(leidas[0], anotacion);
});

test("quitar anotacion elimina solo esa fila", () => {
  let doc = ENCABEZADO_ANOTACIONES;
  const a = agregarAnotacion(doc, { ruta: "cap.md", cita: "primera", comentario: "", color: "dorado" });
  doc = a.contenido;
  const b = agregarAnotacion(doc, { ruta: "cap.md", cita: "segunda", comentario: "", color: "dorado" });
  doc = b.contenido;

  const restante = quitarAnotacion(doc, a.anotacion.id);
  const leidas = extraerAnotaciones(restante);
  assert.equal(leidas.length, 1);
  assert.equal(leidas[0].id, b.anotacion.id);
});

test("extraer anotaciones de un documento vacio no revienta", () => {
  assert.deepEqual(extraerAnotaciones("# Anotaciones\n\nnada todavía\n"), []);
});

test("una tabla vieja sin columna Color se lee con el color por defecto", () => {
  const vieja = `# Anotaciones\n\n| Id | Capítulo | Cita | Comentario | Fecha |\n|---|---|---|---|---|\n| abc123 | cap.md | una cita vieja | | 2026-08-10T00:00:00.000Z |\n`;
  const leidas = extraerAnotaciones(vieja);
  assert.equal(leidas.length, 1);
  assert.equal(leidas[0].color, "dorado");
  assert.equal(leidas[0].cita, "una cita vieja");
});

test("agregar una fila nueva a una tabla vieja la migra sin perder la anterior", () => {
  const vieja = `# Anotaciones\n\n| Id | Capítulo | Cita | Comentario | Fecha |\n|---|---|---|---|---|\n| abc123 | cap.md | una cita vieja | | 2026-08-10T00:00:00.000Z |\n`;
  const { contenido, anotacion } = agregarAnotacion(vieja, {
    ruta: "cap.md",
    cita: "una cita nueva",
    comentario: "",
    color: "naranja",
  });

  const leidas = extraerAnotaciones(contenido);
  assert.equal(leidas.length, 2);
  assert.equal(leidas[0].cita, "una cita vieja");
  assert.equal(leidas[0].color, "dorado");
  assert.equal(leidas[1].cita, "una cita nueva");
  assert.equal(leidas[1].color, "naranja");
  assert.equal(anotacion.color, "naranja");
});

test("editar anotacion cambia comentario y color sin tocar la cita", () => {
  let doc = ENCABEZADO_ANOTACIONES;
  const { contenido, anotacion } = agregarAnotacion(doc, {
    ruta: "cap.md",
    cita: "la cita",
    comentario: "primer comentario",
    color: "dorado",
  });
  doc = contenido;

  const resultado = editarAnotacion(doc, anotacion.id, { comentario: "comentario editado", color: "rosa" });
  assert.ok(resultado);
  assert.equal(resultado!.anotacion.comentario, "comentario editado");
  assert.equal(resultado!.anotacion.color, "rosa");
  assert.equal(resultado!.anotacion.cita, "la cita");

  const leidas = extraerAnotaciones(resultado!.contenido);
  assert.equal(leidas.length, 1);
  assert.equal(leidas[0].comentario, "comentario editado");
  assert.equal(leidas[0].color, "rosa");
});

test("editar una anotacion que no existe devuelve null", () => {
  const doc = agregarAnotacion(ENCABEZADO_ANOTACIONES, {
    ruta: "cap.md",
    cita: "algo",
    comentario: "",
    color: "dorado",
  }).contenido;
  assert.equal(editarAnotacion(doc, "id-inexistente", { comentario: "x" }), null);
});
