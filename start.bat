@echo off
title Apex Content OS - Server Launcher
color 0A

echo.
echo  ==========================================
echo   APEX CONTENT OS v7.0 - Starting Servers
echo  ==========================================
echo.

REM ── Start FastAPI Backend ──────────────────────────────────────────
echo  [1/2] Starting Backend (FastAPI on port 8000)...
start "Apex Backend" cmd /k "cd /d "%~dp0backend" && echo [BACKEND] Activating environment... && (if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat)) && echo [BACKEND] Launching uvicorn... && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM ── Wait a moment before launching frontend ────────────────────────
timeout /t 3 /nobreak > nul

REM ── Start Next.js Frontend ─────────────────────────────────────────
echo  [2/2] Starting Frontend (Next.js on port 3000)...
start "Apex Frontend" cmd /k "cd /d "%~dp0frontend" && echo [FRONTEND] Installing deps check... && npm run dev"

echo.
echo  ==========================================
echo   Both servers are launching!
echo   Backend  -> http://localhost:8000
echo   Frontend -> http://localhost:3000
echo   API Docs -> http://localhost:8000/docs
echo  ==========================================
echo.
echo  Close the individual server windows to stop them.
echo.
pause
