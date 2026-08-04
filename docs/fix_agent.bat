@echo off
echo =============================================
echo   ANTIGRAVITY PERMANENT FIX
echo   This will fix the agent crashing issue
echo =============================================
echo.
echo STEP 1: Closing Antigravity IDE...
echo.
taskkill /F /IM "Antigravity IDE.exe" 2>nul
taskkill /F /IM "language_server_windows_x64.exe" 2>nul
timeout /t 3 /nobreak >nul

echo STEP 2: Removing corrupted trajectory data...
echo.

REM Remove the specific corrupted trajectory
if exist "%USERPROFILE%\.gemini\antigravity-ide\brain\41185112-516c-462d-85af-75d46e3840a1" (
    rmdir /s /q "%USERPROFILE%\.gemini\antigravity-ide\brain\41185112-516c-462d-85af-75d46e3840a1"
    echo   Deleted corrupted trajectory: 41185112
) else (
    echo   Corrupted trajectory already removed.
)

echo.
echo STEP 3: Clearing Antigravity cache...
echo.

REM Clear cached data that may contain stale model config
if exist "%APPDATA%\Antigravity IDE\Cache" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\Cache"
    echo   Cleared Cache
)
if exist "%APPDATA%\Antigravity IDE\CachedData" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\CachedData"
    echo   Cleared CachedData
)
if exist "%APPDATA%\Antigravity IDE\CachedConfigurations" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\CachedConfigurations"
    echo   Cleared CachedConfigurations
)
if exist "%APPDATA%\Antigravity IDE\GPUCache" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\GPUCache"
    echo   Cleared GPUCache
)
if exist "%APPDATA%\Antigravity IDE\Code Cache" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\Code Cache"
    echo   Cleared Code Cache
)
if exist "%APPDATA%\Antigravity IDE\DawnGraphiteCache" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\DawnGraphiteCache"
    echo   Cleared DawnGraphiteCache
)
if exist "%APPDATA%\Antigravity IDE\DawnWebGPUCache" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\DawnWebGPUCache"
    echo   Cleared DawnWebGPUCache
)
if exist "%APPDATA%\Antigravity IDE\Crashpad" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\Crashpad"
    echo   Cleared Crashpad
)

echo.
echo STEP 4: Clearing old logs...
echo.
if exist "%APPDATA%\Antigravity IDE\logs" (
    rmdir /s /q "%APPDATA%\Antigravity IDE\logs"
    echo   Cleared logs
)

echo.
echo =============================================
echo   FIX COMPLETE!
echo =============================================
echo.
echo   Now open Antigravity IDE and:
echo   1. Select a model (Gemini 2.5 Flash or Claude)
echo   2. Start a NEW chat (don't continue old ones)
echo   3. Type "hello" to test
echo.
echo   Your login and settings are preserved.
echo =============================================
echo.
pause
