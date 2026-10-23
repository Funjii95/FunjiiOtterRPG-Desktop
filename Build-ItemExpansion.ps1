param([string]$DesktopVersion='0.2.0')
$ErrorActionPreference='Stop'
Push-Location $PSScriptRoot
try {
    dotnet test RaidClipPlugin/Tests -c Release --logger 'trx;LogFileName=plugin-expansion.trx' --results-directory artifacts/test-results --verbosity quiet
    if($LASTEXITCODE -ne 0){throw 'Plugin-Tests fehlgeschlagen.'}
    dotnet test Sync/tests/Backend.Tests -c Release --logger 'trx;LogFileName=backend-expansion.trx' --results-directory artifacts/test-results --verbosity quiet
    if($LASTEXITCODE -ne 0){throw 'Backend-Tests fehlgeschlagen.'}
    dotnet run --project ItemExpansion.Tools -c Release -- $PSScriptRoot
    if($LASTEXITCODE -ne 0){throw 'Itemkatalog konnte nicht exportiert werden.'}
    $releaseWork=Join-Path $PSScriptRoot ('artifacts\tides-release-'+[Guid]::NewGuid().ToString('N'))
    & (Join-Path $PSScriptRoot 'Build-OtterDesktop.ps1') -ReleaseVersion $DesktopVersion -Package -ReleaseDirectory $releaseWork
    $bundle=Join-Path $PSScriptRoot 'artifacts\tides-update'
    $desktop=Join-Path $bundle 'Windows'
    New-Item -ItemType Directory -Force -Path $desktop | Out-Null
    foreach($name in @('FunjiiOtterRPGDesktop-win-Setup.exe','FunjiiOtterRPGDesktop-win-Portable.zip',"FunjiiOtterRPGDesktop-$DesktopVersion-full.nupkg",'releases.win.json','RELEASES')){
        Copy-Item -LiteralPath (Join-Path $releaseWork $name) -Destination $desktop -Force
    }
    dotnet publish RaidClipPlugin -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:EnableCompressionInSingleFile=true -p:DebugType=None -p:DebugSymbols=false -o (Join-Path $bundle 'Plugin')
    if($LASTEXITCODE -ne 0){throw 'Plugin konnte nicht gebaut werden.'}
    Compress-Archive -Path (Join-Path $bundle 'Plugin\*') -DestinationPath (Join-Path $bundle 'RaidClipPlugin-2.2.0-win-x64.zip') -Force
    foreach($project in @('Backend','SnapshotPublisher')){
        dotnet publish "Sync/src/$project" -c Release --self-contained false -p:UseAppHost=false -o (Join-Path $bundle "Cloud\$project")
        if($LASTEXITCODE -ne 0){throw "Cloud-Baustein $project konnte nicht gebaut werden."}
    }
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'docs\ITEM-EXPANSION.md') -Destination (Join-Path $bundle 'VOR-INSTALLATION-LESEN.md') -Force
    New-Item -ItemType Directory -Force -Path (Join-Path $bundle 'docs'),(Join-Path $bundle 'expansions\tides') | Out-Null
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'docs\ITEM-EXPANSION.md') -Destination (Join-Path $bundle 'docs\ITEM-EXPANSION.md') -Force
    foreach($document in @('ITEMS.md','catalog.json','VALIDATION.md')){
        if(Test-Path -LiteralPath (Join-Path $PSScriptRoot "expansions\tides\$document")){Copy-Item -LiteralPath (Join-Path $PSScriptRoot "expansions\tides\$document") -Destination (Join-Path $bundle "expansions\tides\$document") -Force}
    }
    $overlay=Join-Path $PSScriptRoot 'expansions\tides\plugin-overlay'
    $sources=@('RaidClipPlugin.csproj','Config\RpgConfig.cs','Config\RpgLootConfig.cs','Models\RpgProfile.cs','Models\RpgItemEffect.cs','Models\RpgItemSet.cs','Services\RpgTidesExpansion.cs','Services\RpgSetCombatService.cs','Services\RpgItemGenerationService.cs','Services\CharacterStatService.cs','Services\RpgBossDefenseService.cs','Services\RpgPassiveService.cs','Services\RpgHealthService.cs','Services\RpgSushiService.cs','Services\AdventureGameService.cs','Services\RpgSetService.cs','Services\RpgProgressionService.cs','Services\RpgChatPresentation.cs','Services\RpgEnemyService.cs','Services\ConfigurationService.cs','Services\RemoteRpgExecutor.cs','Services\RemoteRpgExecutor.Admin.cs','Services\ChatMinigameService.Admin.cs','Services\RpgHotTimeService.cs','Services\ViewerPointStore.SetTicks.cs','Tests\RpgTidesExpansionTests.cs','Tests\RemoteAdminTests.cs','Tests\RpgSetTests.cs','Tests\RpgLootExpansionTests.cs','Tests\ReleaseUpgradeTests.cs','Tests\RemoteActionTests.cs')
    foreach($source in $sources){
        $destination=Join-Path $overlay $source
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
        Copy-Item -LiteralPath (Join-Path $PSScriptRoot "RaidClipPlugin\$source") -Destination $destination -Force
    }
    Compress-Archive -Path $overlay -DestinationPath (Join-Path $bundle 'Plugin-Quellcode-Overlay-2.2.0.zip') -Force
    Get-ChildItem -LiteralPath $desktop -File | ForEach-Object {Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256} | Select-Object Hash,Path | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $bundle 'checksums-windows.json')
    Get-FileHash -LiteralPath (Join-Path $bundle 'Plugin\RaidClipPlugin.exe'),(Join-Path $bundle 'RaidClipPlugin-2.2.0-win-x64.zip') -Algorithm SHA256 | Select-Object Hash,Path | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $bundle 'checksums-plugin.json')
    Write-Host "Lokale Updatepakete: $bundle. Keine Installation, Veröffentlichung oder Cloud-Bereitstellung ausgeführt."
} finally {Pop-Location}
