# Revisiones

Retroalimentación del [[panel]] sobre el manuscrito, guardada íntegra y comparable entre
iteraciones. Esta carpeta es la memoria del proyecto: **lo que ya se sabe que falla, y si
se arregló o no.**

## Estructura

```
revisiones/
├── README.md              ← este fichero: el índice y el seguimiento
├── panel.md               ← cómo se compone el panel y cómo se ejecuta
└── AAAA-MM-DD-arco-N/
    ├── resumen.md         ← el agregado. Es lo que se lee
    ├── lector-nino-01..06.md
    ├── lector-adulto-01..06.md
    ├── critico-01..04-*.md
    └── escritor-01..04-*.md
```

## Regla de conservación

**Cada agente escribe su propio informe directamente en su fichero.** No pasa por nadie.

Se aprendió por las malas: en la primera ronda los agentes tenían cargado el registro
anterior, sin permiso de escritura, y devolvieron los informes por respuesta. Se guardaron
condensados, y **los transcripts completos, que eran temporales, se perdieron**. Los
hallazgos y las citas sobrevivieron; los matices no.

Las definiciones de `.claude/agents/` ya llevan `Write`. **Comprobar antes de lanzar un
panel que los agentes pueden escribir**, lanzando uno solo primero.

---

## Iteraciones

| Fecha | Arco | Revisores | Nota media | Enlace |
|---|---|---|---|---|
| 2026-08-02 | Arco 1 · Keliun · 15.418 palabras | 20 | **4,25 / 8** | [resumen](2026-08-02-arco-1/resumen.md) |
| 2026-08-09 | Arco 1 · tras pasadas 4-6 | 8 (panel reducido) + 2 (verificación) | **5,2 / 8** (estructura·personajes·sistema) | [resumen](2026-08-09-arco-1/resumen.md) |
| 2026-08-10 | Arco 1 · tras retoques post-verificación | 8 (panel reducido) + 14 verificaciones | **≈5,7-6,0 / 8** (estructura 5,5-6,0 · personajes 5,5 · sistema 6,1 — cifra exacta pendiente de panel de cierre) | [resumen](2026-08-10-arco-1/resumen.md) |
| 2026-08-11 | **Arco 2 · Adruin · ~9.800 palabras · panel de cierre (primera vez)** | 9 (panel reducido) | **3,75 / 8** (estructura 3,5 · personajes 3,5 · sistema 4 · mercado 4) | [resumen](2026-08-11-arco-2/resumen.md) |
| 2026-08-12 | **Arco 3 · Yenal · ~8.500 palabras · panel de cierre, tres rondas** | 9 (panel reducido) × 2 rondas + arreglos de criterio propio | **≈4,4 / 8** (estructura 3,5→4,5 · personajes 4 · sistema 5,5 · mercado 3,75) | [resumen](2026-08-12-arco-3/resumen.md) |
| 2026-08-27 | **Arco 4 · Ossin, el Fondo · ~7.800 palabras · panel de cierre, dos rondas** | 9 (panel reducido) + 3 verificadores + 2 rondas de corrección | **4 / 8** inicial → verificado 5/8 (personajes), 3/8 (estructura, mitad del hallazgo cerrada en 2ª ronda) | [resumen](2026-08-27-arco-4/resumen.md) |
| 2026-08-27 → 28 | **Arco 5 · Adalur, el Conservatorio · ~7.900 palabras · panel de cierre + verificación + segunda ronda** | 9 (panel reducido) + 2 verificadores (28-08) + segunda ronda de corrección | **3,1/8 inicial → verificado 3,5/8 (estructura), 3/8 (mercado), con hallazgos nuevos → segunda ronda del 28-08 los cierra todos** (nota no re-verificada por un tercer agente; ver H74-H80) | [resumen](2026-08-27-arco-5/resumen.md) |
| 2026-08-27 → 28 | **Arco 6 · Casa (Keliun) · ~8.400 palabras · panel de cierre + verificación + segunda ronda · ÚLTIMO ARCO DEL LIBRO** | 9 (panel reducido) + 2 verificadores (28-08) + segunda ronda de corrección | **3,4/8 inicial → verificado 4/8 (estructura), 3/8 sin cambio (sistema), con fósiles y errores nuevos encontrados → segunda ronda del 28-08 los cierra todos** (nota no re-verificada por un tercer agente; ver H61, H70, H82-H85) | [resumen](2026-08-27-arco-6/resumen.md) |

### 2026-08-27 · panel de cierre, arco 6 (una ronda) — ÚLTIMO ARCO DEL LIBRO

El panel encontró, con cita exacta, **un error real contra `biblia/idioma.md`**: la
frase final del libro decía `Halumi ish alun` cuando la biblia fija `Halumi ish selmi
alun` («mi sueño es que mi hijo sea feliz») — faltaba `selmi` («mi hijo»), la palabra
que carga el título del protagonista. Corregido de inmediato, con un efecto positivo:
la frase dejó de ser el sueño de Sel sobre sí mismo y pasó a ser el sueño que Maara le
dejó a medias, que él completa diciéndolo sobre Toma y Pell — e Ila cierra el libro
diciendo su propia versión sobre los hermanos que crió.

**Hallazgo central, 6 de 9 perfiles:** nada se oponía de verdad a lo que Sel quería en
todo el arco — el padre de Ila cedía sin fricción, el pueblo ayudaba sin coste, la escena
del precio (el quinto y último ítem de la lista) era tachable. Un lector lo resumió así:
«el precio es magia, no vida […] el mismo truco que el arco dice estar evitando».
Confirmado además que **la imagen declarada del arco (Sel cargando a Pell dormido) no
existía en el manuscrito** — 4 de 9 perfiles, con cita y línea exactas cada uno.

Corregido en una sola ronda: escena nueva en el cap. 4 (Sel carga a Pell, la imagen del
arco, por fin en escena); la escena del precio (cap. 5) reescrita con Anu dudando de
verdad, usando su propio tic; el conflicto de `regla dura 4` (Sel toma «el Padre» con el
padre biológico vivo) resuelto en escena con un paralelo explícito a Bern (arco 2); el
mecanismo `-in`/`-esh` de `idioma.md`, prometido desde el principio del libro y nunca
pagado, cobrado por fin («Toma le dice a Sel "avanin"»); el quinto pago de la lista
anclado a una memoria concreta de Maara para no romper la regla dura 2; y una traducción
explícita que la propia corrección del idioma había introducido, cortada, dejando que la
escena hable sola. Ver [resumen del 27-08](2026-08-27-arco-6/resumen.md) para el detalle
completo, incluido lo que queda abierto a propósito: el hilo de la institución de la
premisa, sin arco donde pagarlo ya.

**Con esto, El décimo perro está completo: seis arcos, primera escritura terminada,
panel de cierre en cada uno, correcciones aplicadas donde el panel encontró causa real.**

### 2026-08-27 · panel de cierre, arco 5 (una ronda)

**La nota técnica más baja del proyecto (3,1/8) con la recepción emocional más alta hasta
la fecha.** Los cinco lectores, sin excepción, dijeron que la muerte de Vessa les llegó de
verdad y que querían seguir leyendo — el problema no era de sensación de lectura, era de
arquitectura: **la imagen declarada del propio arco (Vessa fallando de verdad, sin
querer, junto a una caja de eco perfecta) no existía en el manuscrito**, porque Vessa
dejaba de tocar tras el cap. 2. Hallazgo gemelo: la decisión de no forzar el concierto con
el papel se tomaba en la escena 5.3, así que el gesto de soltarlo en el clímax (6.2) era
río abajo de una decisión ya tomada — pasaba la prueba del tachado en el peor sentido
posible.

