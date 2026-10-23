# Abschlussbericht – Gezeiten-Erweiterung und Windows-Admin

Stand: 23.10.2026. Windows 0.2.0, Plugin 2.2.0, RPG-Projektion 5. Lokale Buildkandidaten; keine Veröffentlichung und kein Deployment.

## Durchgeführte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Gesamte Plugin-Testsuite | 960 bestanden, 0 fehlgeschlagen |
| Backend-Testsuite | 262 bestanden, 0 fehlgeschlagen |
| React-/Transport-Tests | 112 bestanden, 0 fehlgeschlagen |
| Windows-Updater-Tests | 7 bestanden, 0 fehlgeschlagen |
| Nativer Windows-Start / WebView2 / Backend-Brücke | Bestanden, mit Testprofil ohne Live-Mutationen |
| Bedienprüfung des echten Desktop-Bundles im Browser | Adminformular, eigene Itemwerte, Mimic-Auftrag und ausgeblendeter Adminzugang für andere Spieler erfolgreich geprüft; ausschließlich simulierte Antworten |
| Builds | Windows-Installer, Updatepaket, Portable-ZIP, eigenständiges Plugin, Linux-Backend und Linux-Publisher erfolgreich erstellt |

Neue Regressionstests prüfen alle 66 Definitionen, eindeutige IDs und gültige Slots, Minimal-/Maximalwürfe, gespeicherte Werte, echten Firestore-SDK-Roundtrip mit lokaler Testdatenbank, lokale Neustarts, sechs echte Sets, Aktivierung und Ablegen, doppelte Ringdefinitionen, zwei Ringslots, Proc-Cooldowns, Schilde, Heilung, Tempobonus und den Plugin-Sekundentakt ohne zusätzliche Aktionstokens. Alte Spielstände und bestehende Lootwahrscheinlichkeiten werden ebenfalls geprüft.

Adminprüfungen: Ablehnung normaler Twitch-Spieler im Backend und Plugin, Identität unabhängig vom Anzeigenamen, erlaubte Eventliste, persistente Grants mit 1–20 eindeutigen Instanzen, Zufalls-/Minimal-/Maximal-/eigene Werte, keine Perlenänderung, keine doppelten Grants bei wiederholter Aktions-ID, ungültige Attribute, fehlende Zielspieler und atomare Ablehnung zu großer Cloud-Spielstände. Boss, Mimic, Rennen und Hot-Time wurden zusätzlich über den tatsächlichen verbundenen Spielcode mit synthetischen Daten gestartet. Der Heist nutzt den bestehenden Heist-Handler; sein Adminstart wurde nicht in einem echten Twitch-Kanal ausgeführt.

Protokolle: `artifacts/tides-final-build.log`, `artifacts/test-results/plugin-expansion.trx`, `artifacts/test-results/backend-expansion.trx`, `artifacts/native-tides-smoke/result.txt`. Bedienvorschau: `artifacts/admin-ui/desktop-admin.png`.

## Modelle, IDs und Werte

Die vollständigen 66 registrierten Item-IDs stehen in [ITEMS.md](ITEMS.md), ihre Definitionen und Würfelbereiche in [catalog.json](catalog.json). Es wurden keine neuen Ausrüstungsslots oder Seltenheiten eingeführt.

Echte Set-IDs: `tide_king_regalia`, `abyss_hunter`, `coral_oracle`, `current_twins`, `dark_pearl_twins`, `moon_tide_jewelry`. Die sechs optischen Reihen und sechs Einzelitems haben keine Setzuordnung.

Neue Attribute in `RpgAttributes`: `Armor`, `ArmorPercent`, `MaximumHpPercent`, `AttackSpeed`, `HealingPower`. Neue Erstellungsregeln in `RpgItemGeneration`: `BaseAttributes`, `MinimumAttributes`, `MaximumAttributes`. Setboni erhalten `Description`. Autoritative Schilddaten: `RpgHealthState.SetShieldHp` und `SetShieldSource`. Vorhandene `Attributes`, `InstanceId`, `SetId`, `IconId` und `Cooldowns` bleiben die maßgeblichen Instanzfelder.

