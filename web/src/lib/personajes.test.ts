import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aClave,
  camposRellenos,
  componerCabecera,
  etiquetaDe,
  fichaNueva,
  iniciales,
  leerPersonaje,
  separarCabecera,
} from "./personajes.ts";

const FICHA = `---
nombre: Frieren
edad: 1000
edad_aparente: 17
color_favorito: violeta
---

# Frieren

## Biografía

Sobrevivió a todos.
`;

test("separa cabecera y cuerpo", () => {
  const { datos, cuerpo } = separarCabecera(FICHA);
  assert.equal(datos.nombre, "Frieren");
  assert.equal(datos.edad, "1000");
  assert.match(cuerpo, /^# Frieren/);
  assert.ok(!cuerpo.includes("---"));
});

test("sin cabecera, todo es cuerpo", () => {
  const { datos, cuerpo } = separarCabecera("# Solo texto\n\nhola");
  assert.deepEqual(datos, {});
  assert.equal(cuerpo, "# Solo texto\n\nhola");
});

test("el nombre sale de la cabecera, del encabezado o del fichero", () => {
  assert.equal(leerPersonaje("biblia/personajes/x.md", FICHA).nombre, "Frieren");
  assert.equal(
    leerPersonaje("biblia/personajes/x.md", "# Solo Encabezado\n").nombre,
    "Solo Encabezado",
  );
  assert.equal(leerPersonaje("biblia/personajes/la-torre.md", "").nombre, "la torre");
});

test("los campos propios aparecen despues de los sugeridos", () => {
  const p = leerPersonaje("biblia/personajes/frieren.md", FICHA);
  const campos = camposRellenos(p);
  assert.deepEqual(
    campos.map((c) => c.clave),
    ["edad", "edad_aparente", "color_favorito"],
  );
  // `nombre` es el título de la ficha, no una fila más.
  assert.ok(!campos.some((c) => c.clave === "nombre"));
});

test("un campo inventado recibe etiqueta legible", () => {
  assert.equal(etiquetaDe("color_favorito"), "Color favorito");
  assert.equal(etiquetaDe("edad"), "Edad");
});

test("aClave convierte texto libre en clave valida", () => {
  assert.equal(aClave("Color favorito"), "color_favorito");
  assert.equal(aClave("Grado en la Escalera"), "grado_en_la_escalera");
  assert.equal(aClave("  ¿Año?  "), "ano");
});

test("componer y separar es un ciclo cerrado", () => {
  const datos = { nombre: "Frieren", edad: "1000", nota: "dijo: hola" };
  const { datos: vuelta } = separarCabecera(componerCabecera(datos, "# X\n"));
  assert.deepEqual(vuelta, datos);
});

test("valores con dos puntos o comillas sobreviven al ciclo", () => {
  const datos = {
    frase: 'dijo: "no"',
    rango: "1: aprendiz",
    guion: "- empieza con guion",
  };
  const { datos: vuelta } = separarCabecera(componerCabecera(datos, ""));
  assert.equal(vuelta.rango, "1: aprendiz");
  assert.equal(vuelta.guion, "- empieza con guion");
});

test("los campos vacios no se escriben en la cabecera", () => {
  const salida = componerCabecera({ nombre: "X", edad: "", altura: "   " }, "# X\n");
  assert.match(salida, /nombre: X/);
  assert.ok(!salida.includes("edad:"));
  assert.ok(!salida.includes("altura:"));
});

test("quitar un campo lo elimina de verdad del fichero", () => {
  const p = leerPersonaje("biblia/personajes/f.md", FICHA);
  const { color_favorito, ...resto } = p.ficha;
  void color_favorito;
  const salida = componerCabecera(resto, p.cuerpo);
  assert.ok(!salida.includes("color_favorito"));
  assert.match(salida, /edad: 1000/);
  assert.match(salida, /Sobrevivió a todos/);
});

test("una ficha nueva se puede releer sin perder nada", () => {
  const texto = fichaNueva("Rey del Invierno", { edad: "desconocida" });
  const p = leerPersonaje("biblia/personajes/rey.md", texto);
  assert.equal(p.nombre, "Rey del Invierno");
  assert.equal(p.ficha.edad, "desconocida");
  assert.match(p.cuerpo, /## Biografía/);
});

test("iniciales para el avatar", () => {
  assert.equal(iniciales("Frieren"), "FR");
  assert.equal(iniciales("Rey del Invierno"), "RI");
  assert.equal(iniciales(""), "?");
});
