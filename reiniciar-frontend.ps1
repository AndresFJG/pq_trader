# Script para reiniciar el frontend de PQ Trader
# Ejecutar con: .\reiniciar-frontend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Reiniciar Frontend - PQ Trader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Este script reiniciara el servidor de desarrollo del frontend." -ForegroundColor Yellow
Write-Host ""

# Cambiar al directorio frontend
Set-Location "C:\Users\USER\Desktop\pq_trader\frontend"

Write-Host "1. Limpiando cache de Next.js..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "   [OK] Cache eliminada" -ForegroundColor Green
Write-Host ""

Write-Host "2. Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   IMPORTANTE: Despues de que inicie el servidor:" -ForegroundColor Cyan
Write-Host "   1. Abre Chrome DevTools (F12)" -ForegroundColor White
Write-Host "   2. Click derecho en el boton Recargar" -ForegroundColor White
Write-Host "   3. Selecciona 'Vaciar cache y recargar de forma forzada'" -ForegroundColor White
Write-Host ""
Write-Host "   O usa el atajo: Ctrl + Shift + Delete" -ForegroundColor White
Write-Host "   - Selecciona 'Imagenes y archivos almacenados en cache'" -ForegroundColor White
Write-Host "   - Haz click en 'Borrar datos'" -ForegroundColor White
Write-Host ""

pause

Write-Host ""
Write-Host "Iniciando frontend..." -ForegroundColor Green
Write-Host ""

npm run dev
