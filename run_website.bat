@echo off
title Book Haven - Online Bookstore
color 0A
echo ========================================================
echo        Starting Book Haven Website for Presentation
echo ========================================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo [1/2] First time setup: Installing packages... Please wait a moment.
    call npm install
)

echo.
echo [2/2] Launching Book Haven website server...
echo.
echo The website will automatically open in your browser at:
echo http://localhost:5173
echo.
echo (Keep this black window OPEN while demonstrating to your professor)
echo.

start http://localhost:5173
call npm run dev

pause
