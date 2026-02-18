# Script para verificar notificaciones en PQ Trader
# Ejecutar con: .\verificar-notificaciones.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificando Sistema de Notificaciones" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que el backend este corriendo
Write-Host "1. Verificando backend..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:4000/health" -ErrorAction SilentlyContinue | Out-Null
    Write-Host "   [OK] Backend corriendo en puerto 4000" -ForegroundColor Green
} catch {
    Write-Host "   [ERROR] Backend NO esta corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend && npm run dev" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host ""

# 2. Solicitar token
Write-Host "2. Autenticacion" -ForegroundColor Yellow
Write-Host "   Obten tu token de admin desde:" -ForegroundColor Gray
Write-Host "   DevTools (F12) > Application > Local Storage > token" -ForegroundColor Gray
Write-Host ""
$token = Read-Host "   Pega tu token aqui"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "   [ERROR] Token no proporcionado" -ForegroundColor Red
    Write-Host ""
    pause
    exit
}

Write-Host ""
Write-Host "3. Consultando notificaciones..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Cache-Control" = "no-cache"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/notifications/unread" -Headers $headers
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Resultado del Backend" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($response.success) {
        Write-Host "[OK] Success: $($response.success)" -ForegroundColor Green
        Write-Host "[OK] Count: $($response.count)" -ForegroundColor Green
        Write-Host "[OK] Data length: $($response.data.Count)" -ForegroundColor Green
        Write-Host ""
        
        if ($response.count -eq 0 -or $response.data.Count -eq 0) {
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "[OK] Backend esta correcto (sin notificaciones)" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Si aun ves notificaciones en el dashboard:" -ForegroundColor Yellow
            Write-Host "1. Cierra todas las ventanas del navegador" -ForegroundColor White
            Write-Host "2. Limpia el cache: Ctrl + Shift + Delete" -ForegroundColor White
            Write-Host "3. Abre de nuevo y presiona: Ctrl + Shift + R" -ForegroundColor White
            Write-Host ""
            Write-Host "También puedes probar:" -ForegroundColor Yellow
            Write-Host "- Modo incognito/privado" -ForegroundColor White
            Write-Host "- Otro navegador" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "[ALERTA] Hay $($response.count) notificaciones" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "Notificaciones encontradas:" -ForegroundColor Yellow
            foreach ($notif in $response.data) {
                Write-Host "- [$($notif.type)] $($notif.title)" -ForegroundColor White
                Write-Host "  Creada: $($notif.created_at)" -ForegroundColor Gray
                Write-Host ""
            }
            Write-Host ""
            Write-Host "Para eliminarlas, ejecuta:" -ForegroundColor Yellow
            Write-Host ".\limpiar-notificaciones.ps1" -ForegroundColor White
            Write-Host ""
        }
    } else {
        Write-Host "[ERROR] Success: $($response.success)" -ForegroundColor Red
        Write-Host "[ERROR] Error: $($response.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "[ERROR] Error consultando el backend" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalles:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Posibles causas:" -ForegroundColor Yellow
    Write-Host "1. Token invalido o expirado" -ForegroundColor White
    Write-Host "2. No tienes permisos de admin" -ForegroundColor White
    Write-Host "3. El backend no esta respondiendo correctamente" -ForegroundColor White
    Write-Host ""
}

pause
