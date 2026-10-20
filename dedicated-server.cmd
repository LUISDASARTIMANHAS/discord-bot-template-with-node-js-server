
@echo off
setlocal

cd /d "%~dp0"
echo %cd%

title=Atualiza o repositorio

@rem Executa o script de atualizacao existente
start /wait "" cmd /c "call ""%~dp0gitAutopull.cmd"""

if not exist "logs" mkdir "logs"

set "id=%random%"
set "log=%~dp0logs\%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt"

title=%id%-WINDOWS-SERVER-%COMPUTERNAME%
echo %cd%

@rem Executa o servidor
@rem A saida e gravada no arquivo de log
npm run start >> "%log%" 2>&1

endlocal
