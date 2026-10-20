
@echo off
setlocal

@rem Vai para a pasta onde este .bat esta localizado
cd /d "%~dp0"
echo %cd%

title=Atualiza o repositorio

@rem Executa o script que ja faz a atualizacao
start /wait "" cmd /c "call ""%~dp0gitAutopull.cmd"""

@rem Garante que a pasta de logs exista
if not exist "logs" mkdir "logs"

@rem Gera identificador e caminho absoluto do log
set "id=%random%"
set "log=%~dp0logs\%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt"

title=%id%-WINDOWS-SERVER-%COMPUTERNAME%
echo %cd%

@rem Inicia o servidor com prioridade alta
@rem Exibe os logs no terminal e salva no arquivo
start "" /high /D "%~dp0" powershell -NoExit -Command ^
  "Set-Location -LiteralPath '%~dp0';" ^
  "npm run start 2>&1 | Tee-Object -FilePath '%log%' -Append"

endlocal
