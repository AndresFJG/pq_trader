# ========================================
# Pre-Deploy Checklist Verification (PowerShell)
# ========================================

Write-Host "`n🔍 Verificando proyecto antes del deploy...`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

function Check-File {
    param($path)
    if (Test-Path $path) {
        Write-Host "✅ $path" -ForegroundColor Green
    } else {
        Write-Host "❌ FALTA: $path" -ForegroundColor Red
        $script:errors++
    }
}

function Check-Dir {
    param($path)
    if (Test-Path $path -PathType Container) {
        Write-Host "✅ $path/" -ForegroundColor Green
    } else {
        Write-Host "❌ FALTA: $path/" -ForegroundColor Red
        $script:errors++
    }
}

function Warn {
    param($message)
    Write-Host "⚠️  $message" -ForegroundColor Yellow
    $script:warnings++
}

# ====================================
# 1. VERIFICAR ESTRUCTURA
# ====================================
Write-Host "📁 Verificando estructura de directorios..." -ForegroundColor Yellow
Check-Dir "backend\src"
Check-Dir "backend\src\controllers"
Check-Dir "backend\src\routes"
Check-Dir "backend\src\services"
Check-Dir "backend\src\middleware"
Check-Dir "frontend\src"
Check-Dir "frontend\src\app"
Check-Dir "frontend\src\components"
Write-Host ""

# ====================================
# 2. VERIFICAR ARCHIVOS CRÍTICOS
# ====================================
Write-Host "📄 Verificando archivos de configuración..." -ForegroundColor Yellow
Check-File "backend\package.json"
Check-File "backend\tsconfig.json"
Check-File "backend\.env.example"
Check-File "backend\railway.toml"
Check-File "frontend\package.json"
Check-File "frontend\tsconfig.json"
Check-File "frontend\.env.example"
Check-File "frontend\vercel.json"
Check-File "DEPLOYMENT.md"
Check-File "README.md"
Check-File ".gitignore"
Write-Host ""

# ====================================
# 3. VERIFICAR QUE NO HAYA SECRETS
# ====================================
Write-Host "🔐 Verificando que no haya archivos con secrets..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Warn "backend\.env existe (OK en local, NO commitear)"
}

if (Test-Path "backend\.env.production") {
    Write-Host "❌ backend\.env.production NO DEBE ESTAR EN GIT!" -ForegroundColor Red
    $errors++
}

if (Test-Path "frontend\.env.production") {
    Write-Host "❌ frontend\.env.production NO DEBE ESTAR EN GIT!" -ForegroundColor Red
    $errors++
}

if (-not (Test-Path "backend\.env")) {
    Warn "backend\.env no existe (copiar desde .env.example)"
}
Write-Host ""

# ====================================
# 4. VERIFICAR BUILD BACKEND
# ====================================
Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
Push-Location backend
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend compila sin errores" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend tiene errores de compilación" -ForegroundColor Red
        $errors++
    }
} catch {
    Write-Host "❌ Error al compilar backend" -ForegroundColor Red
    $errors++
}
Pop-Location
Write-Host ""

# ====================================
# 5. VERIFICAR DEPENDENCIES
# ====================================
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

if (-not (Test-Path "backend\node_modules")) {
    Warn "Backend: node_modules no instalado (ejecutar 'npm install')"
}

if (-not (Test-Path "frontend\node_modules")) {
    Warn "Frontend: node_modules no instalado (ejecutar 'npm install')"
}
Write-Host ""

# ====================================
# 6. VERIFICAR GIT
# ====================================
Write-Host "📝 Verificando git..." -ForegroundColor Yellow

if (-not (Test-Path ".git")) {
    Write-Host "❌ No es un repositorio git" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Repositorio git inicializado" -ForegroundColor Green
    
    # Check remote
    $remotes = git remote -v 2>$null
    if ($remotes) {
        Write-Host "✅ Remote configurado" -ForegroundColor Green
    } else {
        Warn "No hay remote configurado"
    }
    
    # Check uncommitted changes
    $status = git status --porcelain 2>$null
    if ($status) {
        Warn "Hay cambios sin commitear"
    } else {
        Write-Host "✅ No hay cambios pendientes" -ForegroundColor Green
    }
}
Write-Host ""

# ====================================
# 7. VERIFICAR ARCHIVOS INNECESARIOS
# ====================================
Write-Host "🧹 Verificando archivos que NO deben estar..." -ForegroundColor Yellow

$forbiddenFiles = @(
    "backend\logs",
    "backend\dist",
    "frontend\.next",
    "frontend\out",
    ".env.production",
    "ACCION_INMEDIATA.md",
    "PAYPAL_CREDENCIALES.md"
)

foreach ($file in $forbiddenFiles) {
    if (Test-Path $file) {
        Warn "Archivo/directorio innecesario: $file"
    }
}
Write-Host ""

# ====================================
# RESUMEN
# ====================================
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ TODO CORRECTO - LISTO PARA DEPLOY" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:"
    Write-Host "1. git add ."
    Write-Host "2. git commit -m 'chore: prepare for production'"
    Write-Host "3. git push"
    Write-Host "4. Seguir DEPLOYMENT.md para deploy en Railway y Vercel"
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "⚠️  HAY $warnings ADVERTENCIAS (puedes continuar)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Revisa las advertencias arriba y decide si continuar."
    exit 0
} else {
    Write-Host "❌ HAY $errors ERRORES CRÍTICOS" -ForegroundColor Red
    Write-Host "⚠️  $warnings advertencias" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "DEBES CORREGIR LOS ERRORES ANTES DE DEPLOY" -ForegroundColor Red
    exit 1
}
