@echo off
echo Finding processes occupying ports 3000-3006...

setlocal enabledelayedexpansion

for /l %%p in (3000,1,3006) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p') do (
        set PID=%%a
        echo Found process occupying port %%p with PID: !PID!
        echo Terminating process...
        taskkill /F /PID !PID!
        
        if !errorlevel! == 0 (
            echo Successfully terminated process !PID!
        ) else (
            echo Failed to terminate process !PID!, please check manually
        )
        echo.
    )
)

echo Operation completed
pause