Neue Dienste: `RpgTidesExpansion`, `RpgSetCombatService`, `ViewerPointStore.SetTicks`, `RemoteRpgExecutor.Admin` und `ChatMinigameService.Admin`. Die Windows-Ansicht verwendet `DesktopAdmin`; Adminaktionen laufen über den bereits abgesicherten nativen Transport und das bestehende Aktionsjournal.

## Grenzen und Freigabe

Endgültige Einzelillustrationen fehlen. 66 individuelle, beschriftete SVG-Platzhalter sind vollständig zugeordnet und auf Dateiintegrität geprüft.

Die Pakete sind nicht auf dem laufenden Kanal installiert oder gegen dessen echte Cloud-Daten freigegeben worden. Zuerst die passende Publisher-/Backend-Version bereitstellen und prüfen; erst anschließend Plugin 2.2.0 einsetzen. Der alte Publisher bestätigt Projektion 5 noch nicht. Die vorhandene Twitch-Extension und das installierte Plugin bleiben bestehen. Ausführliche Hinweise: [ITEM-EXPANSION.md](../../docs/ITEM-EXPANSION.md).

## Vollständige Änderungsliste

Die folgende Liste wird aus den lokalen Git-Änderungen und dem separat mitgelieferten Plugin-Overlay erzeugt. Das Overlay enthält die geänderten Plugin-Quelldateien für die lokale Basis 2.1.47, keine Spielstände oder Zugangsdaten.

