# Script para limpiar notificaciones de prueba en PQ Trader
# Ejecutar con: .\limpiar-notificaciones.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Limpiando notificaciones de prueba..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar token
Write-Host "Por favor, proporciona tu token de admin." -ForegroundColor Yellow
Write-Host "(Lo puedes encontrar en DevTools > Application > Local Storage > token)" -ForegroundColor Yellow
Write-Host ""
$token = Read-Host "Pega tu token aqui"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "Error: Token no proporcionado" -ForegroundColor Red
    Write-Host ""
    pause
    exit
}

Write-Host ""
Write-Host "Eliminando notificaciones..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/notifications/clear-all" -Method DELETE -Headers $headers
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Proceso completado exitosamente!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resultado:" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
    Write-Host ""
    Write-Host "Ahora refresca tu dashboard (F5)" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Error al eliminar notificaciones" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalles del error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Posibles causas:" -ForegroundColor Yellow
    Write-Host "1. El backend no está corriendo (ejecuta: cd backend && npm run dev)" -ForegroundColor White
    Write-Host "2. El token es inválido o expiró (obtén uno nuevo desde el navegador)" -ForegroundColor White
    Write-Host "3. No tienes permisos de admin" -ForegroundColor White
    Write-Host ""
}

pause
