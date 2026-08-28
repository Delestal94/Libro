# Arco 6 · «Casa» — verificación de la SEGUNDA ronda de corrección

> Verificación del 28 de agosto de 2026, modo restringido. Lectura completa de
> `manuscrito/arco-6/03-lo-que-hace-un-padre.md`, `05-el-padre.md`,
> `06-lo-que-se-completa.md`, `07-halumi-ish-selmi-alun.md`.
> Consultas puntuales: `manuscrito/07-el-camino.md` l. 260-309, `biblia/pistas.md`
> l. 200-229, `manuscrito/00-escaleta.md` l. 100-111, `biblia/idioma.md` l. 161 (vía grep).
> No se releyó el resto del arco ni ningún otro arco.
>
> Contraste contra `verificacion-01-estructura.md` (4/8).

---

## Veredicto en una línea

Los tres hallazgos se atacaron de verdad esta vez —uno de ellos con una escena, que es lo
que pedía el informe anterior— pero el error del idioma sigue vivo en un séptimo sitio que
nadie grepeó, el párrafo nuevo que gloso `selmi` define mal el único sufijo que define, y
la objeción de Anu se movió de sitio sin entrar en la cadena causal: sigue siendo tachable
como inserto, porque Anu objeta a la **fecha** y no al **precio**, y porque cuando objeta
todavía no sabe qué va a escribir Sel.

**4 de 8** (sin cambio). La composición está más sana que ayer y la nota no se mueve,
porque lo que subió fue exactitud, no escena.

---

## 1 · H61 · ¿Se cierra del todo?

**No. Queda un sitio, y es el peor de los que quedaban.**

Lo cerrado, y está bien cerrado:

| Sitio | Estado |
|---|---|
| `manuscrito/arco-6/07-halumi-ish-selmi-alun.md` l. 1 | `# Halumi ish selmi alun` ✔ |
| nombre del fichero | renombrado ✔ |
| `arco-6/00-escaleta.md` l. 46, 125, 326, 345 | los cuatro ✔ |
| `biblia/pistas.md` l. 220 | ✔ |
| `biblia/estado.md` l. 21, 66, 88 | ✔ (tres, no dos) |

Lo que sigue mal, `manuscrito/00-escaleta.md`, **l. 110**:

> El narrador se revela: es Ila, escribiendo el libro entero como registro
> para Sel. **Se completa *halumi ish alun*.**

Es la escaleta maestra del libro entero —el documento del que cuelgan las seis escaletas de
arco— y es el único sitio donde el error vive fuera del arco 6, es decir, el único desde el
que puede volver a propagarse. Tres rondas y el fósil sigue reproduciéndose una generación
por ronda.

Y la causa está escrita, con todas sus letras, en la fila que certifica la corrección.
`pistas.md` l. 220:

> **Verificado con grep: la frase aparece completa en el texto, en el título del cap. 7 y
> en el nombre del propio fichero**

Se volvió a grepear `Halumi ish selmi alun` —la frase buena, que efectivamente aparece— y
no se grepeó nunca `Halumi ish alun`, que es la única búsqueda que podía encontrar lo que
faltaba. Es la tercera vez que la misma fila comete el mismo error de método: **el grep
confirma que existe la frase correcta; sólo la búsqueda de la frase incorrecta confirma que
no existe la incorrecta.** La fila incluso enumera los tres sitios que sí miró, lo cual
documenta con precisión el perímetro de lo que no miró.

Lo demás está limpio: el cuerpo (cap. 6 l. 47, cap. 7 l. 1 y l. 90) y `notas/diagrama.md`
l. 24 y 98 concuerdan. El error es hoy invisible para el lector; sigue vivo para el
proyecto.

---

## 2 · El gloss nuevo de `selmi` (cap. 6, l. 39-43)

> Se dio cuenta, además, de una cosa en la que nunca se había parado a pensar: la palabra
> que le faltaba ya la llevaba encima desde siempre, puesta delante de todo lo que decía o
> hacía, sin que nadie se la hubiera tenido que traducir nunca. *Sel.* Hijo. Bastaba con
> ponerle detrás lo que se pone cuando algo deja de ser de uno mismo y pasa a ser de otro,
> para que la misma palabra que lo nombraba a él nombrara, en cambio, a quien él quisiera.

