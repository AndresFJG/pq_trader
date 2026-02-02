# ====================================
# Script de Deployment Automático para Windows
# ====================================
# Ejecutar con: .\deploy.ps1

Write-Host "🚀 Iniciando deployment de PQ Trader..." -ForegroundColor Green

# ====================================
# 1. PRE-FLIGHT CHECKS
# ====================================
Write-Host "`n📋 Verificando requisitos..." -ForegroundColor Yellow

# Check Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no está instalado" -ForegroundColor Red
    exit 1
}

# Check Node
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Check Railway CLI
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Railway CLI no está instalado" -ForegroundColor Yellow
    Write-Host "Instalando Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

Write-Host "✅ Requisitos verificados" -ForegroundColor Green

# ====================================
# 2. TESTS
# ====================================
Write-Host "`n🧪 Ejecutando tests..." -ForegroundColor Yellow

Push-Location backend
$backendTestResult = npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend tests passed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend tests failed. Abortando deployment." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Push-Location frontend
$frontendTestResult = npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend tests passed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend tests failed. Abortando deployment." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# ====================================
# 3. BUILD
# ====================================
Write-Host "`n🔨 Building aplicación..." -ForegroundColor Yellow

# Backend
Push-Location backend
$backendBuildResult = npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend build exitoso" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build falló" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Frontend
Push-Location frontend
$frontendBuildResult = npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build exitoso" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build falló" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# ====================================
# 4. GIT COMMIT
# ====================================
Write-Host "`n📦 Committing cambios..." -ForegroundColor Yellow

git add .
$commitMessage = Read-Host "Mensaje de commit"
git commit -m "$commitMessage"
git push origin main

Write-Host "✅ Cambios commiteados" -ForegroundColor Green

# ====================================
# 5. DEPLOY BACKEND (Railway)
# ====================================
Write-Host "`n🚂 Deploying backend a Railway..." -ForegroundColor Yellow

Push-Location backend
railway login

# Deploy
$railwayDeployResult = railway up
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend deployado" -ForegroundColor Green
    
    # Obtener URL
    $backendUrl = railway domain
    Write-Host "Backend URL: $backendUrl" -ForegroundColor Green
} else {
    Write-Host "❌ Backend deployment falló" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# ====================================
# 6. UPDATE FRONTEND ENV
# ====================================
Write-Host "`n⚙️  Actualizando variables de frontend..." -ForegroundColor Yellow

Write-Host "Ahora debes actualizar en Vercel:" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_API_URL=https://$backendUrl/api" -ForegroundColor Cyan
Write-Host ""
Read-Host "Presiona Enter cuando hayas actualizado las variables en Vercel"

# ====================================
# 7. DEPLOY FRONTEND (Vercel via Git)
# ====================================
Write-Host "`n🌐 Triggering Vercel deployment..." -ForegroundColor Yellow
Write-Host "Vercel auto-deployará desde el último commit de Git" -ForegroundColor Cyan
Write-Host "✅ Frontend deployment iniciado" -ForegroundColor Green

# ====================================
# 8. VERIFICACIÓN
# ====================================
Write-Host "`n🔍 Verificación post-deployment..." -ForegroundColor Yellow

Write-Host "Verificando backend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "https://$backendUrl/api/health" -Method Get
    if ($response) {
        Write-Host "✅ Backend responde correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend health check falló" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETADO" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Cyan
Write-Host "  Backend: https://$backendUrl" -ForegroundColor White
Write-Host "  Frontend: Verifica en Vercel dashboard" -ForegroundColor White
Write-Host ""
Write-Host "📊 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Verificar que el frontend cargue correctamente" -ForegroundColor White
Write-Host "  2. Probar login/registro" -ForegroundColor White
Write-Host "  3. Probar pagos en modo TEST" -ForegroundColor White
Write-Host "  4. Monitorear logs: railway logs" -ForegroundColor White
Write-Host "  5. Cuando estés listo, cambiar a keys LIVE" -ForegroundColor White
Write-Host ""
Write-Host "🎉 ¡Felicidades!" -ForegroundColor Green
