@echo off
setlocal

rem Atualiza o repositório
git pull

rem Executa o servidor e gera log único
set "id=%random%"
npm run start >> "logs/%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt" 2>&1