**La primera mitad funciona. La segunda define el sufijo al revés.**

**(a) `Sel` = hijo: entra bien.** Se apoya en una cosa cierta y no dicha hasta ahora, no
pide ninguna escena previa —un niño que de pronto oye su propio nombre como palabra es
verosímil a los nueve años y a los cuarenta— y la cláusula «sin que nadie se la hubiera
tenido que traducir nunca» desactiva la objeción obvia (¿de dónde lo sabe?) sin pararse a
explicarla. Es económico y es del personaje. Que lo diga el narrador y no una escena es
discutible; que se lea forzado, no. **No se siente forzado.**

**(b) `-mi` se define al contrario de como el propio libro lo enseña.** Dieciséis líneas
antes, en la misma página, l. 25:

> *Halumi ish...* Mi sueño es.

`halu` + `-mi` = *mi* sueño. El sufijo marca que algo es **del que habla**. Y el párrafo
nuevo lo define como «lo que se pone cuando algo **deja de ser de uno mismo y pasa a ser de
otro**». Es exactamente la dirección contraria. Y no sólo contra `halumi`: contra su propio
caso, porque `selmi` en boca de Sel quiere decir *mi hijo* —el hijo pasa a ser **suyo**, no
de otro—. El lector diligente, que es el único al que este párrafo está dirigido, es
precisamente el que tiene `halumi` fresco y va a chocar.

Hay una lectura caritativa —que «lo que deja de ser de uno y pasa a ser de otro» describe
la *palabra*, no la posesión— pero no sobrevive a «Bastaba con **ponerle detrás**», que
señala el sufijo sin ambigüedad posible. El párrafo entero existe para que una palabra
quede clara, y la única de las dos que explica la deja del revés.

**(c) El saldo del problema que la ronda quería resolver: mejora real.** El lector llega
ahora a la última línea con `sel` glosado en escena, `-mi` deducible de `halumi` (aunque el
texto le apunte mal), `ish` glosado desde el arco 1 y **una** sola palabra opaca, `alun`
(«feliz», `idioma.md` l. 161). Eso es lo que se pedía. Se pagó con dos costes menores que
conviene tener contados:

- La frase que el cap. 6 presume de **no traducir** («No la tradujo», l. 49) va precedida
  seis líneas antes de una traducción parcial hecha por el narrador. El gesto de no
  traducir queda menos limpio de lo que el propio texto cree.
- **Cuarto criterio tipográfico para el veresh en el mismo capítulo.** *Sel.* va en cursiva
  (l. 41), «—Halumi ish selmi alun» en redonda (l. 47), «Avanin» en redonda (l. 124),
  «avanesh» en comillas bajas (l. 126). Señalé tres el 28-08; el párrafo nuevo añade el
  cuarto. En el arco 1 todo va en cursiva (*Avan*, *Avanesh*, *Avanin*, l. 278-289).

---

## 3 · El `avanesh` y la escena nueva del cap. 3

### 3.1 · La línea reescrita (cap. 6, l. 126-129): **coherente ya con el arco 1, salvo cuatro palabras**

> Sel se acordó, oyéndolo, de un viejo sentado al sol en Keliun, hacía ya toda una vida,
> diciendo esa misma palabra de Tarin sin que nadie se lo pidiera —la primera vez que había
> oído que existían las dos […]

Contrastado uno a uno con `manuscrito/07-el-camino.md` l. 275-290:

| Afirmación | Arco 1 | ¿Cuadra? |
|---|---|---|
| «un viejo sentado al sol en Keliun» | «el hombre muy viejo que siempre estaba sentado al sol» (l. 275) | ✔ |
| «diciendo esa misma palabra de Tarin» | «—Tarin no es su padre» / «—*Avanesh.*» (l. 273-278) | ✔ |
| «sin que nadie se lo pidiera» | «dijo desde atrás, en voz baja» (l. 276) | ✔ |
| «la primera vez que había oído que existían las dos» | «El de detrás no lo había oído nunca» (l. 282) | ✔ |

