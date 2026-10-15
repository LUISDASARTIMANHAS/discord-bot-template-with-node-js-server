@echo off
setlocal

@rem Vai para a pasta onde este .bat está localizado
cd /d "%~dp0"

title=Atualiza o repositorio

@rem Atualiza o repositorio
git pull
if errorlevel 1 (
    echo Erro ao atualizar o repositorio.
    pause
    exit /b 1
)

@rem Garante que a pasta de logs exista
if not exist "logs" mkdir "logs"

@rem Gera identificador e caminho absoluto do log
set "id=%random%"
set "log=%~dp0logs\%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt"

title=%id%-WINDOWS-SERVER-%COMPUTERNAME%

@rem Inicia o servidor com prioridade alta na pasta correta
start "" /high /D "%~dp0" cmd /c "cd /d ""%~dp0"" && npm run start >> ""%log%"" 2>&1"

endlocal