Corregido en una sola ronda: escena nueva al abrir el cap. 5 (Vessa falla de verdad junto
a una caja de eco y se enfada por primera y única vez — «treinta años. Y ahora esto. No es
justo»); 5.3 reescrita para dejar la decisión abierta; el clímax (6.2) reescrito para que
Talia pida el papel en persona y Sel elija de nuevo, notando el paralelismo con su propio
fallo del cap. 3; Talia recupera agencia para salir a tocar por decisión propia; se corta
el tic «nadie se lo discutió» (cinco apariciones → cero); se reescriben dos frases del
cap. 6 que copiaban la escaleta casi palabra por palabra; se añade `decisiones.md` § Q
(el oficio real nunca fue un papel — resuelve por qué Vessa sigue tocando tras «dar» el
Músico sin romper la regla dura 4). Ver [resumen del 27-08](2026-08-27-arco-5/resumen.md)
para el detalle completo, incluidos los hilos dejados abiertos a propósito (la economía de
grado 4 sin dramatizar a fondo; las voces de Vessa, Farel y Talia, poco diferenciadas
entre sí).

### 2026-08-27 · panel de cierre, arco 4 (una ronda)

**El hallazgo más fuerte de todo el proyecto hasta ahora, por unanimidad casi total:** 8 de
9 perfiles, sin coordinarse, señalaron la misma causa raíz — **Sel no pierde nada en todo
el arco.** Llega a Ossin con todo y sale con todo: su fallo (presumir del golpe, causa real
de la caída de Tobal) se disculpa en la misma frase que lo acusa, Yura lo absuelve en
cuatro réplicas, Tobal no se entera de que fue él quien filtró la información, y el clímax
(robar los libros de cuentas de Dench) se resolvía en media página sin fricción, después de
anunciarse como imposible durante siete capítulos. El crítico de mercado lo dijo más claro
que nadie: «en siete capítulos no hay una sola cosa que Sel tenga al llegar a Ossin y no
tenga al salir». Nota inicial: **4/8** de media.

A diferencia del arco 3, que necesitó tres rondas porque los primeros arreglos introdujeron
fallos nuevos, esta vez la convergencia fue tan alta y tan específica que permitió cerrarlo
en una sola ronda dirigida a la causa exacta: se reescribió el cierre para que Tobal se
entere del todo de la traición del mercado y no perdone del todo en la despedida («todavía
no. Puede que en un año. Hoy no»); Dench deja, antes de que Sel se vaya, una amenaza abierta
y sin cerrar sobre el gremio; y se cortó la línea de Dench reconociendo «el hueco», apoyando
la decisión de no forzarlo en una regla ya establecida (`mundo.md`, regla dura 3) en vez de
en un mecanismo inventado sobre la marcha. También se corrigió una grieta de sistema real
—el rescoldo, tal como estaba descrito, sugería que la memoria se le podía devolver a quien
se la sacaron, lo cual contradice § F— con una decisión nueva (`decisiones.md` § P: el
rescoldo es § F robado, y lo gastado no vuelve, nunca). Ver
[resumen del 27-08](2026-08-27-arco-4/resumen.md) para el detalle completo, incluidos los
hilos que quedaron abiertos a propósito (qué significa que Dench «use» a quien atrapa; el
deseo propio de Tobal de robar sin la rabia de su padre).

### 2026-08-12 · panel de cierre, arco 3 (tres rondas)

**El hallazgo más grave de todo el libro hasta ahora: el arco titulado «el Jardinero» no
contenía ninguna toma de ese papel.** Sel abría flores con «el mismo hueco de siempre» del
Guardador de lumbre del arco 2 — nunca lo soltaba, nunca tomaba el nuevo, y la escena que
la propia escaleta prometía por escrito («hay una escena donde tiene que elegir cuál lleva
puesto») nunca se había escrito. Nota inicial: **3,5/8**, con la advertencia explícita de
que la tendencia bajaba por tercer arco consecutivo y esta vez no por ejecución floja sino
porque «el acto que da nombre al arco no está escrito».

Reparado con una escena nueva en el cap. 4 (Osane exige a Sel soltar el Guardador antes de
enseñarle el Jardinero, cumpliendo § M sin ablandar la regla) y reescrituras en los caps.
2, 6 y 7. Verificado con el mismo crítico: **4,5/8**, con un hallazgo residual — el clímax
seguía sin costarle nada a Sel en la propia escena, y la frase exacta que el primer panel
señaló como el problema («sin que le cueste nada») seguía en el manuscrito, ahora en boca
de Sel. Confirmado además por el crítico de mercado, relanzado junto con seis agentes más
que habían fallado por límite de sesión la primera vez. Una tercera pasada, con criterio
propio sobre las citas ya confirmadas por dos rondas de agentes, le da a Nea agencia real
en el clímax, sitúa a Osane observando la Feria, y corta la línea que anulaba el riesgo.

**El hallazgo que más importa para lo que viene:** tres fuentes independientes —los dos
lectores adultos y el escritor, sin coordinarse— describen la misma fórmula visible a la
tercera repetición: pueblo nuevo → rival con don parecido → mentor que explica el coste
sentado → poderoso que se ablanda → despedida con objeto-recuerdo. *«En Keliun no se
notaba, en Adruin se intuía, en Yenal el esqueleto queda a la vista.»* No se repara en el
arco 3 — se repara no repitiéndolo en el arco 4, cuya escaleta se revisó antes de escribir
una sola escena para quitar la escena de mentor explicando y sustituirla por revelación en
acción. Ver [resumen del 12-08](2026-08-12-arco-3/resumen.md) para el detalle completo,
incluidos los hallazgos que quedaron abiertos a propósito (Sel no sonríe ni falla en todo
el arco; la ambigüedad sin marcar de «la corta Nea»).

### 2026-08-11 · panel de cierre, arco 2 (primera vez)

Muy por debajo del 5,3/8 con el que cerró el arco 1. **Los cuatro críticos, desde ángulos
distintos, llegan a la misma causa**: el suceso del que depende el clímax del arco —que
Adruin lleva un mes sin saber a cuál de los dos Huérfanos creerle— **no está dramatizado en
ningún capítulo**, sólo se afirma en la escena que lo resuelve. El capítulo 1 muestra el
papel fallando por completo con el posadero; el capítulo 6 (Yeva) da por hecho un mes de
crisis de creencia que ningún capítulo intermedio escribió. El crítico de sistema añade la
pieza que lo explica: `decisiones.md` § K se aplica al revés dentro del mismo arco —no
cobra nada con dos personas resistiéndose (cap. 3) y cobra un sentido entero sin nadie
resistiéndose (cap. 4)— porque **§ K nunca se decidió para la magia doméstica**, sólo para
el papel usado sobre personas.

Segundo hallazgo con tres fuentes independientes, esta vez de lectores: **el capítulo 5
("Lo que cuesta") es el primer sitio del libro donde el sistema se explica en vez de
vivirse** — dos adultos y un niño de trece años, sin coordinarse, señalan la misma tabla de
números de Yeva. Y un tercer hallazgo, relacionado: el narrador enuncia la tesis del libro
en el clímax (cap. 6), justo donde `decisiones.md` § M decía que no debía. Durante la
propia espera del panel se corrigieron dos errores objetivos confirmados por tres perfiles
cada uno (el nombre de Bern citado antes de presentarse, y la lista *Cosas que ya no tengo*
sin crecer en la página del cap. 4) — no hizo falta esperar al agregado para arreglarlos.
2/2 lectores niño terminan el arco; 2/2 adultos comprarían el siguiente, pero los cuatro
dicen alguna versión de "engancha menos que el arco 1". Ver
[resumen](2026-08-11-arco-2/resumen.md) para el detalle y la lista de qué pide esta pasada.

### 2026-08-10 · panel reducido