La contradicción del informe anterior está cerrada. **Es la mejor corrección de esta
ronda**: no añade una frase encima de la anterior, sustituye una afirmación falsa por un
recuerdo verificable, y de paso convierte una nota de mecanismo en un plano —el viejo al
sol— que el lector puede volver a ver.

**Pero «hacía ya toda una vida» es el fósil de «toda la vida» con ropa nueva.** Cien líneas
antes, en este mismo capítulo, l. 29: «once meses después de la primera». Y l. 70: «hacía
casi un año». La escena del viejo es de la misma semana que la del brindis. Un capítulo que
data el intervalo dos veces con precisión de mes no puede llamarlo «toda una vida» a la
tercera, y menos en la cabeza de un niño de nueve años para el que once meses son la novena
parte de su vida entera. Cuatro palabras, y son las cuatro que sobrevivieron a la
corrección.

**Y la mitad más afilada de la siembra sigue sin cobrarse.** El viejo del arco 1 no dice
sólo que hay dos palabras: dice que la segunda se convierte en la primera, y añade una
advertencia (l. 296-300):

> —¿Y si haces de algo mucho tiempo?
> […] —Entonces la gente empieza a decírtelo con la otra —dijo—. **Y ese es el problema.**

El arco 6 cobra el premio y no la advertencia. Nadie, en el cap. 6, roza siquiera por qué
al viejo aquello le parecía un problema. La escena de arco 1 tiene una púa; el pago la
recibe sin ella, y el narrador certifica en su lugar que la palabra es «la buena» (l. 130).
El arco **contesta al viejo afirmando**, que es la manera de contestar que no cuenta.

### 3.2 · La escena nueva del cap. 3 (l. 32-45): **compra plausibilidad y gasta inocencia**

Lo bueno primero, y es concreto. «Como pago por la lección» (l. 32) es la mejor decisión de
la escena: coloca el veresh dentro de la economía del libro —lo que se da a cambio de algo—
en vez de meterlo como información, y lo hace en la única escena del arco donde Toma es el
maestro y Sel el alumno. «Todavía mal, pero mejor» (l. 26) ya estaba y sigue siendo el
mejor Toma del capítulo.

Cuatro problemas, en orden de gravedad.

**(a) La escena da a Toma la distinción y le quita al cap. 6 la línea que lo sostiene.**
Cap. 6, l. 130-131:

> **Toma no pareció darse cuenta de lo que había hecho.** Lo dijo como quien nombra algo
> que ya era verdad antes de decirlo.

Eso era verdad cuando Toma decía `Avanin` sin saber que existía `avanesh`. Ahora Toma no
sólo conoce las dos formas: le parecieron lo bastante notables como para pararse a
comentarlas con el nudo a medio hacer entre los dedos («Qué raro», l. 41). Un niño al que
esa distinción le llamó la atención hace meses y que elige la correcta en el momento exacto
**sí sabe lo que ha hecho**. La ronda compró el mecanismo y pagó con la inocencia del
gesto, que era la mitad de su valor. Las dos cosas no se pueden tener a la vez, y el texto
todavía afirma las dos.

**(b) La escena no dice las palabras.** «un puñado de palabras de la lengua vieja […] agua,
camino, casa, padre», y la última «tenía dos formas, una cerrada y otra abierta». En la
única escena del libro escrita para que un mecanismo del idioma sea verosímil, el idioma no
aparece: ni `avan`, ni `avanin`, ni `avanesh`, ni una cursiva. Y la descripción que se da
—«una cerrada y otra abierta»— no se empareja nunca con el significado: Sel dice «Según de
quién sea de verdad, y de quién sólo hace de eso» sin decir cuál es cuál. Toma sale de la
lección sabiendo que hay dos y sin saber, sobre la página, cuál es cuál; tres capítulos
después usa la correcta. El agujero de plausibilidad se ha estrechado, no cerrado.

**(c) Toma reformula la regla mal, y el texto le da la razón.** L. 41-42:

> Que la misma palabra signifique dos cosas distintas **según quién la diga**.

