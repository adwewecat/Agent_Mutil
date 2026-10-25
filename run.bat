@echo off
chcp 65001 > nul
title [Agent Multi] Khoi Dong He Thong 4 Dung (Backend + Frontend)
color 0b

echo ===============================================================================
echo      HE THONG AGENT MULTI (AGENT PIXELS - BO TU 4 DUNG CHIEN LUOC)
echo ===============================================================================
echo.
echo  [1/3] Kiem tra moi truong he thong...

where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0c
    echo [LOI] Khong tim thay Python! Vui long cai dat Python 3.10+ va them vao PATH.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0c
    echo [LOI] Khong tim thay Node.js / npm! Vui long cai dat Node.js va them vao PATH.
    pause
    exit /b 1
)

echo   - Python: OK
echo   - Node / npm: OK
echo.

echo  [2/3] Dang khoi dong Backend FastAPI tai cong 8000...
start "[Agent Multi] Backend Server (:8000)" cmd /k "chcp 65001 > nul && title [Agent Multi] Backend Server && cd /d "%~dp0backend" && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak > nul

echo  [3/3] Dang khoi dong Frontend Vite tai cong 5173...
start "[Agent Multi] Frontend Server (:5173)" cmd /k "chcp 65001 > nul && title [Agent Multi] Frontend Server && cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo ===============================================================================
echo  DANG MO TRINH DUYET VAO VĂN PHONG AO...
echo ===============================================================================
echo.
timeout /t 3 /nobreak > nul
start http://localhost:5173

color 0a
echo  HE THONG DA SAN SANG!
echo.
echo  - Frontend App   : http://localhost:5173
echo  - Backend API    : http://localhost:8000
echo  - API Docs       : http://localhost:8000/docs
echo.
echo  (Dong cua so nay se khong tat Backend/Frontend. De tat ca 2, hay chay stop.bat)
echo ===============================================================================
echo.
pause
