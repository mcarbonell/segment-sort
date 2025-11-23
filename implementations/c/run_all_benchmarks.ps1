# Script para ejecutar benchmarks de las 3 versiones de BlockMerge
# Uso: .\run_all_benchmarks.ps1 [tamano_array]

param(
    [int]$Size = 1000000
)

Write-Host ""
Write-Host "=====================================================================================================" -ForegroundColor Cyan
Write-Host "  Ejecutando benchmarks de las 3 versiones de BlockMerge" -ForegroundColor Cyan
Write-Host "  Tamano del array: $Size elementos" -ForegroundColor Cyan
Write-Host "=====================================================================================================" -ForegroundColor Cyan

$versions = @("V1", "V2", "V3")

foreach ($ver in $versions) {
    Write-Host ""
    Write-Host ">>> Compilando BlockMerge $ver..." -ForegroundColor Yellow
    
    $compileCmd = "gcc -O3 -DUSE_$ver -o benchmark_$ver.exe benchmark.c -lm"
    Invoke-Expression $compileCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Compilacion exitosa" -ForegroundColor Green
        
        Write-Host ""
        Write-Host ">>> Ejecutando benchmark para BlockMerge $ver..." -ForegroundColor Yellow
        & ".\benchmark_$ver.exe" $Size
    }
    else {
        Write-Host "[ERROR] Error en la compilacion de $ver" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================================================================================" -ForegroundColor Cyan
Write-Host "  Benchmarks completados" -ForegroundColor Cyan
Write-Host "=====================================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Archivos generados:" -ForegroundColor Green
Write-Host "  - benchmark_V1.exe" -ForegroundColor Gray
Write-Host "  - benchmark_V2.exe" -ForegroundColor Gray
Write-Host "  - benchmark_V3.exe" -ForegroundColor Gray
Write-Host ""