No es según quién la diga: es según de quién se diga. Sel acaba de explicárselo bien en la
línea anterior. Como imprecisión de niño sería defendible; el problema es que el narrador
la subraya como si fuera la línea buena («la frase se le quedó rondando mucho después de
que se hiciera de noche», l. 44-45), y que el pago del cap. 6 depende justamente del
matiz que la reformulación pierde.

**(d) Fricción menor con el arco 1: «que había ido recogiendo por el camino».** `avan` es
la única palabra de la lista que **no** recogió por el camino: la oyó en la plaza de
Keliun, antes de salir (arco 1, l. 275-305). La frase de encuadre desmiente al pie de
página la escena que la ronda existe para anclar. Y el narrador la llama «la lengua vieja»,
cuando en el arco 1 la llama por su nombre («en veresh», l. 276).

**(e) Se corrigió, y hay que decirlo, el «dos años».** Cap. 3 l. 71-72 dice ahora «la que
llevaba **casi un año** aprendiendo cómo funcionaban estas cosas». Concuerda con cap. 1
l. 8 y cap. 6 l. 29. Cerrado.

---

## 4 · Prueba del tachado sobre la escena de Anu (cap. 5)

**Tacha l. 94-102**, de «—No hace falta que la escribas esta noche» a «ése era el momento».

Lo que queda: Anu ve el espacio en blanco y «algo en su cara cambió, como quien ve venir una
cuenta antes de que se la digan» (l. 91-92) → «—¿Y qué es la quinta? —preguntó, al fin, más
baja» (l. 104) → Sel escribe.

**No se cae nada.** Ni una línea de después queda huérfana. La única que podría —«Yo podría
haberte dicho que no, esta misma noche, antes de que lo escribieras» (l. 131-132)— sigue
leyéndose perfectamente contra el resto de la escena: Anu estaba delante, vio la hoja, vio
venir la cuenta y no dijo nada. **El inserto es tachable.** El capítulo no lo es —cuelga de
él el cap. 6 entero, como ya establecí— pero el arreglo, en sí, sigue sin ser un obstáculo.

Por qué no lo es, con precisión, porque no es un fallo de colocación sino de contenido:

**(a) Anu objeta a la fecha, no al precio.** «No hace falta que la escribas **esta noche**.
Puede esperar a mañana. A la semana que viene» (l. 94-95). Ninguna de esas tres frases
discute que Sel pague; discuten cuándo. Sel contesta a lo que se le ha preguntado —«Si
espero, va a parecer que lo dudo. Y no lo dudo» (l. 98)— y con eso la objeción queda
liquidada sin haber tocado el asunto. Aplazar no es oponerse.

**(b) Cuando objeta, no sabe a qué.** Es el dato que decide. Anu no descubre qué es la
quinta cosa hasta que Sel la escribe y ella la lee por encima de su hombro, y su primera
reacción es **«—No lo entiendo»** (l. 118). Una testigo que no entiende el precio ni
después de leerlo no podía oponerse a él antes. Por lo tanto su «yo podría haberte dicho
que no» (l. 131) sigue siendo, dentro de la escena, literalmente falso: podía haberle dicho
*espera*, y se lo dijo. Decirle *no* nunca estuvo en su mano, porque no supo a qué le
estaba diciendo que sí hasta que ya estaba escrito. La ronda movió el reloj y dejó la
asimetría de información donde estaba, y la asimetría era el problema.

**(c) El inserto viene con su pie de foto, otra vez.** L. 100-102:

> se quedó ahí, con los brazos cruzados, **el tiempo justo para que Sel supiera que si de
> verdad hubiera querido pararlo, ése era el momento**.

El narrador entra a certificar que ese beat era la ventana de oportunidad. Es exactamente
el vicio que diagnostiqué como problema mayor el 28-08 —la corrección que se explica a sí
misma en la frase en que se hace— reapareciendo dentro de la corrección de ese diagnóstico.
Y la certificación es la prueba de que el beat no se sostiene solo: si la oportunidad se
viera, no haría falta anunciarla.

**Lo que sí mejoró, y no es poco.** Dos cosas concretas:

- «Si espero, va a parecer que lo dudo. Y no lo dudo» es Sel de verdad, y es la primera vez
  en el capítulo en que él, y no la escena, sostiene la decisión.
