import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularRacha } from "./rachas.ts";

/** Fecha local a mediodía, para que ningún huso la desplace de día. */
const dia = (s: string) => new Date(`${s}T12:00:00`).toISOString();

test("sin commits no hay racha", () => {
  const r = calcularRacha([], "2026-08-01");
  assert.equal(r.actual, 0);
  assert.equal(r.mejor, 0);
  assert.equal(r.diasActivos, 0);
});

test("dias consecutivos hasta hoy cuentan como racha actual", () => {
  const r = calcularRacha(
    [dia("2026-07-30"), dia("2026-07-31"), dia("2026-08-01")],
    "2026-08-01",
  );
  assert.equal(r.actual, 3);
  assert.equal(r.mejor, 3);
});

test("la racha sigue viva si escribiste ayer y hoy aun no", () => {
  const r = calcularRacha([dia("2026-07-30"), dia("2026-07-31")], "2026-08-01");
  assert.equal(r.actual, 2, "el dia de hoy no ha terminado todavia");
});

test("se rompe si pasaron dos dias sin escribir", () => {
  const r = calcularRacha([dia("2026-07-28"), dia("2026-07-29")], "2026-08-01");
  assert.equal(r.actual, 0);
  assert.equal(r.mejor, 2);
});

test("varios commits el mismo dia cuentan como un solo dia", () => {
  const r = calcularRacha(
    [dia("2026-08-01"), dia("2026-08-01"), dia("2026-08-01")],
    "2026-08-01",
  );
  assert.equal(r.actual, 1);
  assert.equal(r.diasActivos, 1);
  assert.equal(r.ultimos.at(-1)?.commits, 3);
});

test("la mejor racha se conserva aunque la actual se haya roto", () => {
  const r = calcularRacha(
    [
      dia("2026-07-01"), dia("2026-07-02"), dia("2026-07-03"), dia("2026-07-04"),
      dia("2026-07-31"),
    ],
    "2026-08-01",
  );
  assert.equal(r.mejor, 4);
  assert.equal(r.actual, 1);
});

test("los ultimos 14 dias terminan en hoy", () => {
  const r = calcularRacha([dia("2026-08-01")], "2026-08-01");
  assert.equal(r.ultimos.length, 14);
  assert.equal(r.ultimos[0].dia, "2026-07-19");
  assert.equal(r.ultimos.at(-1)?.dia, "2026-08-01");
});

test("cruza el cambio de mes sin romperse", () => {
  const r = calcularRacha([dia("2026-07-31"), dia("2026-08-01")], "2026-08-01");
  assert.equal(r.actual, 2);
});
