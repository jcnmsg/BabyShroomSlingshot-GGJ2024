Outfile "BabyShroomSlingshot.exe"
SilentInstall silent

Section
SetOutPath $TEMP
File ".\ggj2024.zip"
    nsExec::Exec '"powershell" -WindowStyle hidden -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path $TEMP\ggj2024.zip -Destination $TEMP"'
    nsExec::Exec '"powershell" -NoProfile -ExecutionPolicy Bypass -WindowStyle hidden -Command "$TEMP\ggj2024\dist\rayjs.exe"'
SectionEnd