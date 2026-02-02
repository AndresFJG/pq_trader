#!/bin/bash

# ====================================
# Script de Deployment Automático
# ====================================

echo "🚀 Iniciando deployment de PQ Trader..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ====================================
# 1. PRE-FLIGHT CHECKS
# ====================================
echo -e "${YELLOW}📋 Verificando requisitos...${NC}"

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git no está instalado${NC}"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI no está instalado${NC}"
    echo "Instalando Railway CLI..."
    npm install -g @railway/cli
fi

echo -e "${GREEN}✅ Requisitos verificados${NC}\n"

# ====================================
# 2. TESTS
# ====================================
echo -e "${YELLOW}🧪 Ejecutando tests...${NC}"

cd backend
if npm test; then
    echo -e "${GREEN}✅ Backend tests passed${NC}"
else
    echo -e "${RED}❌ Backend tests failed. Abortando deployment.${NC}"
    exit 1
fi

cd ../frontend
if npm test; then
    echo -e "${GREEN}✅ Frontend tests passed${NC}"
else
    echo -e "${RED}❌ Frontend tests failed. Abortando deployment.${NC}"
    exit 1
fi

cd ..
echo ""

# ====================================
# 3. BUILD
# ====================================
echo -e "${YELLOW}🔨 Building aplicación...${NC}"

# Backend
cd backend
if npm run build; then
    echo -e "${GREEN}✅ Backend build exitoso${NC}"
else
    echo -e "${RED}❌ Backend build falló${NC}"
    exit 1
fi

# Frontend
cd ../frontend
if npm run build; then
    echo -e "${GREEN}✅ Frontend build exitoso${NC}"
else
    echo -e "${RED}❌ Frontend build falló${NC}"
    exit 1
fi

cd ..
echo ""

# ====================================
# 4. GIT COMMIT
# ====================================
echo -e "${YELLOW}📦 Committing cambios...${NC}"

git add .
read -p "Mensaje de commit: " COMMIT_MESSAGE
git commit -m "$COMMIT_MESSAGE"
git push origin main

echo -e "${GREEN}✅ Cambios commiteados${NC}\n"

# ====================================
# 5. DEPLOY BACKEND (Railway)
# ====================================
echo -e "${YELLOW}🚂 Deploying backend a Railway...${NC}"

cd backend
railway login

# Deploy
if railway up; then
    echo -e "${GREEN}✅ Backend deployado${NC}"
    
    # Obtener URL
    BACKEND_URL=$(railway domain)
    echo -e "${GREEN}Backend URL: ${BACKEND_URL}${NC}"
else
    echo -e "${RED}❌ Backend deployment falló${NC}"
    exit 1
fi

cd ..
echo ""

# ====================================
# 6. UPDATE FRONTEND ENV
# ====================================
echo -e "${YELLOW}⚙️  Actualizando variables de frontend...${NC}"

echo "Ahora debes actualizar en Vercel:"
echo "NEXT_PUBLIC_API_URL=https://${BACKEND_URL}/api"
echo ""
read -p "Presiona Enter cuando hayas actualizado las variables en Vercel..."

# ====================================
# 7. DEPLOY FRONTEND (Vercel via Git)
# ====================================
echo -e "${YELLOW}🌐 Triggering Vercel deployment...${NC}"
echo "Vercel auto-deployará desde el último commit de Git"
echo -e "${GREEN}✅ Frontend deployment iniciado${NC}\n"

# ====================================
# 8. VERIFICACIÓN
# ====================================
echo -e "${YELLOW}🔍 Verificación post-deployment...${NC}"

echo "Verificando backend..."
if curl -s "${BACKEND_URL}/api/health" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend responde correctamente${NC}"
else
    echo -e "${RED}⚠️  Backend health check falló${NC}"
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "🔗 URLs:"
echo "  Backend: https://${BACKEND_URL}"
echo "  Frontend: Verifica en Vercel dashboard"
echo ""
echo "📊 Próximos pasos:"
echo "  1. Verificar que el frontend cargue correctamente"
echo "  2. Probar login/registro"
echo "  3. Probar pagos en modo TEST"
echo "  4. Monitorear logs: railway logs"
echo "  5. Cuando estés listo, cambiar a keys LIVE"
echo ""
echo -e "${GREEN}🎉 ¡Felicidades!${NC}"
