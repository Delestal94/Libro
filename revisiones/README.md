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

### 2026-08-02 · la primera

Autopuntuación previa: **8 / 8** tras tres pasadas. Independiente: **4,25**.

Puntuaciones: estructura 4 · personajes 5 · sistema 4 · mercado 4.

Lectores: 1 de 6 niños abandona (13 años, en el capítulo 1). 6 de 6 adultos comprarían el
siguiente, y **los 6 dicen literalmente «a una persona concreta»**.

---

## Seguimiento de hallazgos

Los que coinciden en tres o más revisores. **Se actualiza el estado en cada panel nuevo**,
no antes: que yo crea haberlo arreglado no es que esté arreglado.

| # | Hallazgo | Coincidencias | 2026-08-02 |
|---|---|---|---|
| **H1** | El narrador explica lo que las escenas ya habían hecho. 22 glosas en 7 capítulos; 17 sobran | **20 / 20** | 🔴 abierto |
| **H2** | Señalar cuál es la imagen buena la estropea | 6 | 🔴 abierto |
| **H3** | Nadie quiere ser Sel. Todos prefieren a Ila | 6 / 6 niños | 🔴 abierto |
| **H4** | Lo que los adultos admiran es lo que los niños saltan. Las biografías van en bloque | 10 / 12 lectores + 3 escritores | 🔴 abierto |
| **H5** | El final del capítulo 5 expulsa: el buen final queda sepultado bajo dos codas | 8 | 🔴 abierto |
| **H6** | El capítulo 7 se cae. Todo lo que pasa ya estaba decidido al final del 6 | 6 | 🔴 abierto |
| **H7** | Ila abandona a sus hermanos y el libro no se entera | 5 | 🔴 abierto |
| **H8** | El humor muere en el capítulo 3. Los capítulos 4 y 6 no tienen ninguno | 4 | 🔴 abierto |
| **H9** | «Papel» aparece una vez en todo el manuscrito y no la dice ningún personaje | 2 críticos + 3 niños | 🔴 abierto |
| **H10** | El sistema no tiene unidad de medida. Tres contradicciones de alcance | 2 críticos | 🔴 abierto |
| **H11** | Sel no elige nunca. Sus dos decisiones están anuladas por el texto | 2 críticos | 🔴 abierto |
| **H12** | La numeración de la biblia está desfasada respecto al manuscrito | 2 críticos | 🔴 abierto |
| **H13** | No hay título | 1 crítico | 🔴 abierto |

**Leyenda:** 🔴 abierto · 🟡 tocado, sin confirmar · 🟢 cerrado por un panel posterior

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