Estructura 5 → **5,5** (criterio 5 cierra: la riada ya no se puede tachar sin llevarse el
cierre del arco). Personajes 6 → **5,0**: baja, y no es ruido — Sel deja de querer algo
para sí mismo después del capítulo 1 y su rasgo distintivo desaparece justo cuando el libro
se pone serio. Sistema, primera vez evaluado en solitario: **5,5** — el coste del don se
cobra una sola vez, en el capítulo 3, y desaparece después aunque el uso se multiplique por
trece.

**El hallazgo del panel: seis de ocho informes —dos críticos y cuatro lectores con gustos
opuestos, sin coordinarse— señalan el mismo párrafo: la repetición de las cuatro visitas de
Miren Saal en el capítulo 5.** Y cinco informes distintos llegan, cada uno por su cuenta, al
mismo problema mayor de siempre —el arco no le cuesta nada a Sel— con evidencia nueva y
propia en cada ángulo (estructura, personajes, sistema, edición de mesa, lectura adulta).
2/2 lectores niño terminan el arco, incluido el umbral de 13 años que abandonaba en el
capítulo 1 en el primer panel. 2/2 adultos comprarían el siguiente. Ver
[resumen](2026-08-10-arco-1/resumen.md) para el detalle y la lista de qué pide esta pasada.

### 2026-08-09 · panel reducido + verificación

Estructura 4 → **4,5**. Personajes 5 → **6**. Sistema 4 → **5**. Mercado no relanzado (8
informes, no 20 — límite de sesión). El editor de mesa: 13 de 16 cambios pedidos, hechos.
Diagnóstico nuevo: el vicio de explicar pasó del narrador a los personajes en primera
persona. Pasada de corrección + verificación barata (2 agentes, sólo `git diff`) hecha el
10 de agosto: 13 cortes, 2 escenas nuevas, imagen del arco decidida (Oren, sin cerrar).
Ver [resumen](2026-08-09-arco-1/resumen.md) para el detalle completo.

### 2026-08-02 · la primera

Autopuntuación previa: **8 / 8** tras tres pasadas. Independiente: **4,25**.

Puntuaciones: estructura 4 · personajes 5 · sistema 4 · mercado 4.

Lectores: 1 de 6 niños abandona (13 años, en el capítulo 1). 6 de 6 adultos comprarían el
siguiente, y **los 6 dicen literalmente «a una persona concreta»**.

---

## Seguimiento de hallazgos

Los que coinciden en tres o más revisores. **Se actualiza el estado en cada panel nuevo**,
no antes: que yo crea haberlo arreglado no es que esté arreglado.

| # | Hallazgo | Coincidencias | 1.º panel | Pasada 4 | 09-08 | **10-08** |
|---|---|---|---|---|---|---|
| **H1** | El narrador explica lo que las escenas ya habían hecho | **20 / 20** | 🟡 14 cortadas | 🟡 **cambió de forma.** El editor de mesa: el vicio migró del narrador al personaje en primera persona («no supo por qué», «no sabía nombrar»). Prohibición añadida a `voz.md`; los casos detectados, cortados | 🟡 **sigue con tres supervivientes** (cap. 3 línea 211, cap. 4 líneas 197-199) y **uno nuevo**: la lección `-in`/`-esh` dicha en diálogo por un personaje, con moraleja incluida, a doce líneas de la salida del pueblo |
| **H2** | Señalar cuál es la imagen buena la estropea | 6 | 🟡 tres carteles fuera | 🟡 **decidida, no cerrada.** El crítico de estructura elige a Oren en el agua (cap. 4) con criterio nuevo — es la única imagen que Sel causa. Falta que la escena cueste algo; hoy es potencia sin factura | 🟡 **sigue sin costar nada**, y el crítico de personajes añade por qué: Oren no tiene deseo propio esa noche, así que no puede convertirse en imagen central de nadie |
| **H3** | Nadie quiere ser Sel | 6 / 6 niños | 🔴 | 🔴 | 🔴 no reevaluado por este panel (el lector de 13 años sí dice explícitamente que no quiere ser Sel — "le sale demasiado caro cuando le sale bien a él" — pero es un solo dato, no basta para mover el semáforo) |
| **H4** | Lo que los adultos admiran es lo que los niños saltan | 10 / 12 + 3 escritores | 🟡 Tarin y Anu | 🟡 **Anu cerrada. Tarin no** — el diálogo no lleva los once años; siguen narrados | 🟡 no reevaluado por este panel |
| **H5** | El final del cap. 5 sepultado bajo dos codas | 8 | 🟡 | 🟢 **cerrado** (con daño, ya reparado) | 🟢 sin novedad |
| **H6** | El capítulo 7 se cae | 6 | 🔴 | 🟡 **empeoró y luego mejoró a medias.** Llegó a 9 beats sin obstáculo; esta pasada cortó 6 de los cortes que más pesaban ahí (C1-C4 del editor) | 🟡 **confirmado tal cual.** El crítico de estructura: diez beats y ni un obstáculo; "casi" tachable; guarda el mejor material del arco en la habitación peor construida |
| **H7** | Ila abandona a sus hermanos y el libro no se entera | 5 | 🔴 | 🟢 **cerrado.** Escena nueva en cap. 6: Sel señala que la cuenta de Ila no incluye las seis casas perdidas. (Nota del verificador: apunta a las casas, no a los hermanos mismos — matiz, no reapertura) | 🟢 sin novedad |
| **H8** | El humor muere en el cap. 3 | 4 | 🔴 | 🔴 | 🟢 **cerrado por decisión de autor, no por corrección.** El crítico de estructura contó 0 chistes en el cap. 7; se decidió que no hace falta forzarlos — es la despedida, y cargarla de humor la traicionaría. Regla de `voz.md` reescrita: el humor va donde el capítulo lo aguanta, no en un recuento fijo. Si un capítulo sin chistes también se siente sin vida en lo demás, el problema es el capítulo — no la ausencia de humor en sí |
| **H9** | «Papel» aparece una vez y no la dice ningún personaje | 2 críticos + 3 niños | 🔴 | 🔴 | 🟢 **cerrado, sin que nadie lo reevaluara.** `grep` confirma: «papel»/«papeles» aparece una sola vez en el manuscrito (cap. 5, línea 429) y **lo dice Miren Saal**, un personaje: «—Un papel —dijo Miren Saal—. Se llaman papeles.» El hallazgo era del primer panel (2 de agosto), antes de que existiera esa línea |
| **H10** | El sistema no tiene unidad de medida | 2 críticos | 🔴 | 🔴 | 🔴 **relacionado y ampliado.** El crítico de sistema no encuentra una unidad, pero sí algo más preciso: tres velocidades de deshecho incompatibles para la misma regla (inmediato, cinco días, al doblar la esquina) |
| **H11** | Sel no elige nunca | 2 críticos | 🔴 | 🔴 | 🟡 **en movimiento real, tras catorce verificaciones el mismo día.** Se decidió que «No había un dos» dejara de ser cierto: esa misma noche, en la panadería de Anu, Sel descubre que ha perdido «a qué olía» su abuela — segundo ítem de la lista, causado por la reincidencia de la puerta de Anu (cap. 6) pero nunca explicado en el texto. Se tocó la raíz (cap. 3, una línea: «Fue el mismo día del pozo») y, en un segundo frente, se plantó el deseo de Sel más temprano en los caps. 3 y 5 (criterio 8, el tirón). Notas: estructura 5,5→5,5-6,0 · personajes 5,0→5,5 · sistema 5,5→6,1. Ninguno llega a 8 — quedan abiertos: la función de precio, la desproporción de la lista, y el cap. 7 sin deseo en su primera mitad. Detalle completo en `biblia/estandar.md` |
| **H12** | La numeración de la biblia está desfasada | 2 críticos | 🔴 | 🔴 | 🔴 no reevaluado por este panel |
| **H13** | No hay título | 1 crítico | 🔴 | 🔴 | 🟢 **cerrado desde antes del 09-08 y sin actualizar aquí.** `biblia/decisiones.md` § H registra el título el 3 de agosto: *El décimo perro*. Ningún informe de los dos últimos paneles lo señaló porque ya no era cierto |
| **H14** | 14 negritas, tres capítulos sin ninguna | 1 escritor | 🟡 | 🟢 **cerrado.** Cero en los siete | 🟢 sin novedad |