- L. 152-155: «pero le quedó claro, por la manera en que Anu volvió a los panes con las
  manos todavía inseguras, que para ella no había sido tan fácil de aceptar». Ese remate
  corrige la mitad del agravio del criterio 2 que señalé: el narrador ya no certifica la
  escena como indolora para todos. La otra mitad sigue viva veinte líneas después: «No le
  dolió tanto como había pensado que le iba a doler» (l. 172).

**Criterio 5: sigue A MEDIAS**, en el mismo sitio que ayer.

---

## 5 · ¿Se rompió algo nuevo?

**(a) `manuscrito/00-escaleta.md` l. 110** — la frase vieja, § 1. Es lo único que la ronda
rompió por omisión; los demás son restos.

**(b) Cap. 5, l. 5: la corrección se quedó a medias.** Ya no dice «nueve meses» —bien— pero
sigue diciendo:

> mirando hacia el camino que salía de Keliun hacia el norte, el mismo por el que **había
> entrado casi un año antes**.

Por ese camino **salió** hace casi un año; **entró** hace unas semanas. Señalé las dos
mitades del error el 28-08 y se corrigió una. El verbo sigue apuntando en la dirección
contraria al viaje entero del libro, y lo hace en la primera frase del capítulo del clímax.

**(c) La cuenta tipográfica del veresh empeora**, § 2(c): cuatro tratamientos en un
capítulo, y el cuarto lo trajo esta ronda.

**(d) Lo que esta ronda sí cerró sin dejar resto, y conviene registrarlo:** dos de las
cuatro metaficciones vivas. Cap. 5 l. 59-60 dice ahora «por primera vez **desde que salió
de Keliun**» (decía «en el libro entero») y cap. 7 l. 67 dice «la única persona **de todo
el viaje**» (decía «del libro»). Las dos correcciones son de una línea y ninguna deja
cicatriz. Sigue viva la del cap. 6, l. 51-52: «no hacía falta explicárselo a nadie que
hubiera seguido a Sel desde Keliun hasta Keliun otra vez, por cinco ciudades y cinco
papeles», que es la que apela al lector directamente y por tanto la peor de las cuatro.

**(e) Intacto y sin tocar:** la prohibición 6 de `voz.md` en cap. 6 l. 92 («cómo explicarle
a un niño de nueve años»), y la grieta de las edades —Sel y Toma tienen los dos nueve años
y nadie lo nota en dos capítulos—. No entraban en el encargo de hoy; siguen ahí.

---

## 6 · Pistas

Auditados los cambios de esta ronda contra `pistas.md` l. 200-229.

**(a) Fila 218 y fila 226 se contradicen sobre la misma escena.** 218 sigue citando una
réplica que no existe en el manuscrito y cerrándola con «primera respuesta del libro que no
le hace falta pensar dos veces». 226, añadida el 27-08, dice de la misma escena: «Anu duda
de verdad antes de aceptar el precio». La tabla certifica a la vez que Anu no lo pensó dos
veces y que lo dudó de verdad. Lo señalé el 28-08 y no se tocó; ahora que existe la fila
226, el desajuste ya no es un resto: es una contradicción interna de la tabla.

**(b) Fila 226 declara una prueba que la escena no pasa.** «corregido tras el panel, la
escena pasa ahora la prueba del tachado». § 4 de este informe: el inserto se tacha y no cae
nada. La fila afirma un resultado de auditoría que no se ejecutó.

**(c) Fila 228 sigue sembrando en la biblia.** «Sembrada en: `biblia/idioma.md` § 2». Ahora
hay dos siembras reales en manuscrito —arco 1 cap. 7 (el viejo al sol) y arco 6 cap. 3 (la
lección de la red)— y la tabla no registra ninguna de las dos. Una pista cuya casilla de
siembra apunta a un documento de diseño es una pista que nadie puede auditar contra el
texto, que es precisamente cómo H61 sobrevivió tres rondas.

**(d) Fila 210** (el oficio del Padre en marcha, cap. 3) no menciona la lección de veresh,
que es lo único que se añadió a ese capítulo. Sigue `pendiente`, correctamente.

