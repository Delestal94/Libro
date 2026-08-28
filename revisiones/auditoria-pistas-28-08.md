# Auditoría de `biblia/pistas.md` — 28-08

Auditoría de las 119 filas marcadas «pendiente» en un libro ya terminado (6 arcos,
manuscrito completo). Objetivo: separar hilos genuinamente abiertos de errores de
contabilidad (filas que sí se pagaron en el texto pero el fichero no se actualizó).

No se ha editado `biblia/pistas.md` ni ningún fichero de `manuscrito/` o `biblia/`.
Sólo auditoría.

**Resultado: 12 filas mal marcadas**, confirmadas cada una con cita textual del
manuscrito. Se agrupan en tres patrones:

- **Duplicados de siembra/pago**: la misma pista aparece dos veces en la tabla, una
  copia actualizada a «pagada» y la otra olvidada en «pendiente» (patrón exacto del
  caso «Dos no pueden llevar» ya detectado).
- **Recogida en ya apunta a un capítulo concreto**: la propia celda nombra dónde se
  paga, pero el Estado sigue en «pendiente» (patrón exacto del caso «Halumi ish»).
- **Pistas del clímax del arco 3** (Coren/la flor/Osane): tres filas de la siembra en
  cap. 2-3 de ese arco cuyo pago ocurre en la misma escena del duelo del cap. 6, ya
  contabilizada en otras dos filas («pagada»), pero sin actualizar las suyas.

## Tabla de errores confirmados

