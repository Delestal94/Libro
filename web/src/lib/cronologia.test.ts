import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calcularTramos,
  deducirAnio,
  deducirCapitulo,
  describirSalto,
  interpretarConocimiento,
  interpretarFilas,
  ordenar,
} from "./cronologia.ts";

test("deduce anios de formas corrientes de escribirlos", () => {
  assert.equal(deducirAnio("1200"), 1200);
  assert.equal(deducirAnio("año 1200"), 1200);
  assert.equal(deducirAnio("Año 847 de la Ceniza"), 847);
});

test("lo que mira hacia atras sale negativo", () => {
  assert.equal(deducirAnio("300 a.C."), -300);
  assert.equal(deducirAnio("hace 300 años"), -300);
  assert.equal(deducirAnio("hace 1000 años"), -1000);
  assert.equal(deducirAnio("-450"), -450);
});

test("las fechas completas afinan el orden dentro del mismo anio", () => {
  const enero = deducirAnio("1200-01-01")!;
  const junio = deducirAnio("1200-06-01")!;
  const diciembre = deducirAnio("1200-12-31")!;
  assert.ok(enero < junio && junio < diciembre, "deben ordenarse dentro del año");
  assert.ok(diciembre < 1201, "no deben desbordar al año siguiente");
  assert.equal(Math.floor(enero), 1200);
});

test("devuelve null antes que inventarse una fecha", () => {
  assert.equal(deducirAnio("mucho antes"), null);
  assert.equal(deducirAnio(""), null);
  assert.equal(deducirAnio("   "), null);
  assert.equal(deducirAnio("en tiempos del Rey"), null);
});

test("deduce el capitulo escrito de cualquier manera", () => {
  assert.equal(deducirCapitulo("cap. 3"), 3);
  assert.equal(deducirCapitulo("capítulo 12"), 12);
  assert.equal(deducirCapitulo("7"), 7);
  assert.equal(deducirCapitulo("prólogo"), null);
});

test("interpreta lo que sabe el lector", () => {
  assert.equal(interpretarConocimiento("sí"), "sabe");
  assert.equal(interpretarConocimiento("lo sabe"), "sabe");
  assert.equal(interpretarConocimiento("revelado"), "sabe");
  assert.equal(interpretarConocimiento("no"), "ignora");
  assert.equal(interpretarConocimiento("ni idea"), "ignora");
  assert.equal(interpretarConocimiento("lo sospecha"), "sospecha");
  assert.equal(interpretarConocimiento("intuye algo"), "sospecha");
  assert.equal(interpretarConocimiento(""), "desconocido");
});

const FILAS = [
  ["1200", "Cae la torre", "cap. 9", "no"],
  ["hace 300 años", "El pacto", "cap. 3", "sospecha"],
  ["en tiempos del Rey", "Algo antiguo", "", ""],
  ["1201", "La huida", "cap. 1", "sí"],
];

test("ordenar por el reloj del mundo", () => {
  const { situados, sueltos } = ordenar(interpretarFilas(FILAS), "mundo");
  assert.deepEqual(
    situados.map((s) => s.que),
    ["El pacto", "Cae la torre", "La huida"],
  );
  assert.deepEqual(
    sueltos.map((s) => s.que),
    ["Algo antiguo"],
  );
});

test("ordenar por el reloj del lector da un orden distinto", () => {
  const { situados, sueltos } = ordenar(interpretarFilas(FILAS), "lector");
  assert.deepEqual(
    situados.map((s) => s.que),
    ["La huida", "El pacto", "Cae la torre"],
  );
  // Sin capítulo no se puede situar en el eje del lector.
  assert.deepEqual(
    sueltos.map((s) => s.que),
    ["Algo antiguo"],
  );
});

test("empates conservan el orden en que se escribieron", () => {
  const filas = [
    ["1200", "Primero escrito", "", ""],
    ["1200", "Segundo escrito", "", ""],
  ];
  const { situados } = ordenar(interpretarFilas(filas), "mundo");
  assert.deepEqual(
    situados.map((s) => s.que),
    ["Primero escrito", "Segundo escrito"],
  );
});

test("los tramos marcan el salto grande y no el pequeno", () => {
  const filas = [
    ["1000", "A", "", ""],
    ["1001", "B", "", ""],
    ["1900", "C", "", ""],
  ];
  const { situados } = ordenar(interpretarFilas(filas), "mundo");
  const tramos = calcularTramos(situados, "mundo");

  assert.equal(tramos[0].hueco, 0, "el primero no tiene hueco previo");
  assert.equal(tramos[0].saltoGrande, false);
  assert.equal(tramos[1].saltoGrande, false, "1 año no es un salto grande");
  assert.equal(tramos[2].saltoGrande, true, "899 años sí lo es");
  assert.equal(tramos[2].distancia, 899);
});

test("un solo suceso no rompe el calculo de tramos", () => {
  const { situados } = ordenar(interpretarFilas([["1200", "Solo", "", ""]]), "mundo");
  const tramos = calcularTramos(situados, "mundo");
  assert.equal(tramos.length, 1);
  assert.ok(Number.isFinite(tramos[0].hueco));
});

test("sucesos simultaneos no generan huecos invalidos", () => {
  const filas = [
    ["1200", "A", "", ""],
    ["1200", "B", "", ""],
  ];
  const { situados } = ordenar(interpretarFilas(filas), "mundo");
  for (const t of calcularTramos(situados, "mundo")) {
    assert.ok(Number.isFinite(t.hueco) && t.hueco >= 0, `hueco invalido: ${t.hueco}`);
  }
});

test("describir el salto en lenguaje llano", () => {
  assert.equal(describirSalto(300, "mundo"), "300 años después");
  assert.equal(describirSalto(1, "mundo"), "1 año después");
  assert.equal(describirSalto(0, "mundo"), "el mismo momento");
  assert.equal(describirSalto(1, "lector"), "1 capítulo después");
  assert.equal(describirSalto(5, "lector"), "5 capítulos después");
});
