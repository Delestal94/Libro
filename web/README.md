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
| `/editar/<ruta>` | Editor Markdown con atajos táctiles, contador de palabras y vista previa. |
| `/leer` | El manuscrito completo con tipografía de libro, índice, tamaño de letra y progreso. |
| `/buscar` | Busca en todo el proyecto, ignorando acentos y mayúsculas. |
| Botón **Nota** | Captura rápida: se añade con fecha a `notas/inbox.md`. |

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
