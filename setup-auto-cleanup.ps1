# Script para configurar limpieza automática de notificaciones
# Se ejecuta diariamente a medianoche mediante Task Scheduler

Write-Host "🔧 Configurando limpieza automática de notificaciones..." -ForegroundColor Cyan

# Obtener la ruta del proyecto
$projectPath = $PSScriptRoot | Split-Path
$backendPath = Join-Path $projectPath "backend"

# Crear script de ejecución
$scriptContent = @"
# Script de limpieza automática de notificaciones
cd '$backendPath'
npm run cleanup:notifications
"@

$scriptPath = Join-Path $backendPath "run-cleanup.ps1"
$scriptContent | Out-File -FilePath $scriptPath -Encoding UTF8

Write-Host "✅ Script creado en: $scriptPath" -ForegroundColor Green

# Configurar tarea programada (ejecutar diariamente a medianoche)
$taskName = "PQ Trader - Cleanup Notifications"
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At "00:00"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    # Verificar si la tarea ya existe
    $existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    
    if ($existingTask) {
        Write-Host "⚠️  La tarea '$taskName' ya existe. Actualizando..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    }
    
    # Registrar nueva tarea
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Limpia notificaciones antiguas de PQ Trader diariamente"
    
    Write-Host "`n✅ Tarea programada configurada exitosamente!" -ForegroundColor Green
    Write-Host "📅 Se ejecutará diariamente a las 00:00 (medianoche)" -ForegroundColor Cyan
    Write-Host "`nPara ver la tarea: Task Scheduler -> Biblioteca de Programador de tareas" -ForegroundColor Gray
    Write-Host "Para ejecutar manualmente: cd backend && npm run cleanup:notifications" -ForegroundColor Gray
    
} catch {
    Write-Host "`n❌ Error al configurar tarea programada: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Puedes ejecutar manualmente con: cd backend && npm run cleanup:notifications" -ForegroundColor Yellow
}

Write-Host "`n✅ Configuración completada!" -ForegroundColor Green