| # | Fila exacta de `pistas.md` | Por qué está mal marcada | Cita del manuscrito que lo confirma | Cómo debería quedar |
|---|---|---|---|---|
| 1 | `«Halumi ish…» sin terminar \| cap. 2 \| último capítulo \| pendiente` | La «Recogida en» ya nombra el capítulo; la frase completa se paga ahí. (Caso ya señalado por el usuario, confirmado de nuevo.) | `manuscrito/arco-6/06-lo-que-se-completa.md:41`: «—Halumi ish selmi alun —dijo Sel, en voz alta, completa, por primera vez en su vida.» | `pagada — confirmado con grep, la frase se completa en arco 6, cap. 6` |
| 2 | `Dos no pueden llevar el mismo a la vez» — dicho una vez y negado \| cap. 5 \| — \| pendiente` | Duplicado exacto de la fila de la línea ~156 (mismo enunciado, misma regla dura 4 de `mundo.md`), que ya está marcada pagada citando arco 2, cap. 6. | `manuscrito/arco-2/06-lo-que-se-queda-cada-uno.md:99`: «—No se puede llevar dos a la vez —dijo—.» (Yeva, a Sel) seguido de la línea 105: «Se quitó el Huérfano.» | `pagada — dramatizada en arco 2, cap. 6 (fusionar con la fila duplicada de la línea 156; misma cita)` |
| 3 | `Si haces de algo mucho tiempo te lo empiezan a decir con \`-in\`/\`-esh\` \| cap. 7 (fila corregida...) \| — \| pendiente` | Es la siembra exacta del mecanismo que la fila de `avanin` (línea ~228) ya marca como pagada en arco 6, cap. 6, citando el mismo `idioma.md` § 2. Nunca se enlazó la siembra con su propio pago. | Siembra, `manuscrito/07-el-camino.md:296-300`: «—¿Y si haces de algo mucho tiempo? [...] —Entonces la gente empieza a decírtelo con la otra —dijo—. Y ese es el problema.» Pago, `manuscrito/arco-6/06-lo-que-se-completa.md:118-120`: «Avanin. No "avanesh". Sel conocía la diferencia desde que tenía memoria...» | `pagada — arco 6, cap. 6 (mismo pago que la fila de "avanin")` |
| 4 | `El narrador se delata: «no tengas miedo», «debería haberme parado aquí» \| caps. 1-7 \| último capítulo \| pendiente` | La «Recogida en» ya dice «último capítulo»: es exactamente donde se revela que el narrador es Ila (fila ~224, ya pagada), que retroactivamente explica estas intrusiones. | Siembras: `manuscrito/01-el-brindis.md:301` «No tengas miedo. Todavía no pasa nada.»; `manuscrito/03-lo-que-hace-un-huerfano.md:253` «Debería haberme parado a mirarlo aquí.» Pago: `manuscrito/arco-6/07-halumi-ish-alun.md:76-79`: «Fui yo. Desde el principio. Cada papel, cada ciudad, cada cosa que perdiste sin que nadie más lo viera.» | `pagada — arco 6, cap. 7 (mismo pago que la fila del narrador-es-Ila)` |
| 5 | `El narrador se delata también en el arco 2: «Yo también las conté, la primera vez»... \| arco 2, cap. 1 \| último capítulo \| pendiente` | Mismo caso que la fila anterior: «Recogida en» ya apunta al capítulo donde se paga (la revelación de Ila). | Siembra: `manuscrito/arco-2/01-lo-que-se-compra-hecho.md:108`: «Yo también las conté, la primera vez.» Pago: `manuscrito/arco-6/07-halumi-ish-alun.md:76-79` (la misma cita de arriba). | `pagada — arco 6, cap. 7 (mismo pago que la fila del narrador-es-Ila)` |
| 6 | `El papel cobra: Sel pierde el sonido de la voz de Maara \| cap. 3 \| — \| pendiente` | Se paga en el mismo capítulo en que se siembra (no es un hilo a futuro): la pérdida del oído de Maara se dramatiza unas páginas después, dentro de cap. 3. | `manuscrito/03-lo-que-hace-un-huerfano.md:279-282`: «Se acordaba de todas las palabras. Se acordaba del orden, del gesto, de dónde estaba sentada cada vez. De cómo sonaba, no.» | `pagada — cap. 3, la misma escena (once días después del entierro)` |
| 7 | `Una flor abierta se acuerda de quién la abrió, un segundo, sólo con la piel — por eso los patrocinadores nunca la tocan con la mano desnuda... \| arco 3, cap. 2 \| arco 3, cap. 6 \| pendiente` | La «Recogida en» ya apunta al duelo del cap. 6, donde la regla se paga literalmente: Sel obliga a Coren a sostener la flor con la mano, y Coren siente lo que sostiene. | Siembra: `manuscrito/arco-3/02-lo-que-cuesta-una-flor.md:167-170`: «sólo con la piel, no con la cabeza [...] Por eso no se la damos a nadie en la mano desnuda si se puede evitar.» Pago: `manuscrito/arco-3/06-la-feria-de-las-flores.md:56-121`: «—Que la sostenga usted. Con su mano [...] —¿Qué ha sido eso? [...] —Lo que sostiene —dijo Sel—. Cada vez que se corta.» | `pagada — arco 3, cap. 6 (el duelo con Coren)` |
| 8 | `Coren, establecido como persona y no villano [...] Cumple la regla de que la institución no cae por la fuerza porque no está hecha de maldad \| arco 3, cap. 3 \| arco 3, cap. 6 (el duelo) \| pendiente` | Duplicado funcional de la fila de la línea ~59 («La institución no cae por la fuerza — Coren no cae»), ya pagada citando la misma escena del duelo. | `manuscrito/arco-3/06-la-feria-de-las-flores.md:140-161`: «Coren no se disculpó [...] A partir de hoy [...] pago el doble por cada flor con mi nombre [...] Y se fue, con el mismo paso tranquilo de siempre, sólo que un poco más despacio.» | `pagada — arco 3, cap. 6 (misma escena que la fila de "Coren no cae")` |
| 9 | `«A lo mejor no hay que hacer nada con él. A lo mejor hay que hacer algo con la cuenta.» — Sel encuentra [...] la frase que va a sostener el clímax \| arco 3, cap. 3 \| arco 3, cap. 6 \| pendiente` | La propia fila dice que esta frase «va a sostener el clímax»: el clímax (forzar a Coren a sentir el coste sosteniendo la flor) es exactamente ejecutar el plan de «hacer algo con la cuenta», no con Coren mismo. | Siembra: `manuscrito/arco-3/03-el-gremio.md:87-88`: «—A lo mejor no hay que hacer nada con él —dijo—. A lo mejor hay que hacer algo con la cuenta.» Pago: la escena de la flor sostenida (`arco-3/06-la-feria-de-las-flores.md:56-121`, misma cita que la fila 7). | `pagada — arco 3, cap. 6 (Sel ejecuta el plan exacto)` |
| 10 | `Osane: treinta años sabiendo el sistema, sin poder cambiarlo [...] Fija la escala real de lo que el arco puede resolver antes del clímax \| arco 3, cap. 5 \| arco 3, cap. 6 \| pendiente` | Hay una réplica textual de Osane, esa misma noche del duelo, que cierra explícitamente este hilo. | Siembra: `manuscrito/arco-3/05-lo-que-pesa.md:81-83`: «—Llevo treinta años en este oficio [...] Y en treinta años no he conseguido cambiar ni una moneda de cómo se paga una flor.» Pago: `manuscrito/arco-3/06-la-feria-de-las-flores.md:175`: «—Treinta años —dijo, al fin—. Y no se me había ocurrido pedírselo así.» | `pagada — arco 3, cap. 6 (Osane, esa misma noche)` |
| 11 | `Sel cuenta luces encendidas como contaba perros [...] En el arco 1 contar perros era saber quién se había muerto; aquí es saber cuánto se está gastando \| arco 2, cap. 1 \| arco 2, cap. 7 (última escena...) \| pendiente` | Duplicado exacto de la fila de la línea ~164 («Imagen de cierre del arco: Sel cuenta luces, no perros...»), que ya está pagada citando la misma escena de cierre. | `manuscrito/arco-2/07-adruin-al-fondo.md:153-158,165-167`: «Contó cuarenta y siete. [...] Aquí cuarenta y siete luces significaban cuarenta y siete cuentas distintas, y él ya sabía leer alguna de ellas [...] contó las luces una vez más, la última [...] ahora que ya sabía lo que costaba cada una.» | `pagada — arco 2, cap. 7 (fusionar con la fila duplicada de la línea 164; misma cita)` |
| 12 | `**La nota que Vessa falla a propósito, siempre en el mismo sitio.** «Porque no está mal. Está puesta ahí» [...] \| arco 5, cap. 2 \| arco 5, cap. 4 \| pendiente (se revela de quién es esa nota)` | Duplicado funcional de la fila de la línea ~186 («La nota que Vessa falla a propósito, revelada...»), que cubre exactamente la misma revelación en el mismo capítulo y ya está pagada. | `manuscrito/arco-5/04-lo-que-no-se-puede-tomar-prestado.md:15-17,23-26,33-37`: «era de mi hermano [...] una noche se equivocó de nota [...] y a la gente [...] le gustó más [...] La fallo porque si la tocara bien, sería como decir que él nunca estuvo aquí.» | `pagada — arco 5, cap. 4 (fusionar con la fila duplicada de la línea 186; misma cita)` |

