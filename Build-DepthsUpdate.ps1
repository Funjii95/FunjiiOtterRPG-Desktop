param([string]$DesktopVersion='0.3.0',[string]$PluginVersion='2.3.0')
$ErrorActionPreference='Stop'
Push-Location $PSScriptRoot
try {
    if(!(Test-Path -LiteralPath (Join-Path $PSScriptRoot 'RaidClipPlugin\RaidClipPlugin.csproj'))){
        $checkout=Join-Path $PSScriptRoot ('artifacts\plugin-source-'+[Guid]::NewGuid().ToString('N'))
        git clone --depth 1 --branch "v$PluginVersion" https://github.com/Funjii95/RaidClipPlugin.git $checkout
        if($LASTEXITCODE-ne 0){throw 'Passende öffentliche Plugin-Quellen konnten nicht geladen werden.'}
        Copy-Item -LiteralPath (Join-Path $checkout 'RaidClipPlugin') -Destination (Join-Path $PSScriptRoot 'RaidClipPlugin') -Recurse
    }
    dotnet test RaidClipPlugin/Tests -c Release --logger 'trx;LogFileName=plugin-depths.trx' --results-directory artifacts/test-results --verbosity quiet
    if($LASTEXITCODE-ne 0){throw 'Plugin-Tests fehlgeschlagen.'}
    dotnet test Sync/tests/Backend.Tests -c Release --logger 'trx;LogFileName=backend-depths.trx' --results-directory artifacts/test-results --verbosity quiet
    if($LASTEXITCODE-ne 0){throw 'Cloud-Tests fehlgeschlagen.'}
    dotnet run --project ItemExpansion.Tools -c Release -- $PSScriptRoot
    if($LASTEXITCODE-ne 0){throw 'Katalogexport fehlgeschlagen.'}
    $releaseWork=Join-Path $PSScriptRoot ('artifacts\depths-release-'+[Guid]::NewGuid().ToString('N'))
    & ./Build-OtterDesktop.ps1 -ReleaseVersion $DesktopVersion -Package -ReleaseDirectory $releaseWork
    $bundle=Join-Path $PSScriptRoot 'artifacts\depths-update'
    New-Item -ItemType Directory -Force -Path $bundle | Out-Null
    $desktop=Join-Path $bundle 'Windows'
    New-Item -ItemType Directory -Force -Path $desktop | Out-Null
    Get-ChildItem -LiteralPath $releaseWork -File | ForEach-Object {Copy-Item -LiteralPath $_.FullName -Destination $desktop -Force}
    dotnet publish RaidClipPlugin -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:EnableCompressionInSingleFile=true -p:DebugType=None -p:DebugSymbols=false -o (Join-Path $bundle 'Plugin')
    if($LASTEXITCODE-ne 0){throw 'Plugin-Build fehlgeschlagen.'}
    Compress-Archive -Path (Join-Path $bundle 'Plugin\*') -DestinationPath (Join-Path $bundle "RaidClipPlugin-$PluginVersion-win-x64.zip") -Force
    foreach($project in @('Backend','SnapshotPublisher')){
        dotnet publish "Sync/src/$project" -c Release --self-contained false -p:UseAppHost=false -o (Join-Path $bundle "Cloud\$project")
        if($LASTEXITCODE-ne 0){throw "Cloud-Build $project fehlgeschlagen."}
    }
    $documentation=Join-Path $bundle 'Dokumentation-und-Quellcode'
    New-Item -ItemType Directory -Force -Path $documentation | Out-Null
    Copy-Item -Path (Join-Path $PSScriptRoot 'expansions\depths\*') -Destination $documentation -Recurse -Force
    Write-Host "Updatepakete erstellt: $bundle"
} finally {Pop-Location}
