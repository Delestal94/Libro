import { test } from "node:test";
import assert from "node:assert/strict";
import { anadirFila, extraerTabla, reemplazarTabla, tablaAMarkdown } from "./tablas.ts";

const DOC = `# Pistas

> Una nota antes de la tabla.

| Pista | Sembrada | Recogida | Estado |
|---|---|---|---|
| El nombre del Archivo | cap. 1 | — | pendiente |
| La puerta sin cerradura | cap. 3 | cap. 9 | pagada |

Y un párrafo después que no se debe perder.
`;

test("extrae la tabla con cabeceras y filas", () => {
  const t = extraerTabla(DOC);
  assert.ok(t);
  assert.deepEqual(t.cabeceras, ["Pista", "Sembrada", "Recogida", "Estado"]);
  assert.equal(t.filas.length, 2);
  assert.deepEqual(t.filas[1], ["La puerta sin cerradura", "cap. 3", "cap. 9", "pagada"]);
});

test("devuelve null si no hay tabla", () => {
  assert.equal(extraerTabla("# Solo texto\n\nsin tablas."), null);
});

test("ignora las filas de plantilla vacias", () => {
  const t = extraerTabla("| A | B |\n|---|---|\n| | |\n| x | y |");
  assert.deepEqual(t?.filas, [["x", "y"]]);
});

test("rellena filas cortas al ancho de la cabecera", () => {
  const t = extraerTabla("| A | B | C |\n|---|---|---|\n| solo-a |");
  assert.deepEqual(t?.filas, [["solo-a", "", ""]]);
});

test("reemplazar conserva lo de antes y lo de despues", () => {
  const t = extraerTabla(DOC);
  const nuevo = reemplazarTabla(DOC, { ...t, filas: [["X", "Y", "Z", "W"]] });
  assert.match(nuevo, /# Pistas/);
  assert.match(nuevo, /Una nota antes de la tabla/);
  assert.match(nuevo, /Y un párrafo después que no se debe perder/);
  assert.match(nuevo, /\| X \| Y \| Z \| W \|/);
  assert.ok(!nuevo.includes("La puerta sin cerradura"));
});

test("anadir fila no pierde las anteriores", () => {
  const nuevo = anadirFila(DOC, ["Nueva", "cap. 5", "", "pendiente"], []);
  const t = extraerTabla(nuevo);
  assert.equal(t?.filas.length, 3);
  assert.deepEqual(t?.filas[2], ["Nueva", "cap. 5", "", "pendiente"]);
  assert.match(nuevo, /Y un párrafo después/);
});

test("anadir fila crea la tabla si el documento no tenia", () => {
  const nuevo = anadirFila("# Vacío\n", ["a", "b"], ["Uno", "Dos"]);
  const t = extraerTabla(nuevo);
  assert.deepEqual(t?.cabeceras, ["Uno", "Dos"]);
  assert.deepEqual(t?.filas, [["a", "b"]]);
  assert.match(nuevo, /# Vacío/);
});

test("una barra dentro de una celda sobrevive al ciclo completo", () => {
  const md = tablaAMarkdown({ cabeceras: ["A", "B"], filas: [["x | y", "z"]] });
  assert.deepEqual(extraerTabla(md)?.filas, [["x | y", "z"]]);
});

test("acepta tablas sin barras en los extremos", () => {
  const t = extraerTabla("A | B\n--- | ---\n1 | 2");
  assert.deepEqual(t?.cabeceras, ["A", "B"]);
  assert.deepEqual(t?.filas, [["1", "2"]]);
});