**Leyenda:** 🔴 abierto · 🟡 tocado, sin confirmar · 🟢 cerrado por un revisor posterior

> **Dos verdes de catorce, y ahora un tercer patrón visible: lo que no se puede cerrar
> cortando lleva tres paneles sin moverse ni un grado — H3, H8, H9, H10, H11, H12, H13.**
> Los siete rojos que quedan tienen algo en común: ninguno se arregla quitando líneas.

### Hallazgos nuevos, hijos de la pasada 4

| # | Hallazgo | Origen |
|---|---|---|
| **H15** | Ocho prolepsis de la misma forma, dos casi literales | **Estaban camufladas entre las glosas. Se cortó el camuflaje y no se cortó la cosa** |
| **H16** | «Dejé a mis hermanos en una piedra», cuatro veces | Se le quitó el subrayado al narrador y se dejó en boca de los personajes |
| **H17** | Errores introducidos al arreglar | Tiempo verbal mezclado en el nuevo cierre del cap. 5 · isla de presente en la línea de Anu · salto de dos meses sin marca · seis márgenes rotos |

### Hallazgos nuevos, hijos del panel del 10 de agosto

| # | Hallazgo | Origen |
|---|---|---|
| **H18** | El coste del don se cobra una sola vez (cap. 3) y desaparece después, aunque el uso se multiplique por trece | Crítico de sistema. El propio texto lo certifica: *«1. Cómo sonaba. / No había un dos»* |
| **H19** | El capítulo 5 no aguanta una relectura de cerca: las cuatro visitas-interrogatorio de Miren Saal son el único punto que seis de ocho perfiles señalan sin coordinarse | 2 críticos + 4 lectores (2 niño, 2 adulto). Ver [resumen del 10-08](2026-08-10-arco-1/resumen.md) |
| **H20** | Oren, la imagen elegida para el arco, tiene cero filas en `biblia/pistas.md` (el cachorro tiene tres) | Crítico de personajes |
| **H21** | Nueve perros, nueve promesas rotas en el haranu y los nueve años de Sel se reúnen en el cap. 7 sin que el narrador le deje al lector ni un parpadeo de la resonancia con el título del libro | Editor de mesa |

**Los tres, reparados en la pasada 5.** H15 a medias: quedan seis prolepsis.

### Hallazgos nuevos, hijos del panel del 11 de agosto (arco 2)

| # | Hallazgo | Coincidencias | Estado |
|---|---|---|---|
| **H22** | El motor del arco 2 —dos Huérfanos, un mes de crisis de creencia en el pueblo— nunca se dramatiza. El cap. 1 muestra el papel fallando por completo; el cap. 6 afirma un mes de conflicto que ningún capítulo intermedio escribió | 4 críticos (estructura, personajes, sistema, mercado) | 🟢 **cerrado, con la pieza que faltaba.** La escena del pan y la de la manzana (cap. 3) le dan a Sel agencia real. Lo que pedía el verificador que seguía en «a medias» —una página donde Adruin «concede» el papel— **no hacía falta escribirla, porque nunca iba a pasar**: tras resolver R3, quedó claro que el pueblo nunca reconoce a Sel como Huérfano (eso ya fracasó en el cap. 1) — compite por su caridad, no por su creencia. Se corrigió la línea de Yeva en el cap. 6 («creerle» → «ayudar»; «un mes» → «semanas») para que el clímax hable del conflicto que de verdad se escribió |
| **H23** | `decisiones.md` § K se aplica al revés dentro del mismo arco: no cobra con resistencia real (cap. 3, trece personas) y cobra un sentido entero sin ninguna persona resistiéndose (cap. 4, una lámpara) | 1 crítico (sistema), con auditoría textual de ambos capítulos | 🟢 **cerrado en dos rondas.** La distinción § K (personas) / § F (magia doméstica) resuelve el cap. 4 sin forzar nada — encaja con el libro de cuentas de Yeva ya escrito. La descripción del cap. 3 se corrigió dos veces (primero «resistiéndose» → «en desacuerdo de método»; después «dos discuten» → «tres discuten, Sel amplifica la tercera opción», que es lo que dice el texto). R2 se deja como está (nadie la nota leyendo). **R3 pasó a ser una pregunta real, no un resto** — ver abajo |
| **H24** | El capítulo 5 explica el sistema con una tabla de números en vez de vivirlo en escena — primer sitio del libro entero donde pasa esto | 3 lectores (2 adultos, 1 niño de 13), sin coordinarse | 🔴 abierto |
| **H25** | El narrador enuncia la tesis del libro en el clímax (cap. 6), donde `decisiones.md` § M decía expresamente que no debía | 2 críticos (estructura, mercado) + editor de mesa | 🟡 la contradicción lógica de la frase ya se cortó en la pasada de costuras; el contenido señalado sigue ahí |
| **H26** | El nombre «Bern» se cita en el cap. 3 antes de presentarse (recién en el cap. 5) | 3 lectores (2 niño, 1 adulto), independientes | 🟢 **cerrado el mismo día**, corregido durante la espera del panel |
| **H27** | La lista *Cosas que ya no tengo* no crece en la página del cap. 4 pese a que ahí se pierde la tercera cosa — viola la obligación 5 de `voz.md` | 1 escritor (editor de mesa) | 🟢 **cerrado el mismo día**, corregido durante la espera del panel |
| **H28** | «Ya lo sé... por eso es peor» (cap. 3, la escena nueva) repite la estructura exacta de la mejor línea del clímax — «Ya lo sé. Es peor. Ha bastado con que dejaras el mío» (cap. 6) | 2 verificadores (estructura y sistema), independientes, sin que se les pidiera buscar esto | 🟢 **cerrado.** Cortada la réplica de Bern; la escena de la manzana cierra en gesto. Efecto lateral bueno: la línea del cap. 6 «vuelve a llegar virgen» |
| **H29** | Cronología incompatible dentro de la misma conversación (cap. 5): Bern dice «una semana» y once líneas después «así lleva ya semanas» — mismo hablante, misma tarde. Los hechos internos dan la razón a la primera cifra | 2 verificadores, independientes, sin que se les pidiera buscar esto | 🟢 **cerrado dentro del capítulo** («una semana» / «la semana entera», sin plural). El choque con «un mes» del cap. 6 sigue sin tocarse — no era parte de este hallazgo |
| **H30** | Al insertar la escena de la manzana antes de «Esa noche», la escena de Ila quedó huérfana de su día — reaccionaba al puesto roto como si fuera esa misma tarde, cuando ya habían pasado varios días | 1 verificador (estructura), sin que se le pidiera buscarlo | 🟢 **cerrado el mismo día** — capítulo 3 reordenado: carro → pan → esa noche → manzana → escuela |
| **R3** | La escena de la manzana establece en la página que un estatus **se consigue por acción propia** («Ésa no te la han dado. Ésa la has ido a buscar»). El clímax del cap. 6 está escrito sobre la idea de que un papel **se libera pasivamente** cuando el otro lo suelta. Puede que no sea el mismo mecanismo —caridad del pueblo frente a papel mágico formal— pero es una lectura razonable en cualquier dirección | 1 verificador (sistema) | 🟢 **resuelto, sin tocar el manuscrito.** Son dos mecanismos distintos, y el texto ya los mantiene separados: la palabra «papel» no aparece en las escenas del pan ni de la manzana. Lo que Sel consigue ahí es compasión corriente, no el Huérfano — eso ya fracasó sin ambigüedad en la posada (cap. 1). Aclarado en `decisiones.md` § M |

