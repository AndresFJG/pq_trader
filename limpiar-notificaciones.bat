@echo off
echo ========================================
echo Limpiando notificaciones de prueba...
echo ========================================
echo.
echo Por favor, proporciona tu token de admin.
echo (Lo puedes encontrar en DevTools > Application > Local Storage > token)
echo.
set /p TOKEN="Pega tu token aqui: "
echo.
echo Eliminando notificaciones...
echo.

curl -X DELETE "http://localhost:5000/api/notifications/clear-all" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Proceso completado!
echo ========================================
echo.
echo Ahora refresca tu dashboard (F5)
echo.
pause
