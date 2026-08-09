---
name: escena
description: Escribe una escena del libro a partir de su hoja, con el contexto justo y sin leerse el manuscrito entero. Úsala para escribir cualquier escena nueva de cualquier arco. Carga el contrato de voz, el estado, las fichas implicadas y las pistas del capítulo; escribe la escena y actualiza la contabilidad.
---

# Escribir una escena

Esto existe porque un libro de seis arcos no cabe en una cabeza a la vez. **Una escena se
escribe con unas cinco mil palabras de contexto**, no con el manuscrito entero — y así
nunca se acaba el sitio.

---

## 1 · Carga esto, en este orden, y nada más

| Fichero | Para qué |
|---|---|
| `biblia/voz.md` | **Entero, siempre.** Es el contrato. Sin esto la escena no suena al libro |
| `biblia/estado.md` | Dónde está todo. Sustituye a leerse lo anterior |
| `biblia/personajes/<los que salgan>.md` | Sólo los que aparecen. Dos o tres |
| `biblia/pistas.md` | **Sólo las filas de este capítulo y las pendientes que toquen** |
| El final del texto anterior | Los últimos ~40 renglones. Para que la juntura pegue |

**No cargues el manuscrito entero.** Si crees que lo necesitas, es que la hoja de escena
está mal hecha: vuelve y pídela mejor.

Carga además `biblia/decisiones.md` si la escena toca el sistema, y `biblia/referencias.md`
si la hoja menciona alguna.

---

## 2 · La hoja de escena

Se te da, o se te pide. Si no la tienes, no escribas: **pídela**. Lleva:

- **Dónde y cuándo**, y quién está
- **Qué entra** — con qué llega el lector
- **Qué pasa** — el suceso, en una frase
- **Qué cambia** — si no cambia nada, la escena sobra
- **Qué se siembra** y **qué se paga** (filas de `pistas.md`)
- **Qué NO puede pasar todavía** — lo que pertenece a más adelante
- **Largo aproximado** — normalmente entre 800 y 2.500 palabras

---

## 3 · Escribe

Con [[voz]] delante. Las que más se incumplen, recordadas:

1. **No expliques lo que la escena ya ha hecho.**
2. **Cero negritas. Cero carteles.** Nada de «conviene entender».
3. **Una obsesión ridícula del protagonista**, si le toca.
4. **Un detalle que sólo sabe quien ha hecho ese trabajo.** Uno.
5. **Humor**, salvo que la hoja diga expresamente que no.
6. **Si cobra el sistema, la lista crece en la página.**

Y antes de dar nada por bueno:

> **Tapa el último párrafo y lee la escena sin él.** Cinco de cada siete veces mejora.

## 4 · Escribe el fichero

En `manuscrito/`, donde diga la hoja. Renglones de unas 90 columnas, como el resto.

Si la escena va dentro de un capítulo que ya existe, **insértala en su sitio** y comprueba
que las dos junturas —lo de antes y lo de después— pegan.

---

## 5 · Actualiza la contabilidad · **esto no es opcional**

Una escena sin contabilizar es una promesa que se pierde. Al terminar:

- **`biblia/pistas.md`** — marca lo pagado, añade lo sembrado. Con capítulo correcto.
- **`biblia/estado.md`** — si cambió lo que alguien sabe, lo que Sel ha perdido, dónde
  están o algún contador, **actualízalo**. El siguiente agente lee esto y nada más.
- **`biblia/cronologia.md`** — si el suceso tiene fecha.

---

## 6 · Devuelve

Corto:

- Título de la escena y palabras
- **Qué sembraste y qué pagaste**
- **Qué cambió en el estado**
- Y si algo de la hoja no se pudo hacer, **dilo** — no lo tapes

---

## Reglas

- **No toques `revisiones/`.** Eso es de los revisores.
- **No reescribas escenas de otro** salvo que la hoja lo pida. Si ves algo mal en lo que ya
  está, **anótalo en la respuesta**; no lo arregles de paso.
- **No inventes reglas del mundo.** Si la escena necesita una que no existe, **para y
  pregunta**. Una regla inventada al vuelo se contradice tres arcos después.
- **No resumas lo que debería ser escena.** Es el defecto documentado del arco 1: todas las
  causas en escena y todos los efectos contados de refilón.
