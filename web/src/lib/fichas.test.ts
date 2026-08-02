import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LISTA_TIPOS,
  TIPOS,
  aClave,
  camposRellenos,
  componerCabecera,
  esFicha,
  esTipoValido,
  etiquetaDe,
  fichaNueva,
  iniciales,
  leerFicha,
  separarCabecera,
  slugValido,
  tipoDeRuta,
} from "./fichas.ts";

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

// --- Cabecera ---

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

test("componer y separar es un ciclo cerrado", () => {
  const datos = { nombre: "Frieren", edad: "1000", nota: "dijo: hola" };
  const { datos: vuelta } = separarCabecera(componerCabecera(datos, "# X\n"));
  assert.deepEqual(vuelta, datos);
});

test("valores con dos puntos, comillas o guion inicial sobreviven", () => {
  const datos = {
    frase: 'dijo: "no"',
    rango: "1: aprendiz",
    guion: "- empieza con guion",
    barra: 'una \\ y una "',
  };
  const { datos: vuelta } = separarCabecera(componerCabecera(datos, ""));
  assert.deepEqual(vuelta, datos);
});

test("editar diez veces no corrompe un valor entrecomillado", () => {
  // Un valor con comillas dentro se degradaba una barra por edición.
  let texto = componerCabecera({ frase: 'Él dijo: "no vuelvas"' }, "# X\n");
  for (let i = 0; i < 10; i++) {
    const { datos, cuerpo } = separarCabecera(texto);
    texto = componerCabecera(datos, cuerpo);
  }
  assert.equal(separarCabecera(texto).datos.frase, 'Él dijo: "no vuelvas"');
});

test("los campos vacios no se escriben en la cabecera", () => {
  const salida = componerCabecera({ nombre: "X", edad: "", altura: "   " }, "# X\n");
  assert.match(salida, /nombre: X/);
  assert.ok(!salida.includes("edad:"));
  assert.ok(!salida.includes("altura:"));
});

// --- Tipos ---

test("cada tipo tiene su carpeta y se reconoce por la ruta", () => {
  assert.equal(tipoDeRuta("biblia/personajes/frieren.md"), "personajes");
  assert.equal(tipoDeRuta("biblia/lugares/ciudad-jardin.md"), "lugares");
  assert.equal(tipoDeRuta("biblia/fauna/nirai.md"), "fauna");
  assert.equal(tipoDeRuta("biblia/flora/lasharil.md"), "flora");
});

test("fauna y flora no se confunden entre si", () => {
  // Comparten forma pero son apartados distintos: una ruta sólo cae en uno.
  assert.equal(tipoDeRuta("biblia/flora/x.md"), "flora");
  assert.equal(tipoDeRuta("biblia/fauna/x.md"), "fauna");
  assert.notEqual(TIPOS.fauna.carpeta, TIPOS.flora.carpeta);
});

test("lo que no es una ficha no se confunde con una", () => {
  for (const ruta of [
    "biblia/mundo.md",
    "manuscrito/01-x.md",
    "notas/inbox.md",
    "biblia/personajes/x.txt",
    "web/src/lib/fichas.ts",
  ]) {
    assert.equal(tipoDeRuta(ruta), null, `no deberia ser ficha: ${ruta}`);
    assert.equal(esFicha(ruta), false);
  }
});

test("esTipoValido acepta los cuatro y rechaza el resto", () => {
  for (const t of ["personajes", "lugares", "fauna", "flora"]) {
    assert.ok(esTipoValido(t), `deberia valer: ${t}`);
  }
  for (const t of ["capitulos", "criaturas", "../personajes", "", "Fauna"]) {
    assert.ok(!esTipoValido(t), `no deberia valer: ${t}`);
  }
});

test("esTipoValido cubre exactamente los tipos declarados", () => {
  // Si se añade un tipo a TIPOS y se olvida en esTipoValido, la API lo rechazaria.
  for (const t of LISTA_TIPOS) {
    assert.ok(esTipoValido(t.id), `${t.id} esta en TIPOS pero esTipoValido lo rechaza`);
  }
});

test("slugValido acepta lo que produce aSlug", () => {
  for (const s of ["frieren", "ciudad-jardin", "rey-del-invierno", "grado-4"]) {
    assert.ok(slugValido(s), `deberia valer: ${s}`);
  }
});

test("slugValido rechaza todo lo que acabaria en un fichero raro", () => {
  const malos = [
    "../../metadatos", // salto de directorio
    "a/b", // subcarpeta
    "a\\b", // barra invertida
    "..", // el propio padre
    "ab", // caracter de control: se colaba con la lista de prohibidos
    "a\nb", // salto de linea
    "Frieren", // mayusculas: aSlug nunca las produce
    "niño", // acentos y ñ: aSlug los quita
    "-empieza-con-guion",
    "termina-con-guion-",
    "doble--guion",
    "",
    "   ",
    "a".repeat(61), // demasiado largo para un nombre de fichero
  ];
  for (const s of malos) {
    assert.ok(!slugValido(s), `no deberia valer: ${JSON.stringify(s)}`);
  }
});