**Leyenda igual que arriba.** H22, H24, H25 y R3 son del arco 2 y decisión del usuario, no
de un panel. Ver "Lo que esto pide, en orden" en
[resumen del 11-08](2026-08-11-arco-2/resumen.md).

### Hallazgos nuevos, hijos del panel del 12 de agosto (arco 3)

| # | Hallazgo | Coincidencias | Estado |
|---|---|---|---|
| **H31** | El arco titulado «el Jardinero» no contenía ninguna toma de ese papel — Sel abría flores con el hueco del Guardador de lumbre del arco 2, sin soltarlo ni tomar uno nuevo | 4 críticos (estructura, personajes, sistema, mercado) | 🟢 **cerrado y verificado.** Escena nueva en el cap. 4: Osane exige soltar el Guardador antes de enseñar el Jardinero. «Jardinero» pasa de 0 a 4 apariciones |
| **H32** | El clímax (cap. 6) no le costaba nada a Sel en la propia escena — la frase «sin que le cueste nada» seguía en el manuscrito tras el primer arreglo, ahora en boca de Sel | 1 verificador + crítico de mercado + lector adulto (35) | 🟢 **cerrado en tercera pasada.** Cortada la línea; el coste de la amenaza de Coren se confirma esa noche sin escribirse en ningún sitio (retira en silencio un encargo al gremio) |
| **H33** | El cap. 7 era casi una plantilla del cap. 7 del arco 2 — trece coincidencias estructurales, dos líneas idénticas palabra por palabra | 1 verificador (estructura) | 🟢 **cerrado, con 2/13 coincidencias funcionales aceptadas como textura recurrente.** Cierre reescrito: *halumi ish* al guardia de la aduana (cierra hilo propio del cap. 1), sin «mirar atrás y contar» |
| **H34** | Nea, la persona por la que ocurre el clímax, no dice una palabra durante toda la escena | crítico de personajes + crítico de mercado | 🟢 **cerrado.** Coren le pregunta directamente si sabía del plan; ella lo respalda en voz alta |
| **H35** | Fatiga de fórmula: pueblo nuevo → rival con don parecido → mentor que explica el coste sentado → poderoso que se ablanda → objeto-recuerdo, visible a la tercera repetición | 2 lectores adultos + escritor (20 comparaciones explícitas con personajes de arcos anteriores en 8.000 palabras) | 🔴 **no se repara en el arco 3** — se aplica como restricción de diseño al escaletar el arco 4, antes de escribir ninguna escena |
| **H36** | Dos errores factuales de continuidad encontrados por el escritor: «delante de otra flor» (Ila se sentó delante de una lámpara, arco 2) y la imagen «se cayó de rodillas» repetida casi verbatim del arco 2 | 1 escritor | 🟢 **cerrados**, corregidos directamente sin nueva ronda |
| **H37** | «Reta» citada por nombre en el cap. 3 del arco 2 antes de presentarse (cap. 4) — mismo tipo de error que H26, encontrado tarde | 1 lector (niño, 13 años), en lectura de calibración del arco 2 | 🟢 **cerrado**, corregido a «la de la ventana, la primera noche» |
| **H38** | Sel no sonríe, no falla de verdad y no bromea en los siete capítulos del arco 3, contra `el-protagonista.md` («sonríe en lo bueno y lo malo», «tiene que fracasar al menos dos veces») | crítico de personajes (1 solo perfil, bajo el umbral de tres) | 🟢 **cerrado en la mitad que importaba, el 28-08.** Grep confirma que Sel sí ríe dos veces en el arco (cap. 2, cap. 5) — la parte real del hallazgo era que nunca sonríe «en lo malo», la mitad más difícil de la regla. Añadida una sonrisa breve y consciente en el cap. 7 (al terminar la carta a Ila, sabiendo lo de Nea a la vez). El «fracasa dos veces, una por su culpa» es una regla de libro entero, no de arco — ya cumplida en los arcos 4 y 5 (la presunción que atrapa a Tobal; quitarle a Talia su público) — no se fuerza una tercera caída aquí, que reforzaría la fatiga de fórmula ya señalada en este mismo arco |
| **H39** | «—Usted no la corta. La corta Nea» — quien abrió esa flor fue Sel, no Nea; puede ser una manipulación consciente de Sel con una verdad torcida, pero queda sin marcar como intencional | crítico de sistema | 🔴 **abierto a propósito** — se deja ambiguo; marcarlo explícitamente lo estropearía |

**Leyenda igual que arriba.** H35, H38 y H39 son decisiones de diseño o ambigüedades
dejadas abiertas a propósito, no bugs pendientes de arreglar. Ver
[resumen del 12-08](2026-08-12-arco-3/resumen.md) para el detalle completo.

### Hallazgos nuevos, hijos del panel del 27 de agosto (arco 4)

| # | Hallazgo | Coincidencias | Estado |
|---|---|---|---|
| **H40** | Sel no pierde nada en todo el arco — llega a Ossin con todo y sale con todo; su fallo se disculpa en la misma frase que lo acusa y Tobal nunca se entera de la traición del mercado; el clímax se resuelve en media página sin fricción | 8 de 9 perfiles (los 4 críticos, el escritor y los 4 lectores, en alguna forma) | 🟢 **cerrado.** Cap. 7 reescrito: Tobal se entera del todo y no perdona en la despedida. Cap. 6: fricción real en el robo de los libros y amenaza abierta de Dench que Sel se lleva sin cerrar |
| **H41** | «Sólo repartimos mejor lo que ya se gastó mal» repetida casi literal en boca de Tobal (cap. 2), Yura (cap. 3) y Tobal otra vez (cap. 7) | 6 perfiles (2 críticos, escritor implícito, 3 lectores) | 🟢 **cerrado.** Queda una sola vez, cap. 2; caps. 3 y 7 reescritos con voz propia |
| **H42** | Dench reconoce «el hueco» sin justificación previa («sé exactamente lo que estás intentando hacer»), rompiendo credibilidad | lector-adulto-01 | 🟢 **cerrado**, línea cortada |
| **H43** | El rescoldo, tal como estaba descrito («la memoria no se olvida de quién era»), sugería que se le podía devolver a quien se la sacaron — contradice § F (lo gastado no vuelve) | crítico de sistema | 🟢 **cerrado.** `decisiones.md` § P añadido; línea de Yura (cap. 3) reescrita |
| **H44** | Cap. 3 escribía el soltar del Jardinero pero no el tomar del Ladrón — H31 del arco 3, en forma más suave | crítico de sistema | 🟢 **cerrado**, escena de toma añadida |
| **H45** | Referente roto en cap. 1: «la niña de la calle» sin que la escena describiera a ninguna niña | escritor (editor de mesa) | 🟢 **cerrado**, y aprovechado para añadir la primera consumidora de rescoldo vista de cerca del arco |
| **H46** | Última línea del arco («así se lleva un libro cuando ya se sabe llevarlo») rompía el contrato de voz — el narrador llamando «libro» a la propia historia | escritor (editor de mesa) | 🟢 **cerrado**, reescrita en la cabeza de Sel, sin narrador de más |
| **H47** | Cero consumidores de rescoldo en escena, en un arco de tema «mafia y adicción» — contra la regla 2 de `el-protagonista.md` | crítico de personajes | 🟢 **cerrado** junto con H45 |
| **H48** | «Dench no mata a los que atrapa, los usa. Eso puede ser peor» — promesa que el arco no llega a cobrar; Tobal sale sin marcas | crítico de mercado, crítico de personajes | 🔴 **abierto a propósito** — hilo para más adelante, como Coren/Osane en el arco 3 |
| **H49** | El deseo propio de Tobal («ser otra clase de ladrón que su padre, sin su rabia») no vuelve a tocarse dentro del arco | crítico de personajes | 🔴 **abierto a propósito** — semilla, no resto |

