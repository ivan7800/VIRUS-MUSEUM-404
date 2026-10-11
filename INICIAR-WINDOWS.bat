@echo off
setlocal
cd /d "%~dp0"
if not exist "servidor.py" (
  echo ERROR: Falta servidor.py. Extrae el ZIP completo antes de arrancar.
  pause
  exit /b 1
)
where py >nul 2>&1
if not errorlevel 1 (
  py -3 "%~dp0servidor.py"
  if errorlevel 1 pause
  exit /b %errorlevel%
)
where python >nul 2>&1
if not errorlevel 1 (
  python "%~dp0servidor.py"
  if errorlevel 1 pause
  exit /b %errorlevel%
)
echo ERROR: Python 3 no disponible. Instalalo desde python.org.
pause
exit /b 1
