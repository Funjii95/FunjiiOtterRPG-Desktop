# Funjii Otter RPG Desktop

Windows-App für **Funjii Otter RPG** mit der originalen Oberfläche, Twitch-Login und gemeinsamem Spielstand über das bestehende Backend.

## Installieren

Den **[Windows-Installer herunterladen](https://github.com/Funjii95/FunjiiOtterRPG-Desktop/releases/latest/download/FunjiiOtterRPGDesktop-win-Setup.exe)** und einmal ausführen. .NET ist enthalten; fehlendes Microsoft Edge WebView2 wird vom Installer ergänzt.

In der App **Mit Twitch anmelden** wählen und im Browser bestätigen. Spielername und Twitch-Nutzer-ID werden automatisch übernommen. Es ist keine Eingabe einer Client-ID erforderlich.

Die App benötigt das spielbereite Funjii-Backend und das verbundene RaidClipPlugin. Profile und Spielaktionen werden dort geprüft. Ohne Verbindung werden keine Demo-Perlen oder erfundenen Werte angezeigt. Bei größeren Inventaren benötigt das Plugin mindestens die Statuskorrektur 2.1.47.

## Automatische Updates

- Die installierte App prüft beim Start und anschließend stündlich auf neue stabile GitHub-Releases.
- Updates werden im Hintergrund heruntergeladen und durch Velopack geprüft.
- **Update installieren** übernimmt ein fertiges Update durch einen Neustart. Bei einer noch offenen Spielaktion wartet die App auf deren Abschluss.
- Ein bereits heruntergeladenes Update wird auch beim nächsten normalen App-Start übernommen.
- Bei einer fehlgeschlagenen Prüfung bleibt die vorhandene Version nutzbar.

Die Updatequelle ist dieses Repository. Spielstände bleiben im Backend; das lokale Profil liegt außerhalb des Programmordners unter `%LOCALAPPDATA%/FunjiiOtterDesktop`. Zugangstokens bleiben nur im Arbeitsspeicher. Nach einem Neustart ist eine Twitch-Anmeldung erforderlich.

Die ebenfalls angebotene Velopack-Portable-Ausgabe enthält ihre Update-Metadaten. Ein nackter Entwicklungsbuild aus `artifacts/publish` ist keine installierte Ausgabe und bietet stattdessen den Installer-Link an.

## Selbst bauen

Voraussetzungen: Windows x64, .NET 10 SDK, Node.js ab 22.12 und pnpm 11.25.0.

```powershell
./Build-OtterDesktop.ps1
./Build-OtterDesktop.ps1 -ReleaseVersion 0.1.0 -Package
```

Der erste Befehl baut Oberfläche und Windows-App und führt die Frontend-/Update-Tests aus. Ausgabe: `artifacts/publish`. Mit `-Package` entstehen Installer, Portable-Ausgabe und Updatepakete unter `Releases`.

Zusätzliche Backend-Tests:

```powershell
dotnet test Sync/tests/Backend.Tests/Backend.Tests.csproj
```

Ein nativer Rauchtest prüft die WebView-Oberfläche ohne Live-Spielaktionen:

```powershell
./artifacts/publish/FunjiiOtterDesktop.exe --smoke-test C:\Temp\OtterSmoke
```

## Neue Version veröffentlichen

Versionsnummer in `FunjiiOtterDesktop/FunjiiOtterDesktop.csproj` und `RELEASE-NOTES.md` aktualisieren, Änderungen committen und ein passendes Tag wie `v0.1.1` pushen. Der Workflow **Windows release** baut und testet die App und veröffentlicht Installer und Update-Feed über das kurzlebige GitHub-Actions-Token. Im Quellcode wird kein GitHub-Token benötigt.

Der Workflow **Tests** prüft Änderungen auf `main` und Pull Requests. Das Windows-Release führt keine Cloud-Bereitstellung und kein Update der Twitch Extension aus.

Architektur: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Bildquellen: [otter-ui/ART-SOURCES.md](otter-ui/ART-SOURCES.md).
