#!/bin/bash

# ==============================================
# Pre-Deploy Checklist Verification Script
# ==============================================

echo "🔍 Verificando proyecto antes del deploy..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
    else
        echo -e "${RED}❌${NC} FALTA: $1"
        ((ERRORS++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
    else
        echo -e "${RED}❌${NC} FALTA: $1/"
        ((ERRORS++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠️${NC}  $1"
    ((WARNINGS++))
}

# ====================================
# 1. VERIFICAR ESTRUCTURA
# ====================================
echo "📁 Verificando estructura de directorios..."
check_dir "backend/src"
check_dir "backend/src/controllers"
check_dir "backend/src/routes"
check_dir "backend/src/services"
check_dir "backend/src/middleware"
check_dir "frontend/src"
check_dir "frontend/src/app"
check_dir "frontend/src/components"
echo ""

# ====================================
# 2. VERIFICAR ARCHIVOS CRÍTICOS
# ====================================
echo "📄 Verificando archivos de configuración..."
check_file "backend/package.json"
check_file "backend/tsconfig.json"
check_file "backend/.env.example"
check_file "backend/railway.toml"
check_file "frontend/package.json"
check_file "frontend/tsconfig.json"
check_file "frontend/.env.example"
check_file "frontend/vercel.json"
check_file "DEPLOYMENT.md"
check_file "README.md"
check_file ".gitignore"
echo ""

# ====================================
# 3. VERIFICAR QUE NO HAYA SECRETS
# ====================================
echo "🔐 Verificando que no haya archivos con secrets..."
if [ -f "backend/.env" ]; then
    warn "backend/.env existe (OK en local, NO commitear)"
fi

if [ -f "backend/.env.production" ]; then
    echo -e "${RED}❌${NC} backend/.env.production NO DEBE ESTAR EN GIT!"
    ((ERRORS++))
fi

if [ -f "frontend/.env.production" ]; then
    echo -e "${RED}❌${NC} frontend/.env.production NO DEBE ESTAR EN GIT!"
    ((ERRORS++))
fi

if [ ! -f "backend/.env" ]; then
    warn "backend/.env no existe (copiar desde .env.example para desarrollo local)"
fi
echo ""

# ====================================
# 4. VERIFICAR BUILD BACKEND
# ====================================
echo "🔨 Compilando backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Backend compila sin errores"
else
    echo -e "${RED}❌${NC} Backend tiene errores de compilación"
    ((ERRORS++))
fi
cd ..
echo ""

# ====================================
# 5. VERIFICAR DEPENDENCIES
# ====================================
echo "📦 Verificando dependencias..."

cd backend
if [ ! -d "node_modules" ]; then
    warn "Backend: node_modules no instalado (ejecutar 'npm install')"
fi
cd ..

cd frontend
if [ ! -d "node_modules" ]; then
    warn "Frontend: node_modules no instalado (ejecutar 'npm install')"
fi
cd ..
echo ""

# ====================================
# 6. VERIFICAR GIT
# ====================================
echo "📝 Verificando git..."

# Check if git repo
if [ ! -d ".git" ]; then
    echo -e "${RED}❌${NC} No es un repositorio git"
    ((ERRORS++))
else
    echo -e "${GREEN}✅${NC} Repositorio git inicializado"
    
    # Check remote
    if git remote -v > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Remote configurado"
    else
        warn "No hay remote configurado (ejecutar 'git remote add origin [URL]')"
    fi
    
    # Check uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        warn "Hay cambios sin commitear"
    else
        echo -e "${GREEN}✅${NC} No hay cambios pendientes"
    fi
fi
echo ""

# ====================================
# 7. VERIFICAR ARCHIVOS INNECESARIOS
# ====================================
echo "🧹 Verificando archivos que NO deben estar..."

FORBIDDEN_FILES=(
    "backend/logs"
    "backend/dist"
    "frontend/.next"
    "frontend/out"
    ".env.production"
    "ACCION_INMEDIATA.md"
    "PAYPAL_CREDENCIALES.md"
)

for file in "${FORBIDDEN_FILES[@]}"; do
    if [ -e "$file" ]; then
        warn "Archivo/directorio innecesario: $file (puede eliminarse)"
    fi
done
echo ""

# ====================================
# RESUMEN
# ====================================
echo "======================================"
echo "RESUMEN DE VERIFICACIÓN"
echo "======================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ TODO CORRECTO - LISTO PARA DEPLOY${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. git add ."
    echo "2. git commit -m 'chore: prepare for production'"
    echo "3. git push"
    echo "4. Seguir DEPLOYMENT.md para deploy en Railway y Vercel"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  HAY ${WARNINGS} ADVERTENCIAS (puedes continuar)${NC}"
    echo ""
    echo "Revisa las advertencias arriba y decide si continuar."
    exit 0
else
    echo -e "${RED}❌ HAY ${ERRORS} ERRORES CRÍTICOS${NC}"
    echo -e "${YELLOW}⚠️  ${WARNINGS} advertencias${NC}"
    echo ""
    echo "DEBES CORREGIR LOS ERRORES ANTES DE DEPLOY"
    exit 1
fi