- Build-ItemExpansion.ps1
- Build-OtterDesktop.ps1
- docs/ITEM-EXPANSION.md
- expansions/tides/catalog.json
- expansions/tides/ITEMS.md
- expansions/tides/plugin-overlay/Config/RpgConfig.cs
- expansions/tides/plugin-overlay/Config/RpgLootConfig.cs
- expansions/tides/plugin-overlay/Models/RpgItemEffect.cs
- expansions/tides/plugin-overlay/Models/RpgItemSet.cs
- expansions/tides/plugin-overlay/Models/RpgProfile.cs
- expansions/tides/plugin-overlay/RaidClipPlugin.csproj
- expansions/tides/plugin-overlay/Services/AdventureGameService.cs
- expansions/tides/plugin-overlay/Services/CharacterStatService.cs
- expansions/tides/plugin-overlay/Services/ChatMinigameService.Admin.cs
- expansions/tides/plugin-overlay/Services/ConfigurationService.cs
- expansions/tides/plugin-overlay/Services/RemoteRpgExecutor.Admin.cs
- expansions/tides/plugin-overlay/Services/RemoteRpgExecutor.cs
- expansions/tides/plugin-overlay/Services/RpgBossDefenseService.cs
- expansions/tides/plugin-overlay/Services/RpgChatPresentation.cs
- expansions/tides/plugin-overlay/Services/RpgEnemyService.cs
- expansions/tides/plugin-overlay/Services/RpgHealthService.cs
- expansions/tides/plugin-overlay/Services/RpgHotTimeService.cs
- expansions/tides/plugin-overlay/Services/RpgItemGenerationService.cs
- expansions/tides/plugin-overlay/Services/RpgPassiveService.cs
- expansions/tides/plugin-overlay/Services/RpgProgressionService.cs
- expansions/tides/plugin-overlay/Services/RpgSetCombatService.cs
- expansions/tides/plugin-overlay/Services/RpgSetService.cs
- expansions/tides/plugin-overlay/Services/RpgSushiService.cs
- expansions/tides/plugin-overlay/Services/RpgTidesExpansion.cs
- expansions/tides/plugin-overlay/Services/ViewerPointStore.SetTicks.cs
- expansions/tides/plugin-overlay/Tests/ReleaseUpgradeTests.cs
- expansions/tides/plugin-overlay/Tests/RemoteActionTests.cs
- expansions/tides/plugin-overlay/Tests/RemoteAdminTests.cs
- expansions/tides/plugin-overlay/Tests/RpgLootExpansionTests.cs
- expansions/tides/plugin-overlay/Tests/RpgSetTests.cs
- expansions/tides/plugin-overlay/Tests/RpgTidesExpansionTests.cs
- expansions/tides/VALIDATION.md
- FunjiiOtterDesktop/FunjiiOtterDesktop.csproj
- ItemExpansion.Tools/ItemExpansion.Tools.csproj
- ItemExpansion.Tools/Program.cs
- otter-ui/ART-SOURCES.md
- otter-ui/public/items/tides/abyss_hunter_amulet.svg
- otter-ui/public/items/tides/abyss_hunter_boots.svg
- otter-ui/public/items/tides/abyss_hunter_chest.svg
- otter-ui/public/items/tides/abyss_hunter_gloves.svg
- otter-ui/public/items/tides/abyss_hunter_helmet.svg
- otter-ui/public/items/tides/abyss_hunter_ring.svg
- otter-ui/public/items/tides/abyss_moon_amulet.svg
- otter-ui/public/items/tides/coast_runner_amulet.svg
- otter-ui/public/items/tides/coast_runner_boots.svg
- otter-ui/public/items/tides/coast_runner_chest.svg
- otter-ui/public/items/tides/coast_runner_gloves.svg
- otter-ui/public/items/tides/coast_runner_helmet.svg
- otter-ui/public/items/tides/coast_runner_ring.svg
- otter-ui/public/items/tides/coral_keeper_vest.svg
- otter-ui/public/items/tides/coral_oracle_amulet.svg
- otter-ui/public/items/tides/coral_oracle_boots.svg
- otter-ui/public/items/tides/coral_oracle_chest.svg
- otter-ui/public/items/tides/coral_oracle_gloves.svg
- otter-ui/public/items/tides/coral_oracle_helmet.svg
- otter-ui/public/items/tides/coral_oracle_ring.svg
- otter-ui/public/items/tides/current_twin_ring_a.svg
- otter-ui/public/items/tides/current_twin_ring_b.svg
- otter-ui/public/items/tides/dark_pearl_ring_a.svg
- otter-ui/public/items/tides/dark_pearl_ring_b.svg
- otter-ui/public/items/tides/kelp_collector_amulet.svg
- otter-ui/public/items/tides/kelp_collector_boots.svg
- otter-ui/public/items/tides/kelp_collector_chest.svg
- otter-ui/public/items/tides/kelp_collector_gloves.svg
- otter-ui/public/items/tides/kelp_collector_helmet.svg
- otter-ui/public/items/tides/kelp_collector_ring.svg
- otter-ui/public/items/tides/lagoon_runner_amulet.svg
- otter-ui/public/items/tides/lagoon_runner_boots.svg
- otter-ui/public/items/tides/lagoon_runner_chest.svg
- otter-ui/public/items/tides/lagoon_runner_gloves.svg
- otter-ui/public/items/tides/lagoon_runner_helmet.svg
- otter-ui/public/items/tides/lagoon_runner_ring.svg
- otter-ui/public/items/tides/moon_tide_amulet.svg
- otter-ui/public/items/tides/moon_tide_ring.svg
- otter-ui/public/items/tides/otter_captain_hood.svg
- otter-ui/public/items/tides/pearl_digger_amulet.svg
- otter-ui/public/items/tides/pearl_digger_boots.svg
- otter-ui/public/items/tides/pearl_digger_chest.svg
- otter-ui/public/items/tides/pearl_digger_gloves.svg
- otter-ui/public/items/tides/pearl_digger_helmet.svg
- otter-ui/public/items/tides/pearl_digger_ring.svg
- otter-ui/public/items/tides/pearl_diver_claws.svg
- otter-ui/public/items/tides/reef_guardian_amulet.svg
- otter-ui/public/items/tides/reef_guardian_boots.svg
- otter-ui/public/items/tides/reef_guardian_chest.svg
- otter-ui/public/items/tides/reef_guardian_gloves.svg
- otter-ui/public/items/tides/reef_guardian_helmet.svg
- otter-ui/public/items/tides/reef_guardian_ring.svg
- otter-ui/public/items/tides/shell_speaker_amulet.svg
- otter-ui/public/items/tides/shell_speaker_boots.svg
- otter-ui/public/items/tides/shell_speaker_chest.svg
- otter-ui/public/items/tides/shell_speaker_gloves.svg
- otter-ui/public/items/tides/shell_speaker_helmet.svg
- otter-ui/public/items/tides/shell_speaker_ring.svg
- otter-ui/public/items/tides/still_lagoon_ring.svg
- otter-ui/public/items/tides/tide_king_amulet.svg
- otter-ui/public/items/tides/tide_king_boots.svg
- otter-ui/public/items/tides/tide_king_chest.svg
- otter-ui/public/items/tides/tide_king_gloves.svg
- otter-ui/public/items/tides/tide_king_helmet.svg
- otter-ui/public/items/tides/tide_king_ring.svg
- otter-ui/public/items/tides/tide_runner_boots.svg
- otter-ui/src/data.ts
- otter-ui/src/desktop-entry.tsx
- otter-ui/src/desktop.css
- otter-ui/src/DesktopAdmin.tsx
- otter-ui/src/GraphicalApp.tsx
- otter-ui/src/item-art.tsx
- otter-ui/src/live/client.ts
- otter-ui/src/mock.ts
- otter-ui/src/presentation.ts
- otter-ui/src/remote/model.ts
- otter-ui/src/tides-art.json
- otter-ui/src/types.ts
- otter-ui/tests/desktop-admin.test.ts
- otter-ui/tests/tides.test.ts
- RELEASE-NOTES.md
- Sync/src/Backend/ActionRelay.cs
- Sync/src/Backend/packages.lock.json
- Sync/src/Backend/Players.cs
- Sync/src/SnapshotDelivery/packages.lock.json
- Sync/src/SnapshotFirestore/packages.lock.json
- Sync/src/SnapshotProtocol/ActionContracts.cs
- Sync/src/SnapshotProtocol/packages.lock.json
- Sync/src/SnapshotProtocol/SnapshotMessage.cs
- Sync/src/SnapshotPublisher/packages.lock.json
- Sync/tests/Backend.Tests/AdminActionTests.cs

