/** Pantalla de ayuda cuando faltan las variables de entorno. */
export default function SinConfigurar({ detalle }: { detalle?: string }) {
  return (
    <div className="py-10">
      <h1 className="mb-2 font-serif text-2xl">Falta configurar el repositorio</h1>
      <p className="mb-6 text-sm text-tenue">
        La app guarda el libro en GitHub, así que necesita saber dónde y con qué permiso.
      </p>

      <div className="rounded-lg border border-borde bg-superficie p-4 text-sm">
        <p className="mb-3 font-semibold">Variables de entorno necesarias:</p>
        <ul className="space-y-2 font-mono text-xs">
          <li>
            <span className="text-acento">GITHUB_REPO</span> = Delestal94/Libro
          </li>
          <li>
            <span className="text-acento">GITHUB_TOKEN</span> = token con permiso de Contents
          </li>
          <li>
            <span className="text-acento">SITE_PASSWORD</span> = tu contraseña
          </li>
        </ul>
      </div>

      {detalle && (
        <pre className="mt-4 overflow-x-auto rounded-lg border border-borde bg-superficie p-3 text-xs text-peligro">
          {detalle}
        </pre>
      )}

      <p className="mt-6 text-sm text-tenue">
        En local van en <code className="text-acento">web/.env.local</code>; en producción, en
        Settings → Environment Variables del proyecto de Vercel.
      </p>
    </div>
  );
}
