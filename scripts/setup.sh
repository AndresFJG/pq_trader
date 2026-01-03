#!/bin/bash

echo "🚀 Setup PQ Trader Project"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 20 o superior."
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi

echo "✅ npm $(npm -v) detectado"

# Frontend setup
echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
cp .env.example .env.local
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi

# Backend setup
echo ""
echo "📦 Instalando dependencias del backend..."
cd ../backend
cp .env.example .env
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup completado!"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Configurar MongoDB:"
echo "   - Instala MongoDB localmente o usa MongoDB Atlas"
echo "   - Actualiza MONGODB_URI en backend/.env"
echo ""
echo "2. Configurar variables de entorno:"
echo "   - Frontend: edita frontend/.env.local"
echo "   - Backend: edita backend/.env"
echo ""
echo "3. Iniciar la aplicación:"
echo "   Terminal 1 - Backend:"
echo "   $ cd backend && npm run dev"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   $ cd frontend && npm run dev"
echo ""
echo "4. Abrir en el navegador:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo ""
echo "📚 Más información en README.md"
