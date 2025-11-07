@echo off
if not exist exclude.list Echo must be run from BUILD directory -- exclude.list not found
if exist exclude.list echo xcopy ..\*.* C:\inetpub\wwwroot.wordless.rwbutts.net\ /exclude:exclude.list  /s /y /d 
if exist exclude.list xcopy ..\*.* C:\inetpub\wwwroot.wordless.rwbutts.net\ /exclude:exclude.list  /s /y /d 