test("slugValido rechaza lo que no es una cadena", () => {
  for (const v of [null, undefined, 42, {}, [], true]) {
    assert.ok(!slugValido(v), `no deberia valer: ${JSON.stringify(v)}`);
  }
});

test("las carpetas de los tipos no se solapan entre si", () => {
  const carpetas = LISTA_TIPOS.map((t) => t.carpeta);
  assert.equal(new Set(carpetas).size, carpetas.length, "hay carpetas repetidas");
  for (const a of carpetas) {
    for (const b of carpetas) {
      if (a !== b) assert.ok(!a.startsWith(b + "/"), `${a} cuelga de ${b}`);
    }
  }
});

test("ningun tipo repite claves de campo", () => {
  for (const t of LISTA_TIPOS) {
    const claves = t.campos.map((c) => c.clave);
    assert.equal(new Set(claves).size, claves.length, `${t.id} repite claves`);
    assert.ok(!claves.includes("nombre"), `${t.id} no debe declarar 'nombre' como campo`);
  }
});

// --- Lectura ---

test("el nombre sale de la cabecera, del encabezado o del fichero", () => {
  assert.equal(leerFicha("biblia/personajes/x.md", FICHA)?.nombre, "Frieren");
  assert.equal(
    leerFicha("biblia/lugares/x.md", "# Ciudad Jardín\n")?.nombre,
    "Ciudad Jardín",
  );
  assert.equal(leerFicha("biblia/fauna/nube-de-sal.md", "")?.nombre, "nube de sal");
});

test("leer una ruta que no es ficha devuelve null", () => {
  assert.equal(leerFicha("biblia/mundo.md", FICHA), null);
});

test("los campos propios aparecen despues de los sugeridos", () => {
  const f = leerFicha("biblia/personajes/frieren.md", FICHA)!;
  assert.deepEqual(
    camposRellenos(f).map((c) => c.clave),
    ["edad", "edad_aparente", "color_favorito"],
  );
  // `nombre` es el título de la ficha, no una fila más.
  assert.ok(!camposRellenos(f).some((c) => c.clave === "nombre"));
});

test("cada tipo etiqueta sus propios campos", () => {
  assert.equal(etiquetaDe("lugares", "secreto"), "Lo que esconde");
  assert.equal(etiquetaDe("flora", "precio"), "Qué cuesta usarla");
  // Un campo inventado recibe etiqueta legible en cualquier tipo.
  assert.equal(etiquetaDe("lugares", "color_favorito"), "Color favorito");
});

test("un mismo campo puede significar cosas distintas segun el tipo", () => {
  assert.equal(etiquetaDe("lugares", "suena"), "Qué se oye");
  assert.equal(etiquetaDe("fauna", "suena"), "Qué sonido hace");
  assert.equal(etiquetaDe("fauna", "clase"), "Qué es");
  assert.equal(etiquetaDe("flora", "clase"), "Qué es");
});

test("la flora obliga a declarar el precio de lo que sirve", () => {
  // Regla del libro: nada util sale gratis. Si desaparece el campo, se pierde.
  const claves = TIPOS.flora.campos.map((c) => c.clave);
  assert.ok(claves.includes("uso"));
  assert.ok(claves.includes("precio"));
});

test("quitar un campo lo elimina de verdad del fichero", () => {
  const f = leerFicha("biblia/personajes/f.md", FICHA)!;
  const { color_favorito, ...resto } = f.datos;
  void color_favorito;
  const salida = componerCabecera(resto, f.cuerpo);
  assert.ok(!salida.includes("color_favorito"));
  assert.match(salida, /edad: 1000/);
  assert.match(salida, /Sobrevivió a todos/);
});

// --- Creación ---

test("una ficha nueva lleva las secciones de su tipo y se relee entera", () => {
  const texto = fichaNueva("lugares", "Ciudad Jardín", { tema: "explotación" });
  const f = leerFicha("biblia/lugares/ciudad-jardin.md", texto)!;
  assert.equal(f.nombre, "Ciudad Jardín");
  assert.equal(f.datos.tema, "explotación");
  for (const seccion of TIPOS.lugares.secciones) {
    assert.match(f.cuerpo, new RegExp(`## ${seccion}`), `falta la sección ${seccion}`);
  }
});

test("cada tipo trae sus propias secciones y no las de otro", () => {
  assert.match(fichaNueva("fauna", "Nirai"), /## Cómo se comporta/);
  assert.ok(!fichaNueva("fauna", "Nirai").includes("## Biografía"));

  assert.match(fichaNueva("flora", "Lasharil"), /## Para qué sirve y qué cuesta/);
  assert.ok(!fichaNueva("flora", "Lasharil").includes("## Cómo se comporta"));
});

// --- Auxiliares ---

test("aClave convierte texto libre en clave valida", () => {
  assert.equal(aClave("Color favorito"), "color_favorito");
  assert.equal(aClave("Grado en la Escalera"), "grado_en_la_escalera");
  assert.equal(aClave("  ¿Año?  "), "ano");
});

test("iniciales para el avatar", () => {
  assert.equal(iniciales("Frieren"), "FR");
  assert.equal(iniciales("Ciudad Jardín"), "CJ");
  assert.equal(iniciales(""), "?");
});
