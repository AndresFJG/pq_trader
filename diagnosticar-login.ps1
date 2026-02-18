# Script para diagnosticar problemas de login
# Ejecutar con: .\diagnosticar-login.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnostico de Problemas de Login" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que el backend este corriendo
Write-Host "1. Verificando backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -ErrorAction Stop
    Write-Host "   [OK] Backend corriendo en puerto 4000" -ForegroundColor Green
    Write-Host "   Database: Connected" -ForegroundColor White
} catch {
    Write-Host "   [ERROR] Backend NO esta corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend && npm run dev" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host ""

# 2. Probar login con credenciales
Write-Host "2. Probando endpoint de login" -ForegroundColor Yellow
Write-Host "   Ingresa las credenciales del usuario que deseas probar:" -ForegroundColor Gray
Write-Host ""
$email = Read-Host "   Email"
$password = Read-Host "   Password" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "   Intentando login..." -ForegroundColor Yellow

try {
    $body = @{
        email = $email
        password = $plainPassword
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host ""
    Write-Host "   [OK] Login exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Usuario:" -ForegroundColor Cyan
    Write-Host "   - ID: $($response.data.user.id)" -ForegroundColor White
    Write-Host "   - Nombre: $($response.data.user.name)" -ForegroundColor White
    Write-Host "   - Email: $($response.data.user.email)" -ForegroundColor White
    Write-Host "   - Rol: $($response.data.user.role)" -ForegroundColor White
    Write-Host ""
    Write-Host "   Token generado: $($response.data.token.Substring(0, 20))..." -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "   [ERROR] Login fallido" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
        
        Write-Host "   Codigo de error: $statusCode" -ForegroundColor Yellow
        Write-Host "   Mensaje: $($errorBody.error)" -ForegroundColor Yellow
        Write-Host ""
        
        if ($statusCode -eq 401) {
            Write-Host "   POSIBLES CAUSAS:" -ForegroundColor Cyan
            Write-Host "   1. Email incorrecto (verifica que exista en la BD)" -ForegroundColor White
            Write-Host "   2. Contrasena incorrecta" -ForegroundColor White
            Write-Host "   3. Usuario no existe en Supabase" -ForegroundColor White
            Write-Host ""
            Write-Host "   VERIFICACION:" -ForegroundColor Cyan
            Write-Host "   - Abre Supabase Dashboard" -ForegroundColor White
            Write-Host "   - Ve a Table Editor > users" -ForegroundColor White
            Write-Host "   - Busca el email: $email" -ForegroundColor White
            Write-Host "   - Verifica que la contrasena este hasheada (bcrypt)" -ForegroundColor White
        }
    } else {
        Write-Host "   Error de conexion: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Verifica que el backend este corriendo" -ForegroundColor Yellow
    }
}

Write-Host ""

# 3. Verificar frontend
Write-Host "3. Verificando frontend..." -ForegroundColor Yellow
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
    Write-Host "   [OK] Frontend corriendo en puerto 3000" -ForegroundColor Green
} catch {
    Write-Host "   [ALERTA] Frontend NO esta corriendo" -ForegroundColor Yellow
    Write-Host "   Ejecuta: cd frontend && npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# 4. Verificar configuracion de API
Write-Host "4. Verificando configuracion..." -ForegroundColor Yellow
$envFile = "C:\Users\USER\Desktop\pq_trader\frontend\.env.local"
if (Test-Path $envFile) {
    $apiUrl = Select-String -Path $envFile -Pattern "NEXT_PUBLIC_API_URL" | Select-Object -First 1
    if ($apiUrl) {
        Write-Host "   [OK] .env.local configurado" -ForegroundColor Green
        Write-Host "   $apiUrl" -ForegroundColor White
        
        if ($apiUrl -notmatch "http://localhost:4000/api") {
            Write-Host ""
            Write-Host "   [ALERTA] API_URL podria ser incorrecta" -ForegroundColor Yellow
            Write-Host "   Deberia ser: NEXT_PUBLIC_API_URL=http://localhost:4000/api" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   [ERROR] NEXT_PUBLIC_API_URL no encontrada en .env.local" -ForegroundColor Red
    }
} else {
    Write-Host "   [ERROR] Archivo .env.local no encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnostico completado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "SIGUIENTES PASOS:" -ForegroundColor Green
Write-Host ""
Write-Host "Si el login funciono desde PowerShell pero no desde el navegador:" -ForegroundColor Yellow
Write-Host "1. Abre DevTools (F12) > Console" -ForegroundColor White
Write-Host "2. Intenta hacer login en http://localhost:3000/login" -ForegroundColor White
Write-Host "3. Busca errores en la consola" -ForegroundColor White
Write-Host "4. Ve a la pestana Network y verifica la peticion POST /api/auth/login" -ForegroundColor White
Write-Host "5. Revisa el Status Code y el Response" -ForegroundColor White
Write-Host ""
Write-Host "Si hay error CORS:" -ForegroundColor Yellow
Write-Host "- Verifica backend/src/index.ts (corsOptions)" -ForegroundColor White
Write-Host "- Debe incluir 'http://localhost:3000' en allowedOrigins" -ForegroundColor White
Write-Host ""
Write-Host "Si hay error de cookies:" -ForegroundColor Yellow
Write-Host "- En produccion: sameSite debe ser 'none' y secure: true" -ForegroundColor White
Write-Host "- En desarrollo: sameSite debe ser 'lax' y secure: false" -ForegroundColor White
Write-Host ""

pause
