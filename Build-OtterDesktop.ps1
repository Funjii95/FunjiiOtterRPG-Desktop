param([string]$ReleaseVersion='0.9.0',[switch]$Package,[string]$ReleaseDirectory=(Join-Path $PSScriptRoot 'Releases'))
$ErrorActionPreference = 'Stop'
if($ReleaseVersion -notmatch '^\d+\.\d+\.\d+$'){throw 'Version muss zum Beispiel 0.1.0 sein.'}
Push-Location (Join-Path $PSScriptRoot 'otter-ui')
try {
    pnpm install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) { throw 'Abhängigkeiten konnten nicht installiert werden.' }
    pnpm build
    if ($LASTEXITCODE -ne 0) { throw 'Oberfläche konnte nicht gebaut werden.' }
    pnpm test
    if ($LASTEXITCODE -ne 0) { throw 'Oberflächentests fehlgeschlagen.' }
} finally { Pop-Location }
$distributionDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'artifacts\publish'))
$webOutput = [IO.Path]::GetFullPath((Join-Path $distributionDirectory 'Web'))
if ($webOutput -ne ($distributionDirectory + [IO.Path]::DirectorySeparatorChar + 'Web')) { throw 'Unerwarteter Ausgabepfad.' }
if (Test-Path -LiteralPath $webOutput) { Remove-Item -LiteralPath $webOutput -Recurse -Force }
dotnet publish (Join-Path $PSScriptRoot 'FunjiiOtterDesktop') -c Release -r win-x64 --self-contained true -p:Version=$ReleaseVersion -o $distributionDirectory
if ($LASTEXITCODE -ne 0) { throw 'Windows-App konnte nicht gebaut werden.' }
dotnet test (Join-Path $PSScriptRoot 'FunjiiOtterDesktop.Tests') -c Release --verbosity quiet
if ($LASTEXITCODE -ne 0) { throw 'Update-Tests fehlgeschlagen.' }
if($Package){
    Push-Location $PSScriptRoot
    try {
        dotnet tool restore
        if($LASTEXITCODE -ne 0){throw 'Update-Werkzeug konnte nicht geladen werden.'}
        dotnet vpk pack --packId FunjiiOtterRPGDesktop --packVersion $ReleaseVersion --packDir $distributionDirectory --mainExe FunjiiOtterDesktop.exe --packTitle 'Funjii Otter RPG' --icon (Join-Path $PSScriptRoot 'FunjiiOtterDesktop/Assets/otter.ico') --packAuthors Funjii95 --releaseNotes (Join-Path $PSScriptRoot 'RELEASE-NOTES.md') --runtime win-x64 --outputDir $ReleaseDirectory --framework webview2 --delta None
        if($LASTEXITCODE -ne 0){throw 'Installer konnte nicht erstellt werden.'}
    } finally { Pop-Location }
}
