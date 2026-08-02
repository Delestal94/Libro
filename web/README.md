# Escritorio

La web para escribir y leer el libro desde el móvil.

## Cómo funciona

No hay base de datos. **El repositorio de GitHub es la única fuente de verdad**: cada
guardado desde el móvil es un commit, y un `git pull` en el PC lo trae. Por eso nunca
hay dos versiones distintas del libro.

```
móvil  →  web (Vercel)  →  API de GitHub  →  repo Delestal94/Libro
                                                    ↕
                                                  PC (git pull / push)
```

## Pantallas

| Ruta | Qué hace |
|---|---|
| `/` | Biblioteca: biblia, manuscrito y notas, con palabras por documento y totales. Crear documentos nuevos. |
| `/mundo` | Hub de fichas: personajes, lugares y criaturas, más las reglas del mundo. |
| `/editar/<ruta>` | Editor Markdown con atajos táctiles, autocompletado de `[[enlaces]]`, retroenlaces, vista previa y borrado. |
| `/leer` | El manuscrito completo con tipografía de libro, índice, tamaño de letra y progreso. |
| `/trama` | Registro de pistas sembradas (con estado) y línea del tiempo con los dos relojes. |
| `/progreso` | Rachas de escritura deducidas del historial de git, y descarga del libro en EPUB. |
| `/buscar` | Busca en todo el proyecto, ignorando acentos y mayúsculas. |
| Botón **Nota** | Captura rápida: se añade con fecha a `notas/inbox.md`. |

## Enlaces entre documentos

Escribe `[[Frieren]]` en cualquier sitio y queda enlazado al documento cuyo título o
nombre de fichero coincida, ignorando acentos y mayúsculas. También vale
`[[destino|texto que se muestra]]`. En cada documento se ve **quién lo menciona** y qué
enlaces suyos aún no tienen destino.

Es sintaxis de wiki guardada tal cual en el Markdown: el fichero se sigue leyendo sin la app.

## Fichas: personajes, lugares, fauna y flora

Los cuatro son lo mismo por debajo —un fichero Markdown con datos técnicos en cabecera
YAML y texto libre debajo—, así que comparten toda la maquinaria (`src/lib/fichas.ts`)
y sólo se diferencian en la carpeta, los campos sugeridos y las secciones de la
plantilla. Añadir un cuarto tipo es añadir una entrada a `TIPOS`.

```markdown
---
nombre: Frieren
edad: 1000
edad_aparente: 17
---

# Frieren

## Biografía
```

**Los campos no están cerrados.** Los que ofrece la app son sugerencias: se pueden
quitar todos e inventarse otros —«grado», «deuda», «precio que paga»—. Al guardar, la
cabecera se reescribe entera, así que un campo que quitas desaparece del fichero en vez
de quedarse vacío.

Cada tipo tiene los suyos: los lugares llevan **grado de tecnología mágica**, **qué se
oye** y **lo que esconde**; la fauna, **qué sonido hace**; la flora, **a qué huele**,
**para qué sirve** y —obligatorio en este mundo— **qué cuesta usarla**. Un mismo campo
puede significar cosas distintas según el tipo: `suena` es «qué se oye» en un lugar y
«qué sonido hace» en un animal.

Como son ficheros Markdown normales, entran en el buscador y admiten `[[enlaces]]` desde
el primer día: al mencionar `[[Frieren]]` en un capítulo, su ficha lo registra sola.

Los slugs se validan con **lista de permitidos** (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`), no
prohibiendo `..` y `/`. Una lista de prohibidos siempre se queda corta, y aquí el slug
acaba siendo un nombre de fichero.

## Línea del tiempo

Los mismos sucesos, dos ordenaciones:

- **Orden del mundo** — cuándo ocurrió de verdad.
- **Orden del lector** — en qué orden se entera.

Verlos reordenarse al cambiar de pestaña *es* la función: en un misterio de largo
recorrido, la distancia entre los dos relojes es la trama.

El campo «Cuándo» es texto libre. Se intenta deducir un año de lo que escribas
(«1200», «hace 300 años», «Año 847 de la Ceniza», «1200-03-15»); **lo que no se entiende
no se inventa**, va a un grupo «sin situar». La separación entre puntos es proporcional
al tiempo transcurrido, con escala de raíz cuadrada: en lineal, un salto de tres siglos
aplastaría contra el margen dos escenas del mismo día.

El color del punto dice qué sabe el lector en ese momento —lo sabe, lo sospecha, no lo
sabe—, que es lo que permite ver de un vistazo dónde va a ciegas.

## Sin conexión

- La app **abre** sin cobertura (service worker, red primero y caché de reserva).
- Lo que escribes se guarda en el móvil mientras tanto, y si cierras la pestaña con
  cambios sin guardar, al volver te ofrece recuperarlos.
- Un guardado sin red entra en cola y **se envía solo** al recuperar la señal.

La caché es red-primero a propósito: al revés sería más rápida, pero mostraría capítulos
viejos tras editarlos en otro dispositivo — justo el fallo que este proyecto evita.

## Tests

```powershell
npm test
```

Cubren lo que es fácil romper sin enterarse: resolución de enlaces y escapado de HTML,
edición de tablas Markdown sin perder el texto de alrededor, cálculo de rachas en los
bordes (cambio de mes, racha viva si escribiste ayer), y **validez del EPUB** —
`mimetype` primero y sin comprimir, y XHTML bien formado, que es lo que un lector de
ebooks comprueba antes de rechazar el fichero.

## Desarrollo

```powershell
cp .env.example .env.local   # y rellenar los valores
npm install
npm run dev
```

## Detalles que importan

- **Conflictos.** Al guardar se envía el `sha` de la versión que se abrió. Si el fichero
  cambió mientras tanto (por ejemplo, lo editaste en el PC), GitHub rechaza el cambio y la
  app avisa en vez de pisar el trabajo en silencio.
- **Despliegues.** `vercel.json` lleva un `ignoreCommand` para que escribir un capítulo
  desde el móvil no dispare un redespliegue: solo se reconstruye si cambia algo de `web/`.
- **Capítulos.** En `manuscrito/`, los ficheros `00-*` son material de trabajo (la escaleta)
  y quedan fuera del modo lectura y del recuento de palabras del libro.
- **Sesión.** Una contraseña, cookie firmada con HMAC, 90 días. Cambiar `SITE_PASSWORD`
  invalida las sesiones abiertas si no se ha fijado `AUTH_SECRET` aparte.
