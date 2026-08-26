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
| **H22** | El motor del arco 2 —dos Huérfanos, un mes de crisis de creencia en el pueblo— nunca se dramatiza. El cap. 1 muestra el papel fallando por completo; el cap. 6 afirma un mes de conflicto que ningún capítulo intermedio escribió | 4 críticos (estructura, personajes, sistema, mercado) | 🟡 **segundo intento, mejoró de verdad.** La escena del pan (accidental) más la de la manzana (Sel vuelve a propósito, sabiendo lo que va a pasar: «Ésa no te la han dado. Ésa la has ido a buscar. Sel no lo negó») le dan a Sel la agencia que faltaba — un verificador ya lo da por **cerrado**, el otro sigue en **a medias** porque Adruin nunca «concede» el papel en ninguna página y el mejor de los incidentes contados por Bern (el del hermano pequeño) sigue siendo resumen, no escena. La prueba del tachado en 6.2 no cambia |
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