**(e) Fila 220** — § 1. Pendientes en el bloque del arco 6: 206, 209, 210, 213, 214. Cinco,
las mismas de ayer, todas internas y cobrables. Eso no ha empeorado.

---

## 7 · Los ocho criterios

| | Criterio | 28-08 | Hoy | Prueba del cambio |
|---|---|---|---|---|
| 1 | Imagen | A medias | A medias | Cap. 4 no se tocó |
| 2 | Frase que duele | A medias | A medias (mejor) | L. 152-155 corrige la mitad; l. 172 sigue |
| 3 | Cambio irreversible | Cumple | Cumple | Sin cambios |
| 4 | Tema caminado | No cumple | No cumple | Dos metaficciones cortadas, una viva (cap. 6 l. 51-52); el gloss de `selmi` añade narración donde hacía falta escena |
| 5 | Golpe de efecto | A medias | A medias | El inserto de Anu se tacha sin consecuencias (§ 4) |
| 6 | Mejor línea al final | No cumple | No cumple | El título ya está bien; la mejor línea del arco sigue siendo «Llegué tarde. No que no venía» (cap. 3, l. 60) |
| 7 | Se relee distinto | Cumple (herido) | **Cumple** | El `avanesh` ya no desmiente al arco 1; el recuerdo es verificable línea a línea |
| 8 | Tirón y fondo | A medias | A medias | Sin cambios |

**4 de 8.**

La nota no se mueve y el arco está mejor: eso no es una paradoja, es el diagnóstico. Lo que
subió fue **exactitud** —una contradicción cerrada, un fósil de fechas cerrado, dos
metaficciones cortadas, la frase bien en el título—, y la exactitud es condición para
puntuar, no puntuación. Los tres criterios que llevan dos rondas parados (1, 5, 6) están
parados por lo mismo: piden una escena que aún no existe (la imagen por el camino de la
riada), una escena que aún no resiste (alguien que pueda impedir el precio) y una línea
final más fuerte que la del cap. 3. Ninguna de las tres se arregla con una frase.

---

## 8 · El problema mayor

**Uno.**

> **La ronda ya no corrige el expediente —corrige el texto— pero sigue corrigiéndolo desde
> el narrador: de los tres arreglos, dos son párrafos que explican lo que debería estar
> ocurriendo, y el tercero, que sí es una escena, contradice a la escena que venía a
> apuntalar.**

La prueba, en los tres:

- `selmi`: un párrafo de narrador que revela la palabra clave del libro **y define mal el
  sufijo**, en un capítulo que se enorgullece de no traducir.
- Anu: un beat de cuatro líneas que termina con el narrador certificando que ese beat era
  la ventana de oportunidad — porque sin la certificación no se vería que lo era.
- El cap. 3: la única escena de verdad de la ronda, bien colocada y bien pagada («como pago
  por la lección»)… y al enseñarle a Toma la distinción, deja falsa la línea del cap. 6 que
  decía que Toma no sabía lo que estaba haciendo.

El patrón mejora respecto de la ronda anterior (1 escena de 14 correcciones → 1 de 3), pero
la mecánica de fondo es la misma: **se sigue reparando en el nivel de la frase un arco cuyos
tres criterios estancados sólo se mueven en el nivel de la escena.** Y la consecuencia
estructural de reparar así vuelve a aparecer puntualmente: cada frase nueva puede
contradecir una vieja, y esta vez lo hace tres veces («toda una vida», «según quién la
diga», «lo que deja de ser de uno mismo»).

---

## 9 · Lo que hay que conservar de esta ronda

- **El recuerdo del viejo al sol** (cap. 6, l. 126-129), quitando «hacía ya toda una vida».
  Es la mejor corrección del día y la única que convierte una nota en un plano.
- **«Como pago por la lección»** (cap. 3, l. 32). El encuadre correcto para meter el idioma
  en este libro.
- **«Si espero, va a parecer que lo dudo. Y no lo dudo»** (cap. 5, l. 98).
- **Las manos todavía inseguras de Anu** (cap. 5, l. 154-155).
- **«*Sel.* Hijo»** (cap. 6, l. 41). La revelación, no la definición que le sigue.
- Todo lo salvado el 27-08 y el 28-08, que esta ronda no ha tocado.
