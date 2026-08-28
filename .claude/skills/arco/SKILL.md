---
name: arco
description: Escribe un arco entero del libro, de la premisa al panel de revisión, repartiendo el trabajo en escenas para que nunca se acabe el contexto. Úsala para empezar o continuar cualquier arco del 2 al 6.
---

# Escribir un arco

Un arco son unas 15.000 palabras. No se escriben de una vez y no hace falta: se escriben
en **veinte o veinticinco escenas**, cada una con su contexto justo.

El orden es: **escaleta → escenas → costuras → estado → panel.** No te saltes ninguno, y
sobre todo no te saltes las costuras.

---

## 1 · La escaleta, de escenas y no de capítulos

Lee `biblia/premisa.md`, `biblia/estandar.md`, `biblia/estado.md` y `manuscrito/00-escaleta.md`.

Escribe `manuscrito/arco-N/00-escaleta.md` con **una hoja por escena**, en el formato que
pide [[escena]]: dónde, quién, qué entra, qué pasa, qué cambia, qué se siembra, qué se
paga, qué no puede pasar todavía, y el largo.

Antes de seguir, el arco entero tiene que pasar los ocho puntos de `biblia/estandar.md`
**sobre el papel**. En concreto:

- **¿Cuál es la imagen?** Una. No tres. Y no vale declararla en el texto.
- **¿Qué escena grande sostiene el arco?** Táchala mentalmente: si el arco sigue en pie,
  es adorno y hay que atarla o quitarla.
- **¿Cuál es la última línea?** Tiene que ser la mejor del arco.
- **¿Dónde está el humor?** Si hay un capítulo sin ninguno, hay que saber por qué.
- **¿Qué se paga aquí de lo que se debe?** Mira `biblia/pistas.md`: hay 40 pendientes. Un
  arco que no salda ninguna aumenta una deuda que ya es grande.

**Enseña la escaleta antes de escribir nada.** Es el momento barato de cambiar de idea.

---

## 2 · Las escenas

Una por una, **en cadena**, con la skill [[escena]].

> **No se pueden escribir en paralelo las escenas de un mismo capítulo.** La escena 3
> necesita el final de la 2 para que la juntura pegue. Van en orden.
>
> Lo que sí va en paralelo son capítulos que no se tocan — y sobre todo **los revisores**,
> que es donde de verdad está el gasto.

Después de cada capítulo cerrado, **actualiza `biblia/estado.md`** y lanza **`/compact`**.
Si no actualizas el estado, el siguiente agente escribe a ciegas; si no compactas, la
sesión sigue arrastrando el contexto de todo lo ya escrito y cerrado, que es justo para lo
que existe `estado.md`.

---

## 3 · La pasada de costuras · **la que nadie hace y es la que salva**

Cuando estén todas las escenas, **lee sólo las junturas**: los últimos párrafos de cada
escena y los primeros de la siguiente. Nada más. Es barato.

Busca:

- **Saltos de tiempo sin marca.** Pasó de verdad: el capítulo 5 se iba dos meses adelante y
  volvía sin avisar
- **Repeticiones nuevas.** «Dejé a mis hermanos en una piedra» acabó apareciendo cuatro
  veces sin que nadie lo escribiera cuatro veces
- **Tics al aire.** Al quitar ruido quedan a la vista los moldes que estaban camuflados:
  ocho prolepsis idénticas aparecieron así
- **Islas de tiempo verbal**, márgenes rotos, ecos literales entre capítulos
- **Escenas que terminan dos líneas después de haber terminado**

---

## 4 · El mundo, antes del panel · **lo que se olvidó los primeros cinco arcos**

Con el arco cerrado y las costuras arregladas, antes de lanzar el panel:

- **Escribe `biblia/lugares/<lugar-del-arco>.md`**, con el formato de `keliun.md`
  (frontmatter con grado, tema, secreto; cuerpo con qué se ve al llegar, cómo funciona,
  quién manda, qué esconde, qué pasa aquí).
- **Escribe ficha en `biblia/personajes/`** para cada personaje nuevo con peso — el que
  enseña el papel, el antagonista, quien se queda atrás con nombre y relación con Sel. No
  hace falta para quien aparece una vez y no vuelve.
- **Si el arco inventó flora o fauna propia** (una planta o un bicho atado a ese lugar,
  no genérico), dale ficha en `biblia/flora/` o `biblia/fauna/`.

Esto no se hizo en los arcos 2 a 6 la primera vez —`biblia/lugares/` se quedó con sólo
Keliun, y `biblia/personajes/` con sólo el reparto del arco 1— y el propio skill [[escena]]
nunca cargaba estas fichas al escribir, así que el mundo dejó de crecer aunque el libro
siguiera. Hacerlo aquí, al cerrar cada arco, es más barato que reconstruirlo entero al
final.

---

## 5 · El panel

Con [[panel]], en `revisiones/`. **Lanza uno solo primero y comprueba que escribe su
fichero**; si no puede, el registro de agentes está antiguo y hay que reiniciar.

Después, agrega en `resumen.md` por número de coincidencias y actualiza la tabla de
seguimiento de `revisiones/README.md`.

Con el arco cerrado y `estado.md` al día, **lanza `/clear`** antes de empezar el siguiente.
No hace falta arrastrar la sesión: el siguiente arco arranca leyendo `estado.md`, no
recordando esta conversación.

---

## Lo que se aprendió haciendo el arco 1

Está pagado con cinco pasadas. No lo repitas:

1. **Autopuntuarse no vale.** Me puse 8 de 8; el panel me puso 4,25.
2. **Un problema estructural no se resta.** Se cortaron 786 palabras y la nota no se movió.
   Sólo se cerraron los dos hallazgos que se arreglaban cortando.
3. **Si se pueden quitar 786 palabras de narrador sin perder un dato, el narrador no
   llevaba datos: llevaba énfasis.**
4. **Casi todo lo que falla es un efecto contado fuera de plano.** Escribir *una* escena
   —la despensa de Ila en el suelo— arregló tres criterios de golpe.
5. **Cada arreglo trae daño colateral**, y encontrarlo es lo más valioso que da el panel.
6. **Lo que hay que conservar se comprueba antes de tocar nada.** La lista está al final de
   `revisiones/README.md`.
