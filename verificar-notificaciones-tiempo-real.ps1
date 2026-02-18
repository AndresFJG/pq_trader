# Script para verificar notificaciones en tiempo real
# Ejecutar: .\verificar-notificaciones-tiempo-real.ps1

Write-Host "`n🔔 Verificando notificaciones en tiempo real..." -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Configuración
$API_URL = "http://localhost:4000/api"

# Función para obtener token de admin
function Get-AdminToken {
    Write-Host "🔑 Obteniendo token de autenticación..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = "admin@pqtrader.com"
        password = "Admin123!"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$API_URL/auth/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json" `
            -SessionVariable session

        if ($response.success) {
            Write-Host "✅ Token obtenido exitosamente`n" -ForegroundColor Green
            return $response.data.token
        } else {
            Write-Host "❌ Error al obtener token: $($response.error)" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para obtener notificaciones
function Get-Notifications {
    param([string]$token)
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Cache-Control" = "no-cache"
            "Pragma" = "no-cache"
        }

        $response = Invoke-RestMethod -Uri "$API_URL/notifications?limit=20" `
            -Method GET `
            -Headers $headers

        return $response.data
    } catch {
        Write-Host "❌ Error al obtener notificaciones: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Función para obtener notificaciones no leídas
function Get-UnreadNotifications {
    param([string]$token)
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Cache-Control" = "no-cache"
            "Pragma" = "no-cache"
        }

        $response = Invoke-RestMethod -Uri "$API_URL/notifications/unread" `
            -Method GET `
            -Headers $headers

        return $response.data
    } catch {
        Write-Host "❌ Error al obtener notificaciones no leídas: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Función para mostrar notificación
function Show-Notification {
    param($notification)
    
    $icon = switch ($notification.type) {
        "new_user" { "👤" }
        "payment_processed" { "💰" }
        "new_course" { "📚" }
        "new_enrollment" { "📝" }
        "contact_message" { "📧" }
        "new_mentorship_booking" { "🎯" }
        default { "🔔" }
    }
    
    $readStatus = if ($notification.is_read) { "✓ Leída" } else { "⚠️ No leída" }
    $timeAgo = Get-TimeAgo -dateString $notification.created_at
    
    Write-Host "$icon $($notification.title)" -ForegroundColor Cyan
    Write-Host "   $($notification.message)" -ForegroundColor Gray
    Write-Host "   Estado: $readStatus | Hace: $timeAgo" -ForegroundColor DarkGray
    Write-Host "   ID: $($notification.id)" -ForegroundColor DarkGray
    Write-Host ""
}

# Función para calcular tiempo transcurrido
function Get-TimeAgo {
    param([string]$dateString)
    
    try {
        $date = [DateTime]::Parse($dateString)
        $now = Get-Date
        $diff = $now - $date
        
        if ($diff.TotalMinutes -lt 1) {
            return "Menos de 1 minuto"
        } elseif ($diff.TotalMinutes -lt 60) {
            return "$([Math]::Floor($diff.TotalMinutes)) minutos"
        } elseif ($diff.TotalHours -lt 24) {
            return "$([Math]::Floor($diff.TotalHours)) horas"
        } else {
            return "$([Math]::Floor($diff.TotalDays)) días"
        }
    } catch {
        return "Desconocido"
    }
}

# MAIN
$token = Get-AdminToken

if (-not $token) {
    Write-Host "`n❌ No se pudo obtener el token. Verifica que el backend esté corriendo." -ForegroundColor Red
    exit 1
}

Write-Host "📊 NOTIFICACIONES NO LEÍDAS" -ForegroundColor Yellow
Write-Host "============================`n" -ForegroundColor Yellow

$unreadNotifications = Get-UnreadNotifications -token $token

if ($unreadNotifications.Count -eq 0) {
    Write-Host "   ✓ No hay notificaciones no leídas`n" -ForegroundColor Green
} else {
    Write-Host "   Total: $($unreadNotifications.Count) notificaciones no leídas`n" -ForegroundColor Cyan
    foreach ($notification in $unreadNotifications) {
        Show-Notification -notification $notification
    }
}

Write-Host "`n📋 TODAS LAS NOTIFICACIONES RECIENTES (Últimas 20)" -ForegroundColor Yellow
Write-Host "==================================================`n" -ForegroundColor Yellow

$allNotifications = Get-Notifications -token $token

if ($allNotifications.Count -eq 0) {
    Write-Host "   ⚠️ No hay notificaciones en la base de datos`n" -ForegroundColor Yellow
} else {
    Write-Host "   Total: $($allNotifications.Count) notificaciones`n" -ForegroundColor Cyan
    
    # Agrupar por estado
    $unread = $allNotifications | Where-Object { -not $_.is_read }
    $read = $allNotifications | Where-Object { $_.is_read }
    
    Write-Host "   📊 Resumen:" -ForegroundColor White
    Write-Host "      No leídas: $($unread.Count)" -ForegroundColor Yellow
    Write-Host "      Leídas: $($read.Count)" -ForegroundColor Green
    Write-Host ""
    
    # Mostrar todas
    foreach ($notification in $allNotifications) {
        Show-Notification -notification $notification
    }
}

Write-Host "`n📈 ESTADÍSTICAS POR TIPO" -ForegroundColor Yellow
Write-Host "========================`n" -ForegroundColor Yellow

$typeGroups = $allNotifications | Group-Object -Property type

foreach ($group in $typeGroups) {
    $icon = switch ($group.Name) {
        "new_user" { "👤" }
        "payment_processed" { "💰" }
        "new_course" { "📚" }
        "new_enrollment" { "📝" }
        "contact_message" { "📧" }
        "new_mentorship_booking" { "🎯" }
        default { "🔔" }
    }
    
    Write-Host "   $icon $($group.Name): $($group.Count)" -ForegroundColor Cyan
}

Write-Host "`n✅ Verificación completada!" -ForegroundColor Green
Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Crea un nuevo usuario para ver una notificación nueva" -ForegroundColor Gray
Write-Host "   - Las notificaciones se actualizan cada 10 segundos en el frontend" -ForegroundColor Gray
Write-Host "   - Abre el dropdown de notificaciones para ver actualizaciones inmediatas" -ForegroundColor Gray
Write-Host ""
