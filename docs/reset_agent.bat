@echo off
echo =============================================
echo   ANTIGRAVITY FULL RESET
echo   Fixes: Failed to fetch, agent crashes,
echo   ERR_CONNECTION_REFUSED, trajectory errors
echo =============================================
echo.
echo This will clear ALL agent data and caches.
echo You may need to sign in again after this.
echo Your PROJECT CODE is NOT affected.
echo.

REM Kill all Antigravity processes
echo [1/4] Killing Antigravity processes...
taskkill /F /IM "Antigravity IDE.exe" 2>nul
taskkill /F /IM "language_server_windows_x64.exe" 2>nul
timeout /t 3 /nobreak >nul
echo       Done.

REM Remove ALL brain/trajectory data
echo.
echo [2/4] Removing all trajectory data...
if exist "%USERPROFILE%\.gemini\antigravity-ide\brain" (
    rmdir /s /q "%USERPROFILE%\.gemini\antigravity-ide\brain"
    echo       Deleted brain data
)
if exist "%USERPROFILE%\.gemini\antigravity-browser-profile" (
    rmdir /s /q "%USERPROFILE%\.gemini\antigravity-browser-profile"
    echo       Deleted browser profile cache
)

REM Remove ALL Antigravity caches (keep User settings)
echo.
echo [3/4] Clearing all caches...
set "AGDIR=%APPDATA%\Antigravity IDE"
for %%D in (Backups blob_storage Cache CachedData CachedConfigurations CachedExtensionVSIXs CachedProfilesData Crashpad DawnGraphiteCache DawnWebGPUCache GPUCache logs Network "Service Worker" "Session Storage" "Shared Dictionary" WebStorage "Local Storage" "Code Cache") do (
    if exist "%AGDIR%\%%~D" (
        rmdir /s /q "%AGDIR%\%%~D" 2>nul
        echo       Cleared %%~D
    )
)
REM Delete stale files
for %%F in (code.lock DIPS DIPS-wal "Local State" machineid Preferences SharedStorage) do (
    if exist "%AGDIR%\%%~F" (
        del /f /q "%AGDIR%\%%~F" 2>nul
    )
)

echo.
echo [4/4] Flushing DNS...
ipconfig /flushdns >nul 2>&1

echo.
echo =============================================
echo   FULL RESET COMPLETE!
echo =============================================
echo.
echo   Now:
echo   1. Open Antigravity IDE
echo   2. Sign in again if prompted
echo   3. Select a model (e.g. Gemini 2.5 Flash)
echo   4. Start a NEW chat
echo   5. Type "hello" to test
echo.
echo   DO NOT continue old chats - start fresh!
echo =============================================
echo.
pause
