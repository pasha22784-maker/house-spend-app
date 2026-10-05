@echo off
title House Spend App - Expo Server
echo ========================================================
echo       House Spend Mobile App - Launcher
echo ========================================================
echo.
echo Starting Expo Server...
echo.
cd /d "%~dp0"
call npx expo start
pause
