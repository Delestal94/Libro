# El panel de revisión

> Cómo se pide retroalimentación de verdad sobre un arco. Se repite igual cada vez, para
> poder comparar un arco con otro.

## Por qué veinte y no ochenta

Veinte lectores **idénticos** no son veinte lectores: son veinte muestras del mismo
modelo, con el mismo encargo, sobre el mismo texto. Coinciden en casi todo. El segundo
aporta bastante, el quinto poco, el vigésimo nada — y cada uno cuesta unos 60 000 tokens.

La señal no está en el número. Está en **la variedad del perfil**. Un niño de ocho al que
le leen en voz alta y uno de trece que casi no lee abandonan el libro por motivos
distintos, y los dos motivos son información. Dos niños de diez que leen fantasía dicen lo
mismo dos veces.

Por eso el panel son **veinte perfiles distintos**, no veinte copias.

## La regla de lectura de los resultados

**Lo que dice un solo revisor es una opinión. Lo que dicen seis es un hecho.**

Al agregar, lo único que importa es **en qué coinciden perfiles que no se parecen en
nada**. Si el niño de ocho y el crítico de mercado señalan el mismo párrafo, ese párrafo
está mal. Si sólo lo señala uno, es gusto.

---

## Los veinte

### Lectores niño — ¿lo abandona?

| # | Perfil |
|---|---|
| 1 | 10 años, devora fantasía, se sabe One Piece de memoria |
| 2 | 8 años, se lo leen en voz alta. Escucha, no lee. Se distrae y pregunta |
| 3 | 12 años, sólo lee manga. La prosa larga le cuesta |
| 4 | 11 años, lectora voraz, se enamora de los personajes secundarios |
| 5 | 13 años, casi no lee, juega. **El umbral máximo de enganche** |
| 6 | 9 años, sensible. Puede abandonar por dolor, no por aburrimiento |

### Lectores adulto — ¿compra el siguiente?

| # | Perfil |
|---|---|
| 1 | 35, lee de noche cansado, 20 libros al año |
| 2 | 45, madre o padre. Lee pensando en si se lo daría a su hijo |
| 3 | 28, odia la fantasía, lee literaria. **El más hostil al género** |
| 4 | 60, lector clásico de toda la vida. Compara con lo que ya leyó |
| 5 | 32, lee en el metro en tramos de veinte minutos |
| 6 | 50, apenas lee, ve series. Compara con narrativa audiovisual |

### Críticos — ¿aguanta el estándar?

| # | Énfasis |
|---|---|
| 1 | **Estructura.** Los ocho puntos y la prueba del tachado |
| 2 | **Personajes.** Agencia, arco, si funcionan como personas |
| 3 | **Sistema y mundo.** Coherencia de reglas, si se puede teorizar |
| 4 | **Mercado.** ¿Se publica? ¿A quién? ¿Compite con las referencias? |

### Escritores — ¿está bien escrito?

| # | Escuela |
|---|---|
| 1 | Prosa seca y precisa. Va a querer cortar |
| 2 | Literatura infantil y juvenil premiada. Sabe qué aguanta un niño |
| 3 | Fantasía comercial de éxito. Sabe de enganche y de arcos |
| 4 | Editor de mesa. Qué se corta, qué se mueve, qué falta |

---

## Cómo se ejecuta

1. Se crea la carpeta `revisiones/AAAA-MM-DD-arco-N/`.
2. **Se lanza UNO solo primero y se comprueba que ha escrito su fichero.** Si no lo ha
   escrito, el registro de agentes está antiguo: hay que reiniciar antes de seguir. Ver
   abajo por qué.
3. Se lanzan los diecinueve restantes, cada uno con su perfil. **Cada uno escribe su propio
   informe** en esa carpeta y sólo puede escribir ahí.
4. Cada uno devuelve además un resumen compacto: veredicto y tres hallazgos.
5. Se agrega todo en `resumen.md`, ordenado **por número de coincidencias**, no por
   gravedad aparente.
6. Se actualiza la tabla de seguimiento de `revisiones/README.md`.

> ### Por qué el paso 2
>
> En el primer panel los agentes tenían cargado el registro anterior, **sin permiso de
> escritura**. Devolvieron los veinte informes por respuesta, hubo que condensarlos para
> que cupieran, y los transcripts completos —que son temporales— se limpiaron.
>
> Sobrevivieron los hallazgos, las puntuaciones y las mejores citas. Se perdieron los
> matices y la mitad de los ejemplos. **Comprobar con uno cuesta dos minutos.**

## Qué se hace después

Sólo se actúa sobre lo que coincide en **tres o más perfiles distintos**. El resto se
anota y se deja pasar: perseguir opiniones sueltas es la forma más rápida de escribir un
libro sin voz.

---

## Los dos tamaños de panel

**No se lanzan veinte revisores cada vez.** Los veinte son para cerrar un arco. Para
comprobar una pasada hay otro modo, mucho más barato.

| | **Panel completo** | **Verificación** |
|---|---|---|
| Cuándo | Al cerrar un arco | Después de una pasada de correcciones |
| Quién | Los veinte perfiles | 2 críticos + 2 lectores, **los que abrieron los hallazgos que se tocaron** |
| Qué leen | Todo | **Su propio informe anterior, el `git diff` y los capítulos tocados** |
| Qué contestan | Los siete u ocho puntos | **Sólo: ¿se cerró? ¿qué se rompió?** |

**En verificación no se relee el mundo.** El manuscrito entero cuesta lo mismo que
leerlo entero, y lo único que ha cambiado son mil palabras que `git diff` da en un
suspiro.

### Reparto de modelo

Los lectores **reportan experiencia**, no analizan: van con un modelo más barato y el
informe no baja de calidad. Los críticos y el escritor necesitan juicio y van con el
bueno. Está en las cabeceras de `.claude/agents/`.

### Y una regla para quien orquesta

**No te traigas los informes enteros a tu contexto.** Los agentes escriben en `revisiones/`
y devuelven un resumen de tres hallazgos: con eso se agrega. Leer los veinte informes
completos para escribir el resumen es pagar dos veces por lo mismo.

---

## Los relectores están contaminados

Lo dijo el lector de 35 años, y tiene razón:

> «No sé si el entierro ha mejorado o si soy yo el que ya no esperaba nada de él. **Un
> relector no sirve para medir eso; hay que preguntárselo a alguien virgen.**»

**Hay preguntas que sólo contesta alguien que no lo ha leído nunca:** si una escena
emociona, si un misterio se entiende, si el ritmo aguanta. Y hay otras que sólo contesta un
relector: si un hallazgo se cerró, si algo se rompió.

En un panel completo, **al menos la mitad de los lectores tienen que ser nuevos**.
