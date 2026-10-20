
@echo off
setlocal

@rem Vai para a pasta onde este .bat esta localizado
cd /d "%~dp0"
echo %cd%

title=Atualiza o repositorio

@rem Executa o script que ja faz toda a atualizacao
start /wait "" cmd /c "call ""%~dp0gitAutopull.cmd"""

@rem Garante que a pasta de logs exista
if not exist "logs" mkdir "logs"

@rem Gera identificador e caminho absoluto do log
set "id=%random%"
set "log=%~dp0logs\%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt"

title=%id%-WINDOWS-SERVER-%COMPUTERNAME%
echo %cd%

@rem Localiza o tee fornecido pelo Git for Windows
set "TEE=%ProgramFiles%\Git\usr\bin\tee.exe"
if not exist "%TEE%" set "TEE=%ProgramFiles(x86)%\Git\usr\bin\tee.exe"

@rem Verifica se o tee existe
if not exist "%TEE%" (
    echo ERRO: tee.exe nao encontrado na instalacao do Git.
    echo Instale o Git for Windows ou ajuste o caminho do tee.exe.
    pause
    exit /b 1
)

@rem Inicia o servidor com prioridade alta
@rem Mostra os logs no terminal e salva no arquivo
start "" /high /D "%~dp0" cmd /c "npm run start 2>&1 | ""%TEE%"" -a ""%log%"""

endlocal