**Leyenda igual que arriba.** H48 y H49 son hilos dejados abiertos a propósito. Ver
[resumen del 27-08](2026-08-27-arco-4/resumen.md) para el detalle completo.

### Hallazgos nuevos, hijos del panel del 27 de agosto (arco 5)

| # | Hallazgo | Coincidencias | Estado |
|---|---|---|---|
| **H50** | La imagen declarada del arco (Vessa fallando de verdad junto a una caja de eco) no existía en el manuscrito — Vessa dejaba de tocar tras el cap. 2 | critico-01, critico-04, implícito en escritor-04 | 🟢 **cerrado del todo tras verificación del 28-08.** La primera pasada escribió una imagen distinta a la prometida (Vessa deja de tocar sin más, no falla la nota); corregido para que falle la nota exacta que llevaba treinta años fallando a propósito, cerrando también H36 en el mismo gesto |
| **H51** | La decisión de no forzar el concierto se tomaba en 5.3, no en el clímax 6.2 — el gesto de soltar el papel era río abajo de una decisión ya tomada | critico-01 | 🟢 **cerrado del todo tras verificación del 28-08.** La verificación encontró un fósil del borrador viejo en 6.2 («más de lo que había costado decidirlo dos noches antes, junto a la cama»), que afirmaba justo lo contrario de lo que 5.3 había reescrito — cortado |
| **H52** | «Nadie se lo discutió» repetido cinco veces con la misma construcción | critico-02 | 🟡 **mejorado, no eliminado.** «Nadie» seguía en 11 apariciones en el cap. 6 tras la primera pasada; reducido a 8 en la segunda, dejando las que son juego retórico deliberado («no se le debía a nadie, y nadie se la debía a ella») |
| **H53** | Vessa nunca se enfadaba pese a que la escaleta lo prometía explícitamente — arquetipo de Maestra Sabia Moribunda | critico-02, critico-04 | 🟢 **cerrado**, junto con H50 |
| **H54** | Talia perdía agencia en el clímax: salía a tocar porque Farel la llamaba | critico-02 | 🟢 **cerrado** |
| **H55** | El cap. 6 copiaba el lenguaje de la escaleta casi palabra por palabra en dos frases clave | critico-01, escritor-04 | 🟢 **cerrado**, ambas reescritas |
| **H56** | § M en riesgo: Vessa parecía seguir «llevando» el Músico tras dárselo a Sel | critico-03 | 🟢 **cerrado.** `decisiones.md` § Q añadido, diálogo del cap. 3 corregido |
| **H57** | Un médico que cobra «en monedas, no en memoria» sugería una medicina mágica capaz de curar lo que el arco decía sin cura | critico-03 | 🟢 **cerrado**, línea del médico corregida |
| **H58** | Diez ausente de los capítulos 2, 4, 5 y 6 — falta en la muerte y el velatorio | critico-04 | 🟢 **cerrado.** Añadido al velatorio del cap. 6 en la primera pasada; verificación del 28-08 encontró que seguía faltando en el propio concierto (su único público, sin pagar ese hilo) — añadido al borde del escenario mientras toca Talia. Sigue sin aparecer en caps. 2 y 4, aceptado (no son escenas suyas) |
| **H59** | Voces de Vessa, Farel y Talia poco diferenciadas — mismo tipo de frase corta y pulida | lector-adulto-02, lector-adulto-04 | 🔴 **abierto a propósito** — señalado, no reescrito línea por línea |
| **H60** | Economía de grado 4 no dramatizada en la página (Adalur no «cobra» nada visiblemente) | critico-03 | 🔴 **abierto a propósito** — exigiría una escena nueva de mayor calado |

**Leyenda igual que arriba.** H59 y H60 son hilos dejados abiertos a propósito. Ver
[resumen del 27-08](2026-08-27-arco-5/resumen.md) para el detalle completo.

### Hallazgos nuevos, hijos del panel del 27 de agosto (arco 6, último arco)

