import { test } from "node:test";
import assert from "node:assert/strict";
import {
  agregarAnotacion,
  extraerAnotaciones,
  quitarAnotacion,
  ENCABEZADO_ANOTACIONES,
} from "./anotaciones.ts";

test("agregar anotacion crea la tabla si no existia", () => {
  const { contenido, anotacion } = agregarAnotacion(ENCABEZADO_ANOTACIONES, {
    ruta: "manuscrito/03-lo-que-hace-un-huerfano.md",
    cita: "De cómo sonaba, no.",
    comentario: "",
  });

  assert.ok(anotacion.id);
  assert.equal(anotacion.ruta, "manuscrito/03-lo-que-hace-un-huerfano.md");
  assert.equal(anotacion.cita, "De cómo sonaba, no.");
  assert.match(contenido, /# Anotaciones/);

  const leidas = extraerAnotaciones(contenido);
  assert.equal(leidas.length, 1);
  assert.deepEqual(leidas[0], anotacion);
});

test("subrayado sin comentario se distingue de uno con comentario", () => {
  let doc = ENCABEZADO_ANOTACIONES;
  doc = agregarAnotacion(doc, { ruta: "cap.md", cita: "solo subrayado", comentario: "" }).contenido;
  doc = agregarAnotacion(doc, {
    ruta: "cap.md",
    cita: "con nota",
    comentario: "esto hay que revisarlo",
  }).contenido;

  const anotaciones = extraerAnotaciones(doc);
  assert.equal(anotaciones.length, 2);
  assert.equal(anotaciones[0].comentario, "");
  assert.equal(anotaciones[1].comentario, "esto hay que revisarlo");
});

test("una cita con barras sobrevive al ciclo completo", () => {
  const { contenido, anotacion } = agregarAnotacion(ENCABEZADO_ANOTACIONES, {
    ruta: "cap.md",
    cita: "esto | no es una columna",
    comentario: "ni esto | tampoco",
  });
  const leidas = extraerAnotaciones(contenido);
  assert.deepEqual(leidas[0], anotacion);
});

test("quitar anotacion elimina solo esa fila", () => {
  let doc = ENCABEZADO_ANOTACIONES;
  const a = agregarAnotacion(doc, { ruta: "cap.md", cita: "primera", comentario: "" });
  doc = a.contenido;
  const b = agregarAnotacion(doc, { ruta: "cap.md", cita: "segunda", comentario: "" });
  doc = b.contenido;

  const restante = quitarAnotacion(doc, a.anotacion.id);
  const leidas = extraerAnotaciones(restante);
  assert.equal(leidas.length, 1);
  assert.equal(leidas[0].id, b.anotacion.id);
});

test("extraer anotaciones de un documento vacio no revienta", () => {
  assert.deepEqual(extraerAnotaciones("# Anotaciones\n\nnada todavía\n"), []);
});
