@echo off
title JobConnect - Backend Server
echo ========================================================
echo  JobConnect - Starting Spring Boot Backend (Port 8080)
echo ========================================================
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
cd /d "%~dp0backend"
"C:\Program Files\Apache NetBeans\java\maven\bin\mvn.cmd" spring-boot:run
pause

