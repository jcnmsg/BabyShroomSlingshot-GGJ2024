Outfile "MyGame.exe"
SilentInstall silent

Section
SetOutPath $TEMP
File ".\release.zip"
    nsExec::Exec '"powershell" -WindowStyle hidden -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path $TEMP\release.zip -Destination $TEMP"'
    nsExec::Exec '"powershell" -NoProfile -ExecutionPolicy Bypass -WindowStyle hidden -Command "$TEMP\release\rayjs.exe"'
SectionEnd