| # | Hallazgo | Coincidencias | Estado |
|---|---|---|---|
| **H61** | Error real contra `biblia/idioma.md`: la frase final decía «Halumi ish alun», faltaba «selmi» («mi hijo») | critico-01-estructura | 🟢 **cerrado del todo el 28-08.** La primera corrección arregló el cuerpo del texto (caps. 6-7) pero dejó el título del cap. 7, el nombre del propio fichero, `biblia/estado.md` (2 sitios) y `manuscrito/arco-6/00-escaleta.md` (4 sitios) con la frase vieja — todos corregidos y el fichero renombrado a `07-halumi-ish-selmi-alun.md`. Además se añadió un gloss orgánico de «selmi» (Sel = hijo, «-mi» = posesivo) en el propio cap. 6, para que el lector no llegue a la última página con dos palabras sin traducir en vez de una |
| **H62** | Nada se opone de verdad a lo que Sel quiere en todo el arco; la escena del precio era tachable | critico-01, critico-02, critico-03, critico-04, lector-nino-01, lector-nino-05, lector-adulto-03 (7 perfiles) | 🟢 **cerrado**, fricción real añadida (Anu duda, el paralelo con Bern se resuelve en escena) |
| **H63** | La imagen declarada del arco (Sel cargando a Pell dormido) no existía en el manuscrito | critico-01, critico-02, critico-03, critico-04 | 🟢 **cerrado**, escena añadida en el cap. 4 |
| **H64** | La corrección de H61 introdujo una traducción explícita de la frase, rompiendo la propia promesa de no traducirla | lector-adulto-02, escritor-04-editor | 🟢 **cerrado**, traducción cortada |
| **H65** | Última línea real del libro debía ser «…crié igual», no la frase explicativa detrás | escritor-04-editor | 🟢 **cerrado** |
| **H66** | «Tenía nueve años» tras actos maduros de Toma, tres veces — prohibición 6 de `voz.md` | escritor-04-editor | 🟢 **cerrado** en los tres puntos |
| **H67** | Contradicción factual: el narrador se atribuye privilegio exclusivo sobre la cabeza de Sel e Ila, contra la escena de Tarin del arco 1 | critico-02-personajes | 🟢 **cerrado**, afirmación suavizada |
| **H68** | Contradicción de tiempos: «tres años» en Adruin no cuadraba con el «casi un año» del resto del libro; «crié igual» de Ila sonaba a presente | critico-04-mercado, critico-02-personajes | 🟢 **cerrado** |
| **H69** | § K contradictorio entre capítulos sobre si la tentación del hueco «desaparece» o sigue disponible | critico-03-sistema | 🟢 **cerrado**, reformulado |
| **H70** | El quinto pago de la lista rompía la regla dura 2 (no memoria de nadie); el mecanismo `-in`/`-esh` de `idioma.md`, prometido, nunca cobrado | critico-03-sistema | 🟢 **cerrado del todo el 28-08.** La primera pasada dejó fósiles en ambos: § R (`decisiones.md`) conservaba a la vez «el precio no lo pone ninguna regla» y «sigue siendo memoria de Maara» sin reconciliar — reescrito para que la decisión sea lo que dispara el precio y la memoria de Maara sea lo que efectivamente se paga; y la escena de pago en el cap. 5 declaraba la pérdida sin ejecutarla (sólo se verificaba el borrón de estrellas) — añadida la comprobación explícita de que el recuerdo de la colina ya no está. En el `avanin` del cap. 6: la línea decía que Sel llevaba «toda la vida» oyendo `avanesh`, contra el propio arco 1 (`07-el-camino.md`), donde esa es la primera vez que Sel oye el sufijo, y se dice de Tarin, no de Sel — reescrita como recuerdo explícito de esa escena exacta. Además, nada establecía que Toma conociera veresh — añadida una escena breve en el cap. 3 donde Sel le enseña un puñado de palabras, incluida la distinción `avan`/`avanin`/`avanesh`, meses antes de que la use |
| **H71** | El hilo de la institución de la premisa queda sin resolver, sin arco donde pagarlo | critico-02-personajes (fuera de su encargo) | 🔴 **abierto a propósito** — no hay ya arco donde cerrarlo |
| **H82** | § M/regla dura 4 (padre biológico vivo) resuelto en el cap. 3 con un criterio inventado («diligencia»: quien no cuida, deja vacío el hueco) que el propio cap. 4 contradice — el padre reaparece reclamando autoridad y la escena certifica que «no había cambiado nada en él» | verificacion-02-sistema (28-08) | 🟢 **cerrado y verificado dos veces.** Reescrito con el criterio real de § M (reconocimiento social, el mismo que resolvió a Bern en el arco 2): el pueblo, no el padre, es quien ya no reconocía el hueco como suyo. La segunda verificación confirma que el cap. 4 pasó de refutación a ilustración |
| **H83** | Fósil de fecha: «dos años» en el cap. 3 contra «casi un año»/«once meses» en el resto del arco | verificacion-02-sistema (28-08) | 🟢 **cerrado** |
| **H84** | La fricción de Anu antes del quinto pago (cap. 5) llegaba después de que Sel ya hubiera escrito el precio — no podía cambiar nada, y la escena dejaba de ser tachable sólo por dependencia de lo que viene después, no por resistencia real dentro de ella | verificacion-01-estructura (28-08) | 🟢 **cerrado en dos pasadas.** La primera movió la objeción de Anu a antes de escribir, pero la hizo sobre el *cuándo* (esta noche o más tarde), no sobre el *qué* — objeción que se tacha sin que caiga nada, porque ella tampoco sabe el precio todavía. La segunda la reescribió sobre la sustancia («nueve años no es edad para firmar algo para siempre»), con Sel respondiéndole con una razón real y Anu cediendo a sabiendas |
| **H85** | Restos menores tras la ronda del 27-08: «ciego» en boca de Toma cuando Sel sólo pierde la vista de lejos; dos tics de «en el libro entero»/«del libro» (caps. 5 y 7); «casi un año antes con nueve meses menos encima» (cap. 5), redundante | verificacion-01-estructura, verificacion-02-sistema (28-08) | 🟢 **cerrados** |
| **H86** | H61 seguía vivo en un séptimo sitio tras la segunda ronda: `manuscrito/00-escaleta.md` (la escaleta maestra del libro) l. 110 seguía diciendo «Se completa *halumi ish alun*» | verificacion-04-estructura (28-08) | 🟢 **cerrado.** Corregido, y verificado con un grep de la frase mala (no de la buena) en todo el repositorio — sólo sobreviven citas históricas en informes de revisión ya fechados, que se dejan intactas como registro de lo que se encontró en su momento |
| **H87** | El gloss nuevo de `selmi` (cap. 6) definía el sufijo posesivo `-mi` al revés: decía que marcaba «que algo deja de ser de uno mismo y pasa a ser de otro», cuando `-mi` marca justo lo contrario (posesión propia — «halumi» es «mi sueño», no «el sueño de otro») | verificacion-04-estructura (28-08) | 🟢 **cerrado**, reescrito citando el paralelo correcto con `halu`/`halumi` ya establecido en la misma página |
| **H88** | La escena nueva del cap. 3 (Sel enseña veresh a Toma) contradecía la línea que venía a salvar: Toma comentaba la distinción en voz alta («qué raro, que la misma palabra signifique dos cosas...»), y el cap. 6 seguía afirmando que «Toma no pareció darse cuenta de lo que había hecho». Además la escena no decía ninguna palabra en veresh de verdad | verificacion-03-sistema (28-08) | 🟢 **cerrado.** Reescrita para que Toma sólo repita las palabras (incluidas las reales: *una, tor, kel, avan, avanin, avanesh*) sin comentar nada, y anclada a la escena exacta del arco 1 (el viejo hablando de Tarin) en vez de a «palabras recogidas por el camino» |
| **H89** | El `avanesh` del cap. 6 citaba la mitad irrelevante de la escena del arco 1 («ninguna es mejor, son distintas») y añadía «y era la buena», una jerarquía que el propio arco 1 niega explícitamente | verificacion-03-sistema (28-08) | 🟢 **cerrado**, reescrito citando la mitad que sí se cobra («si haces de algo mucho tiempo, la gente empieza a decírtelo con la otra, y ese es el problema») — el mecanismo exacto que hace que Toma diga «avanin» |
| **H90** | Fósil movido, no cortado: «el precio no lo iba a poner ninguna regla del mundo, lo iba a poner él» sobrevivía en el cap. 4, contradiciendo palabra por palabra la § R recién reconciliada y la escena del cap. 5 (donde Sel no pone el precio, lo descubre «sin querer») | verificacion-03-sistema (28-08) | 🟢 **cerrado**, reescrito para que la decisión sea lo que *dispara* el precio, no lo que lo *pone* |

### Hallazgos cerrados en la pasada de pulido general del 28 de agosto (todos los arcos)

| # | Hallazgo | Coincidencias | Estado |
|---|---|---|---|
| **H72** | Arco 2: § M contradicho en el propio texto — «viendo trabajar a Yeva de lejos… desde la calle, por la ventana», cuando § M exige haberlo visto de cerca; causa raíz en que la escena del taller de Yeva prevista por la escaleta (cap. 2) nunca se escribió | crítico de mercado (11-08) | 🟢 **cerrado.** Escena nueva en el cap. 2 (Sel mira por un nudo de la madera, lo pillan, Yeva lo deja seguir mirando desde la puerta); dos frases corregidas en el cap. 4 |
| **H24** | (arco 2) El capítulo 5 explica el sistema con una tabla de números en vez de vivirlo en escena | 3 lectores (2 adultos, 1 niño de 13) | 🟢 **cerrado en tres rondas.** 1ª (11-08): añadidas las lámparas sin quitar la columna de números. 2ª (28-08): quitada la columna, pero quedó un «libro grueso abierto» sin ninguna función en la escena (se cierra justo cuando Sel pide que le enseñen, leyéndose como un portazo) y el tercer escalón de coste era reversible («se le pasó en una hora») pese a decir «eso no tiene raya de vuelta». 3ª (28-08): el libro se sustituye por un cuenco y un trapo (herramientas de Yeva ya establecidas en el cap. 2); el tercer ejemplo pasa a ser un padre que pierde para siempre el recuerdo de la cara de su hijo recién nacido — irreversible de verdad, y sin repetir la configuración abuela/nietos que ecoaba la pérdida propia de Sel. Verificado por lector-nino-05 (28-08, ronda 2) y por critico-01-estructura (28-08, rondas 2 y 3) |
| **H25** | (arco 2) El narrador enuncia la tesis del libro en el clímax (cap. 6) | 2 críticos + editor de mesa | 🟢 **cerrado y verificado.** Cortada la frase final del narrador tras «—Vale —dijo»; el párrafo de la tesis explícita sustituido por un gesto físico (manos de Sel y de Bern). La verificación del 28-08 encontró que la moraleja había migrado a una línea nueva del cap. 2 («mirar no cuesta nada...»), también cortada |
| — | (arco 2) Hilo pizarra-dura-años/hoja-dura-una-vez (cap. 1) nunca recogido en la despedida (cap. 7) — señalado por el editor de mesa en «lo demás que aportó cada informe», sin H propio | editor de mesa (11-08) | 🟢 **cerrado.** Párrafo nuevo en el cap. 7 conecta la página que regala Ila con la pizarra del cap. 1 |
| **H73** | (arco 4) Cierre del cap. 7 terminaba en un fundido suave («hasta que el sueño le ganó») en vez de en la línea más dura del capítulo, que llegaba antes | decisión de cierre documentada en [resumen del 27-08](2026-08-27-arco-4/resumen.md) | 🟢 **cerrado.** Cortada la frase del sueño; el capítulo cierra en «algo que podría haberse gastado y no se había gastado» |
| **H74** | (arco 5) Motor cero: entre el diagnóstico y el concierto Sel no ejecuta ninguna acción activa; el único intento (ir a ver a Farel) se abandona sin insistir, justificado por el narrador como buena educación | verificacion-02-mercado (28-08) | 🟢 **cerrado.** Escena nueva: Sel sigue al médico a la calle y le pide que vuelva a mirar a Vessa, con el hueco a mano — el médico no se resiste (no hay voluntad que forzar, sólo oficio agotado), y ahí sí queda un intento real y fallido antes de rendirse |
| **H75** | (arco 5) La imagen nueva del cap. 5 no era la prometida por la escaleta: Vessa dejaba de tocar («no le salió nada»), no fallaba la nota exacta que llevaba treinta años fallando a propósito — perdía la conexión con la nota del hermano (H36) | verificacion-01-estructura, verificacion-02-mercado (28-08) | 🟢 **cerrado.** Reescrita para que falle esa nota exacta y note la diferencia entre fallarla adrede y perderla de verdad |
| **H76** | (arco 5) Fósil de borrador en el clímax (6.2): «más de lo que había costado decidirlo dos noches antes, junto a la cama» afirmaba que la decisión ya estaba tomada, justo lo contrario de la reescritura de 5.3 | verificacion-01-estructura (28-08) | 🟢 **cerrado**, línea cortada |
| **H77** | (arco 5) El narrador enunciaba la diferencia entre la interpretación de Talia y una prestada con papel («la diferencia estaba en otro sitio…»), en vez de dejar la imagen sola | verificacion-01-estructura, patrón H25 (28-08) | 🟢 **cerrado**, reducido a la imagen física sola |
| **H78** | (arco 5) Coincidencia cómoda: «alguien —un vecino, o quizás el propio médico— cargó a Vessa en brazos», sin identidad fija | verificacion-02-mercado (28-08) | 🟢 **cerrado**, es Farel, ya en escena |
| **H79** | (arco 5) «Cuatro arcos» (meta-textual) sobrevivía en el cap. 2 fuera de los capítulos ya revisados | verificacion-02-mercado (28-08) | 🟢 **cerrado**, «cuatro pueblos» |
| **H80** | (arco 5) Diez ausente durante el propio concierto, pese a ser el único público fiel de Talia establecido desde el cap. 1 | verificacion-02-mercado (28-08) | 🟢 **cerrado**, añadido al borde del escenario |

