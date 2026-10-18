@echo off
title Muzac - High Fidelity Lossless Music Player
cd /d "d:\Home Theater\Muzac"

:: Check if server is already running on port 5173
curl.exe -s -o nul http://localhost:5173
if %errorlevel% neq 0 (
    echo Starting Muzac Engine & Audio Servers...
    start "Muzac Engine" /min cmd.exe /c "npm run dev"
    timeout /t 3 /nobreak >nul
)

:: Launch in native standalone desktop window mode (borderless app frame)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:5173
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5173
) else (
    start http://localhost:5173
)

exit
