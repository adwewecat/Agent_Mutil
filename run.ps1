# PowerShell script khoi dong Agent Multi (Backend + Frontend)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "     HE THONG AGENT MULTI (AGENT PIXELS - BO TU 4 DUNG CHIEN LUOC)           " -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Kiem tra moi truong
Write-Host "[1/3] Kiem tra moi truong..." -ForegroundColor Yellow
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[LOI] Khong tim thay Python! Vui long cai dat Python 3.10+ va them vao PATH." -ForegroundColor Red
    pause
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[LOI] Khong tim thay Node.js / npm! Vui long cai dat Node.js va them vao PATH." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "  - Python: OK" -ForegroundColor Green
Write-Host "  - Node / npm: OK" -ForegroundColor Green
Write-Host ""

# 2. Khoi dong Backend
Write-Host "[2/3] Dang khoi dong Backend FastAPI tai cong 8000..." -ForegroundColor Yellow
$backendCmd = "cd `"$rootDir\backend`"; if (Test-Path 'venv\Scripts\Activate.ps1') { . .\venv\Scripts\Activate.ps1 }; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "$backendCmd"

Start-Sleep -Seconds 2

# 3. Khoi dong Frontend
Write-Host "[3/3] Dang khoi dong Frontend Vite tai cong 5173..." -ForegroundColor Yellow
$frontendCmd = "cd `"$rootDir\frontend`"; npm.cmd run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "$frontendCmd"

Start-Sleep -Seconds 3

# Mo trinh duyet
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "HE THONG DA SAN SANG!" -ForegroundColor Green
Write-Host "  - Frontend App   : http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API    : http://localhost:8000" -ForegroundColor White
Write-Host "  - API Docs       : http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Cyan
