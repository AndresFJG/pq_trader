# Probar login directo con PowerShell
$body = @{
    email = "grupoetercapital@gmail.com"
    password = "Password123!"
} | ConvertTo-Json

Write-Host "Probando login con grupoetercapital@gmail.com..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "[OK] Login exitoso!" -ForegroundColor Green
    Write-Host "Usuario: $($response.data.user.name)" -ForegroundColor White
    Write-Host "Email: $($response.data.user.email)" -ForegroundColor White
    Write-Host "Rol: $($response.data.user.role)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] Login fallido" -ForegroundColor Red
    Write-Host ""
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
        Write-Host "Error: $($errorBody.error)" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Probando con amador@pqtradera.com..." -ForegroundColor Yellow
Write-Host ""

$body2 = @{
    email = "amador@pqtradera.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body2 -ContentType "application/json"
    Write-Host "[OK] Login exitoso!" -ForegroundColor Green
    Write-Host "Usuario: $($response2.data.user.name)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] Login fallido" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
        Write-Host "Error: $($errorBody.error)" -ForegroundColor Yellow
    }
}