Originale Plugin-Dateien (im Overlay mitgeliefert):

- RaidClipPlugin/Config/RpgConfig.cs
- RaidClipPlugin/Config/RpgLootConfig.cs
- RaidClipPlugin/Models/RpgItemEffect.cs
- RaidClipPlugin/Models/RpgItemSet.cs
- RaidClipPlugin/Models/RpgProfile.cs
- RaidClipPlugin/RaidClipPlugin.csproj
- RaidClipPlugin/Services/AdventureGameService.cs
- RaidClipPlugin/Services/CharacterStatService.cs
- RaidClipPlugin/Services/ChatMinigameService.Admin.cs
- RaidClipPlugin/Services/ConfigurationService.cs
- RaidClipPlugin/Services/RemoteRpgExecutor.Admin.cs
- RaidClipPlugin/Services/RemoteRpgExecutor.cs
- RaidClipPlugin/Services/RpgBossDefenseService.cs
- RaidClipPlugin/Services/RpgChatPresentation.cs
- RaidClipPlugin/Services/RpgEnemyService.cs
- RaidClipPlugin/Services/RpgHealthService.cs
- RaidClipPlugin/Services/RpgHotTimeService.cs
- RaidClipPlugin/Services/RpgItemGenerationService.cs
- RaidClipPlugin/Services/RpgPassiveService.cs
- RaidClipPlugin/Services/RpgProgressionService.cs
- RaidClipPlugin/Services/RpgSetCombatService.cs
- RaidClipPlugin/Services/RpgSetService.cs
- RaidClipPlugin/Services/RpgSushiService.cs
- RaidClipPlugin/Services/RpgTidesExpansion.cs
- RaidClipPlugin/Services/ViewerPointStore.SetTicks.cs
- RaidClipPlugin/Tests/ReleaseUpgradeTests.cs
- RaidClipPlugin/Tests/RemoteActionTests.cs
- RaidClipPlugin/Tests/RemoteAdminTests.cs
- RaidClipPlugin/Tests/RpgLootExpansionTests.cs
- RaidClipPlugin/Tests/RpgSetTests.cs
- RaidClipPlugin/Tests/RpgTidesExpansionTests.cs