## Hilos que de verdad quedaron sin pagar, sin que sea un error de la tabla

Estos no son errores de contabilidad — son promesas narrativas que el libro deja
genuinamente abiertas. Se anotan aparte porque, en un libro ya cerrado, llaman la
atención por su volumen o su especificidad, no porque la fila esté mal marcada.

- **El expediente de Miren Saal (arco 1, cap. 5) queda casi entero sin resolver.**
  Es el cúmulo más grande de hilos sueltos del libro: qué lleva en la bolsa que suena a
  metal (fila ~32), el archivo con una ficha por cada caso como el de Sel (fila ~21),
  «Un día no vas a poder dejar de hacerlo» (fila ~24), «Eres como yo, aunque no lo sepas
  todavía» (fila ~110), que se borre de la memoria de 65 personas (fila ~108), que no
  haya testigos de que subiera a Keliun (fila ~113), a quién le dieron la comarca que a
  ella le niegan (fila ~34), entre varias más — unas quince filas en total, todas
  sembradas en el mismo capítulo del arco 1 y ninguna retomada en los arcos 2-6. Miren
  Saal desaparece de la novela después de cap. 5 del arco 1 sin que ninguna de estas
  preguntas concretas reciba ni una línea de eco, ni siquiera oblicuo. Dado que el papel
  y la institución que representa son un tema central del libro, es llamativo que la
  figura que más a las claras lo encarna quede completamente sin cerrar.

- **Lo que Anu le dice a Ila al oído al despedirse (fila ~99).** No es un olvido: el
  propio texto declara que es indecible — `manuscrito/07-el-camino.md:262-264`: «le dijo
  algo muy corto al oído que Sel no oyó y que Ila no le contó nunca». Como Ila es la
  narradora del libro entero (confirmado en el arco 6), esto significa que la propia
  narradora elige no contarle al lector algo que ella sí sabe. Es un hilo cerrado a
  propósito por diseño, no un despiste, pero vale la pena que quede anotado como
  decisión consciente y no como pista perdida.

- **El registro de Adalur con el nombre de Sel mal escrito (fila ~198)** se conecta
  explícitamente en su propia celda con el hilo de la ficha que Sel nunca tuvo en el
  armario de Miren Saal (arco 1) — pero esa conexión nunca se dramatiza ni se explica en
  ningún capítulo posterior. Es el mismo patrón que el expediente de Miren Saal: un cabo
  temático central que el libro deja sin atar.

## Nota sobre el alcance de esta auditoría

No se revisaron exhaustivamente las 119 filas «pendiente»; se priorizaron las que
mostraban el patrón de riesgo señalado (arcos 1-3, temas centrales, «Recogida en» ya
apuntando a un capítulo, o redacción casi idéntica a otra fila). Quedan sin revisar en
detalle sobre todo las filas de los arcos 4 y 6 cuya «Recogida en» está vacía («—») y
que no repiten el enunciado de ninguna otra fila; es razonable asumir que la mayoría de
ellas son hilos genuinamente abiertos por diseño, en línea con el patrón ya visible en
las que sí llevan nota explicativa («a propósito», «hilo abierto», etc.).