**Leyenda igual que arriba.** H71 es uno de varios hilos dejados abiertos a propósito al
cerrar el libro entero (junto con H35, H38 en su mitad no forzada, H48, H49, H59, H60 y
el expediente de Miren Saal documentado en `decisiones.md` § S) — decisiones de diseño,
no descuidos.

### Pasada 4 · 2 de agosto de 2026 · 15.418 → 14.632 palabras

Lo hecho, todo por corte y traslado. **Ni una escena reescrita.**

- **14 glosas del narrador cortadas.** Conservadas las cinco que lo delatan: «No tengas
  miedo. Todavía no pasa nada» · «Yo la he tenido en cuenta igual. Y ella también» ·
  «Debería haberme parado a mirarlo aquí. No lo hice. Sigo» · «Yo lo vi entero y no hice
  nada» · «Se me da mal dormir».
- **Fuera los tres carteles**, incluido «si de este libro entero hay que quedarse con una
  imagen». *Ninguno de los dos volvió a acordarse* recupera su golpe.
- **Cero negritas** en los siete capítulos.
- **«Se me da mal dormir» pasa a ser la última línea del arco.**
- **El cap. 5 cierra en «No fue la última»**; el epílogo del despacho sube antes.
- **Tarin y Anu pasan de bloque a escena.** La regla de once años de Tarin ahora sale en
  diálogo mientras desmonta la puerta; los veintiún años de Anu, en cuatro réplicas con la
  inspectora.
- Cortado también «el día que importa fue un día cualquiera», que es donde abandonó el
  lector de 13 años.

**Comprobado que las doce cosas de la lista de conservar siguen intactas.**

### Pasada 5 · reparar el daño colateral · 14.632 → 14.520 palabras

Todo lo que encontró el crítico al releer, arreglado:

- El error de tiempo verbal y de sentido en el nuevo cierre del cap. 5
- La isla de presente que metí arreglando a Anu
- El salto de dos meses sin marca
- «Dejé a mis hermanos en una piedra»: de cuatro veces a dos
- Los dos carteles que sobrevivían justo antes del clímax del arco
- La prolepsis duplicada casi literal entre el cap. 2 y el 7
- Seis márgenes rotos por la tijera

Las doce cosas a conservar, verificadas otra vez. Intactas.

---

## La lección de la primera iteración completa

**Escribir → panel → corregir → panel** funciona, y lo primero que enseñó es incómodo:

1. **La nota no se movió.** 4 de 8 antes y después de cortar 786 palabras.
2. **Sólo se cerraron los dos hallazgos que se podían arreglar cortando** (H5 y H14).
3. **Sobreestimé lo hecho en tres de cinco.** Dije que Tarin pasaba a escena y no pasó;
   dije cinco glosas y eran ocho; dije los carteles fuera y quedaban cuatro.
4. **Aparecieron tres hallazgos nuevos, y los tres son hijos del arreglo anterior.** El más
   instructivo: al quitar las glosas quedaron al aire ocho prolepsis que estaban camufladas
   entre ellas.

> **«Si se pueden quitar 786 palabras de narrador sin perder un solo dato, el narrador no
> llevaba datos: llevaba énfasis. Se hizo la resta y no apareció nada en el hueco.»**

**Lo que queda no se arregla con tijeras.** Y hay una escena concreta que arregla tres
criterios a la vez: **Ila entrando en su casa a la mañana siguiente de la riada, en plano,
con la despensa del invierno en el suelo.** Hoy eso está contado en cuatro líneas, fuera de
plano, por el narrador — que es exactamente el problema mayor del arco:

> **«Todas las causas de este arco están en escena y todos los efectos están contados fuera
> de plano.»**

---

## Lo que hay que conservar

Citado espontáneamente por cinco o más. **Antes de tocar nada, comprobar que sigue ahí.**

1. La voz que se pierde — *«De cómo sonaba, no.»* Los 6 adultos la señalan como la única
   emoción real, y ninguno señala el entierro
2. El musgo del cementerio — lo mejor del arco para 8 de 12 lectores
3. *«¿Y por qué dijimos que sí?» / «Porque daba pena.» / «Ya. Pero eso ya daba pena antes.»*
4. *«Que un día se me olvide poner la levadura.»* y el *«—No lo entiendo. —Ya.»*
5. Anu entera — el mejor personaje del libro, y no es el protagonista
6. *«Un martes.»*
7. *«—Perdona. ¿Cómo te llamabas?»* — el único giro que el libro entrega y no comenta
8. *«—No eres un perro. —Ya. —Es un dato relevante.»*

---

## Cuándo se lanza un panel

- Al cerrar un arco, antes de escribir el siguiente
- Después de una reescritura grande, **para comprobar si los hallazgos se cerraron de
  verdad**
- Nunca sobre material en curso: un panel sobre un borrador a medias devuelve ruido

## Cómo se lee un panel nuevo

1. Abrir `resumen.md`. Sólo eso.
2. Comparar la nota con la de la iteración anterior en la tabla de arriba.
3. Actualizar el seguimiento: qué pasó a 🟢, qué sigue 🔴, **y qué es nuevo**.
4. Un hallazgo que aparece por primera vez en el segundo panel suele ser **daño colateral
   de un arreglo del primero**. Es el dato más valioso que da esta carpeta.
