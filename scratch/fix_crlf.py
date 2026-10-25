# Script fix CRLF line endings for Windows batch files
run_content = """@echo off
chcp 65001 > nul
title [Agent Multi] Khoi Dong He Thong (Backend + Frontend)
color 0b

echo ===============================================================================
echo      HE THONG AGENT MULTI (AGENT PIXELS - BO TU 4 DUNG CHIEN LUOC)
echo ===============================================================================
echo.
echo  [1/3] Kiem tra moi truong he thong...

python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0c
    echo [LOI] Khong tim thay Python! Vui long cai dat Python 3.10+ va them vao PATH.
    pause
    exit /b 1
)

call npm --version >nul 2>&1
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
start "[Agent Multi] Backend Server" cmd /k "chcp 65001 > nul && title [Agent Multi] Backend Server (:8000) && cd /d "%~dp0backend" && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak > nul

echo  [3/3] Dang khoi dong Frontend Vite tai cong 5173...
start "[Agent Multi] Frontend Server" cmd /k "chcp 65001 > nul && title [Agent Multi] Frontend Server (:5173) && cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo ===============================================================================
echo  DANG MO TRINH DUYET VAO VAN PHONG AO...
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
echo  (De tat ca Backend va Frontend, hay chay file stop.bat)
echo ===============================================================================
echo.
pause
"""

stop_content = """@echo off
chcp 65001 > nul
title [Agent Multi] Dung He Thong
color 0e

echo ===============================================================================
echo                DUNG HE THONG AGENT MULTI (CONG 8000 & 5173)
echo ===============================================================================
echo.

echo Dang giai phong cong 8000 (Backend FastAPI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo Dang giai phong cong 5173 (Frontend Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

color 0a
echo.
echo Da dung toan bo tien trinh Backend va Frontend thanh cong!
echo.
pause
"""

with open('run.bat', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(run_content)

with open('stop.bat', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(stop_content)

print("SUCCESS: run.bat and stop.bat written with strict CRLF line endings!")
