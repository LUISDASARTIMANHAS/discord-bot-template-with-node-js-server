
@echo off
setlocal

cd /d "%~dp0"
echo %cd%

title Atualiza o repositorio

@rem Executa o script de atualizacao existente
start /wait "" cmd /c "call ""%~dp0gitAutopull.cmd"""

if not exist "logs" mkdir "logs"

set "id=%random%"
set "log=%~dp0logs\%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt"

title %id%-WINDOWS-SERVER-%COMPUTERNAME%

@rem Executa o servidor e grava a saida no arquivo
@rem Para exibir e gravar simultaneamente, e necessario um mecanismo de duplicacao
npm run start > %log% & type %log%

endlocal
