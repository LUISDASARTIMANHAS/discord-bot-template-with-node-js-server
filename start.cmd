@echo off
setlocal

rem Atualiza o repositório
git pull

rem Adiciona logs e envia para o GitHub
git add *.txt
git commit -m "WINDOWS SERVER CRASH LOGS"
git push origin main

rem Executa o servidor e gera log único
set "id=%random%"
npm run start >> "%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt" 2>&1
