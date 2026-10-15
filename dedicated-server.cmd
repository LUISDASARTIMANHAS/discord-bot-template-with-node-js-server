@echo off
setlocal

title=Atualiza o repositorio

@rem Atualiza o repositório
git pull

@rem Gera identificador único para o log
set "id=%random%"
set "log=logs/%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt"

@rem Executa o servidor com prioridade alta
title=%id%-WINDOWS-SERVER-%COMPUTERNAME%

start "" /high cmd /c "npm run start >> "%log%" 2>&1"