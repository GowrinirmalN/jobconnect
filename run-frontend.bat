@echo off
title JobConnect - Frontend Server
echo ========================================================
echo  JobConnect - Starting React Frontend (Port 5173)
echo ========================================================
cd /d "%~dp0frontend"
npm run dev
pause

