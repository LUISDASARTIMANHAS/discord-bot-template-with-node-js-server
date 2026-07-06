@echo off
setlocal

title=Atualiza o repositório
@rem Atualiza o repositório
git pull

@rem Executa o servidor e gera log único
set "id=%random%"
title=%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt
npm run startDedicated >> "logs/%id%-WINDOWS-SERVER-%COMPUTERNAME%.txt" 2>&1