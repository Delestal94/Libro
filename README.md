# Proyecto Libro

Espacio de trabajo del libro. Todo en Markdown plano: se lee sin herramientas,
se versiona con git y se compila a PDF/EPUB cuando haga falta.

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `biblia/` | La "fuente de verdad". Premisa, personajes, mundo, decisiones tomadas. Se consulta antes de escribir. |
| `manuscrito/` | El texto del libro. Un fichero por capítulo, numerado: `01-titulo.md`, `02-titulo.md`... |
| `notas/` | Ideas sueltas, investigación, escenas descartadas. Nada de aquí acaba en el libro tal cual. |
| `salida/` | Ficheros generados (PDF, EPUB). No se versiona. |

## Reglas de trabajo

1. **La biblia manda.** Si el manuscrito contradice la biblia, se corrige uno de los dos —
   pero conscientemente, no por descuido.
2. **Un capítulo = un fichero.** Renumerar es barato; reordenar dentro de un fichero gigante no.
3. **Se escribe feo primero.** El primer borrador solo tiene que existir. La edición es una fase aparte.

## Compilar

Requiere [Pandoc](https://pandoc.org/installing.html) (aún no instalado en esta máquina):

```powershell
winget install --id JohnMacFarlane.Pandoc
```

Después:

```powershell
.\compilar.ps1          # genera salida/libro.epub y salida/libro.html
.\compilar.ps1 -Pdf     # además genera PDF (requiere MiKTeX o TinyTeX)
```
