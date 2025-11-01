@echo off
git reset --hard HEAD
git pull

set "id=%random%"
npm run start >> %random%-WINDOWS-SERVER-%COMPUTERNAME%.txt 2>&1
pause
