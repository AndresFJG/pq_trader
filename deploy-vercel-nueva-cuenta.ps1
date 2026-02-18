# Script para cambiar cuenta de Vercel y deployar PQ Trader
# Ejecutar con: .\deploy-vercel-nueva-cuenta.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cambiar Cuenta de Vercel - PQ Trader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Cerrar sesión actual
Write-Host "1. Cerrando sesión de cuenta actual..." -ForegroundColor Yellow
Write-Host ""
npx vercel logout
Write-Host ""

# Paso 2: Iniciar sesión con nueva cuenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Iniciar sesión con nueva cuenta" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se abrira tu navegador para iniciar sesion." -ForegroundColor Yellow
Write-Host "Elige tu metodo preferido (GitHub recomendado)" -ForegroundColor Yellow
Write-Host ""
pause
npx vercel login
Write-Host ""

# Verificar que se haya logueado correctamente
Write-Host "Verificando sesion..." -ForegroundColor Yellow
$whoami = npx vercel whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Sesion iniciada correctamente" -ForegroundColor Green
    Write-Host "Usuario: $whoami" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "[ERROR] No se pudo iniciar sesion" -ForegroundColor Red
    Write-Host "Ejecuta manualmente: npx vercel login" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# Paso 3: Limpiar configuración anterior
Write-Host "3. Limpiando configuracion anterior..." -ForegroundColor Yellow
Set-Location "C:\Users\USER\Desktop\pq_trader\frontend"
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue
Write-Host "[OK] Configuracion anterior eliminada" -ForegroundColor Green
Write-Host ""

# Paso 4: Desplegar proyecto
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "4. Desplegando a Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vercel te hara algunas preguntas:" -ForegroundColor Yellow
Write-Host "- Set up and deploy? → Y" -ForegroundColor White
Write-Host "- Which scope? → Selecciona tu cuenta" -ForegroundColor White
Write-Host "- Link to existing project? → N (crear nuevo)" -ForegroundColor White
Write-Host "- What's your project's name? → pq-trader" -ForegroundColor White
Write-Host "- In which directory is your code located? → ./ (presiona Enter)" -ForegroundColor White
Write-Host ""
pause

npx vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "[OK] Deploy exitoso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANTE: Configura las variables de entorno" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ve a: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host "1. Selecciona tu proyecto 'pq-trader'" -ForegroundColor White
    Write-Host "2. Settings → Environment Variables" -ForegroundColor White
    Write-Host "3. Agrega estas variables:" -ForegroundColor White
    Write-Host ""
    Write-Host "   NEXT_PUBLIC_API_URL" -ForegroundColor Yellow
    Write-Host "   Value: https://pqtrader-backend.up.railway.app/api" -ForegroundColor White
    Write-Host ""
    Write-Host "   NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow
    Write-Host "   Value: https://nmkmhtfdpoutcvizoxrr.supabase.co" -ForegroundColor White
    Write-Host ""
    Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Yellow
    Write-Host "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor White
    Write-Host ""
    Write-Host "4. Guarda y espera a que se redespliegue automaticamente" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "[ERROR] Deploy fallido" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Intenta manualmente:" -ForegroundColor Yellow
    Write-Host "cd frontend" -ForegroundColor White
    Write-Host "npx vercel --prod" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Comandos utiles:" -ForegroundColor Cyan
Write-Host "- Ver quien esta logueado: npx vercel whoami" -ForegroundColor White
Write-Host "- Ver proyectos: npx vercel list" -ForegroundColor White
Write-Host "- Ver logs: npx vercel logs" -ForegroundColor White
Write-Host ""

pause
