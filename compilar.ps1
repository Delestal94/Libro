<#
.SYNOPSIS
    Compila el manuscrito a EPUB y HTML (y opcionalmente PDF).
.DESCRIPTION
    Une todos los .md de manuscrito/ en orden alfabetico, saltandose los 00-*
    (material de trabajo). Titulo y autor salen de metadatos.yaml.
    Requiere Pandoc:  winget install --id JohnMacFarlane.Pandoc
.EXAMPLE
    .\compilar.ps1 -Pdf
#>
param(
    [switch]$Pdf
)

$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot

if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
    Write-Error "Pandoc no esta instalado. Ejecuta: winget install --id JohnMacFarlane.Pandoc"
}

$salida = Join-Path $raiz 'salida'
if (-not (Test-Path $salida)) { New-Item -ItemType Directory -Path $salida | Out-Null }

$capitulos = Get-ChildItem (Join-Path $raiz 'manuscrito') -Filter '*.md' |
             Where-Object { $_.Name -notlike '00-*' } |
             Sort-Object Name

if ($capitulos.Count -eq 0) {
    Write-Error "No hay capitulos en manuscrito/ (los ficheros 00-* se ignoran a proposito)."
}

Write-Host "Capitulos:" -ForegroundColor Cyan
$capitulos | ForEach-Object { Write-Host "  - $($_.Name)" }

$entrada = $capitulos.FullName
$comunes = @('--from', 'markdown', '--toc', '--metadata-file', (Join-Path $raiz 'metadatos.yaml'))

pandoc $entrada @comunes -o (Join-Path $salida 'libro.epub')
pandoc $entrada @comunes -o (Join-Path $salida 'libro.html') --standalone --embed-resources

if ($Pdf) {
    pandoc $entrada @comunes -o (Join-Path $salida 'libro.pdf') --pdf-engine=xelatex -V mainfont="Georgia"
}

$palabras = ($capitulos | Get-Content -Raw | Measure-Object -Word).Words
Write-Host ""
Write-Host "Listo -> $salida" -ForegroundColor Green
Write-Host "Palabras en el manuscrito: $palabras" -ForegroundColor Green
