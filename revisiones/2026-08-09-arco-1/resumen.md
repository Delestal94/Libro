# Resumen del panel · arco 1 · 9 de agosto de 2026

> **8 informes** (panel reducido, sobre la pasada 5-6): 4 lectores (2 niño, 2 adulto) · 3
> críticos (estructura, personajes, sistema) · 1 escritor (editor de mesa). Faltó el
> crítico de mercado y dos escuelas de escritor por límite de sesión — no se relanzaron.
>
> El 10 de agosto se hizo una **pasada de corrección** sobre lo que señaló este panel
> (13 cortes + 2 escenas nuevas + 4 reglas añadidas a `voz.md`), y una **verificación
> barata** (2 críticos, sólo `git diff` + su propio informe) sobre esa pasada. Los dos
> resultados están en este documento.

---

## La nota

| Crítico | Pasada anterior | Esta pasada |
|---|---|---|
| Estructura | 4 | **4,5** |
| Personajes | 5 | **6** |
| Sistema y mundo | 4 | **5** |
| Mercado | 4 | *(no relanzado)* |

Sube en los tres, y el propio crítico de estructura avisa de por qué sube poco: **«Los
cuatro puntos de más siguen siendo cuatro sitios donde el autor puntúa una afirmación del
narrador en vez de un hecho del texto.»** Sigue sin haber una obra de arte; hay una novela
corta que ya aguanta una lectura seria.

**Lectores:** 4 de 4 terminan el arco (el de 13 años, que lo había abandonado en el
capítulo 1 la vez pasada, ahora llega al final saltándose trozos). 0 de 4 vuelve a
abandonar por aburrimiento. El adulto más hostil (28, antifantasía) sigue comprando el
siguiente, "a regañadientes, y esta vez por el 6 más que por el 4".

---

## Lo que dice el editor de mesa, y es la pieza que más pesa de las ocho

**Trece de dieciséis** cambios pedidos hace una semana estaban hechos y comprobados línea
a línea. Y un diagnóstico nuevo, más difícil de ver que el anterior:

> «Antes el miedo hablaba por el narrador: *"Y ese es el hombre"*, *"conviene entender"*.
> Eso se ha cortado, y bien. Ahora el miedo habla por el niño: *"no supo por qué se le
> había puesto mal cuerpo"*, *"una tristeza distinta que no supo colocar"*. **Es la misma
> frase.** Que el personaje declare que no entiende lo que siente es tan explicativo como
> que el narrador lo explique — y cuesta más de detectar, porque parece contención.»

Y el hallazgo operativo más útil: **este autor añade mejor de lo que resta.** Tres escenas
nuevas de la pasada anterior convivían con el párrafo viejo que venían a sustituir (Tarin,
la despensa, el papel), porque escribir la escena y borrar el resumen son dos operaciones
distintas y sólo se hacía la primera.

Dio 16 cortes ejecutables, ordenados por rendimiento. **Los 13 más baratos están
aplicados** (ver más abajo). Quedan tres "de mesa" — el molde `que es lo que` ya está
dentro de objetivo (10), las `—Ya.` de un capítulo ya están en 3, y la colisión de "tres
segundos" quedó documentada como tic propio de Ila, no como error.

---

## Lo unánime entre los tres críticos

### El vicio cambió de disfraz, no desapareció

Estructura, personajes y el editor coinciden, cada uno desde su ángulo, en que **cortar
las glosas del narrador no arregló el problema de fondo: lo movió de sitio.** Antes
explicaba el narrador. Ahora explican los personajes, en primera persona, con la misma
función. La regla que hacía falta y no estaba escrita —"la emoción nombrada también está
prohibida en boca del personaje"— se añadió a `voz.md` en esta pasada.

### La imagen del arco seguía sin decidirse

El crítico de estructura dio un criterio nuevo —**tiene que ser la imagen que el
protagonista causa, no una que mira**— y con él elige **Oren en el agua** (cap. 4) sobre
la mesa vacía y el borrado de Miren Saal. Pero avisa: **hoy esa escena no cuesta nada.**
Sel señala, Oren obedece, la calle queda arreglada. Es potencia sin factura. La decisión
quedó escrita en `estandar.md`; **falta la reescritura que le dé precio**, y eso es
trabajo de escena, no de esta pasada.

### Tres cosas de Ila seguían pasando fuera de plano

Contestar «irme» y mirar alrededor, vender el caldero, decírselo a su padre delante de
gente. La última ya estaba en escena. Se escribió la primera (cap. 5, lavadero) en esta
pasada.

---

## Lo que se hizo entre el panel y la verificación

- **13 cortes** del editor de mesa, todos aplicados y comprobados contra el manuscrito.
- **`biblia/voz.md`**: 4 reglas nuevas (orden dentro del párrafo, restar cuando se suma,
  punto de vista, emoción nombrada del personaje), corregido un recuento falso de
  prolepsis, y "el número once" pasado de tic a fallo de continuidad documentado.
- **Dos escenas nuevas**, no resúmenes: el "irme" de Ila en el lavadero (cap. 5) y Sel
  señalándole que su cuenta sobre los hermanos no incluye las seis casas perdidas (cap. 6).
- **La imagen decidida** en `estandar.md`, con la cita retirada porque ya no está en el
  texto (violaba la prohibición de carteles).

---

## Lo que encontró la verificación, y se corrigió en el momento

Dos verificadores (estructura y personajes), sólo con `git diff` + su informe anterior.
Coincidieron en el mismo problema por caminos distintos:

1. **Contradicción literal.** La escena nueva de cap. 5 decía que Ila «se lo pensó tanto
   rato»; cap. 7 ya decía que había contestado «sin pensárselo un segundo». Se corrigió
   cap. 5 para que coincida con cap. 7, que es la versión mejor (la respuesta ya estaba
   lista, no se estaba pensando en ese momento).
2. **Cap. 6 dejó de ser un recuerdo y se volvió un bucle.** Sel repetía palabra por
   palabra «Eso no es un sueño, es un sitio», como si se le ocurriera ahí, en vez de estar
   citando lo que ya había pasado en cap. 5. Se reescribió como referencia explícita:
   «—Lo del lavadero —dijo Sel—. Lo que contestaste.»
3. **Antecedente ambiguo.** «La encontró», justo después de un párrafo sobre Miren Saal,
   podía leerse como si el sujeto fuera ella. Se hizo explícito: «Sel encontró a Ila…»

**No se corrigió** (queda anotado, no es error, es matiz): el crítico de personajes señala
que la objeción de Sel sobre la cuenta de Ila apunta a las seis casas, que ella puede
descartar («Eso es de ellas, no mío»), y no a los hermanos, que es donde la cuenta de
verdad no cierra. Es una nota de profundidad, no un fallo — queda para una posible
tercera pasada sobre este capítulo, no para esta.

---

## Pendiente, sin tocar en esta pasada

- Reescribir la escena de Oren en el agua para que cueste algo en el momento
- "A los nueve años" (20+ veces), "once" (12+, ahora fallo de continuidad, no sólo tic)
- Ningún capítulo con una risa sana; Sel elige pero no paga
- Cap. 5 sigue siendo tachable como capítulo (aunque su escena de cierre, la del pozo, no)
- Criterio 4 (causas y efectos en escena) sigue "a medias": quedan dos enunciaciones sin
  citar antes
- El crítico de mercado y dos escuelas de escritor no se relanzaron por límite de sesión
