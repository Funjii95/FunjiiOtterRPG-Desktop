# Tank-Ausrüstung – Implementierungsbericht 29.10.2026

## Inhalte
27 neue Gegenstände, drei achtteilige Sets und ein zusätzlicher Gürtelplatz. Der Waffenplatz bleibt erhalten. Mythic wurde als Wert 10 und Belt als Wert 8 angehängt; vorhandene numerische IDs werden nicht umgedeutet.

| ID | Name | Stufe | Seltenheit |
|---|---|---:|---|
| `tank_shell_chest` | Panzerung des Muschelwächters | 5 | Uncommon |
| `tank_reef_chest` | Brustplatte des Riffverteidigers | 20 | Rare |
| `tank_depth_chest` | Panzer des Tiefenwächters | 30 | Epic |
| `tank_coral_helmet` | Helm des Korallenbollwerks | 50 | Legendary |
| `tank_coral_chest` | Brustplatte des Korallenbollwerks | 50 | Legendary |
| `tank_coral_gloves` | Panzerhandschuhe des Korallenbollwerks | 50 | Legendary |
| `tank_coral_boots` | Stiefel des Korallenbollwerks | 50 | Legendary |
| `tank_coral_belt` | Gürtel des Korallenbollwerks | 50 | Legendary |
| `tank_coral_amulet` | Amulett des Korallenbollwerks | 50 | Legendary |
| `tank_coral_ring` | Ring des Korallenbollwerks | 50 | Legendary |
| `tank_coral_seal` | Siegelring des Korallenbollwerks | 50 | Legendary |
| `tank_sentinel_helmet` | Abyss-Helm | 80 | Mythic |
| `tank_sentinel_chest` | Abyss-Brustpanzer | 80 | Mythic |
| `tank_sentinel_gloves` | Abyss-Handschuhe | 80 | Mythic |
| `tank_sentinel_boots` | Abyss-Stiefel | 80 | Mythic |
| `tank_sentinel_belt` | Abyss-Gürtel | 80 | Mythic |
| `tank_sentinel_amulet` | Abyss-Amulett | 80 | Mythic |
| `tank_sentinel_ring` | Abyss-Ring | 80 | Mythic |
| `tank_sentinel_seal` | Siegel des Abyss | 80 | Mythic |
| `tank_leviathan_helmet` | Krone des Ewigen Leviathans | 99 | Eternal |
| `tank_leviathan_chest` | Herzpanzer des Ewigen Leviathans | 99 | Eternal |
| `tank_leviathan_gloves` | Klauen des Ewigen Leviathans | 99 | Eternal |
| `tank_leviathan_boots` | Schuppenstiefel des Ewigen Leviathans | 99 | Eternal |
| `tank_leviathan_belt` | Gurt des Ewigen Leviathans | 99 | Eternal |
| `tank_leviathan_amulet` | Herz des Leviathans | 99 | Eternal |
| `tank_leviathan_ring` | Leviathanring | 99 | Eternal |
| `tank_leviathan_seal` | Ewiges Siegel | 99 | Eternal |

## Grafiken
Alle 27 Itemdateien liegen unter `otter-ui/public/items/tank/<ID>.webp` (256×256, Alphakanal). Hinzu kommen `tank_coral_preview.webp`, `tank_sentinel_preview.webp`, `tank_leviathan_preview.webp` (512×512) und die fünf Effektbilder `tank_avatar`, `tank_aggro`, `tank_block`, `tank_barrier`, `tank_group_guard`. Die Originale und zwei visuell geprüfte Kontaktbögen bleiben lokal unter `artifacts/tank-art/`. Mit ImageGen erstellte Fantasy-Illustrationen; Seltenheitsrahmen werden verlustfrei in der Oberfläche ergänzt. Die Effektillustrationen sind teilweise mit atmosphärischem Hintergrund gestaltet.

## Mechanik und Zugang
Blocklimit 75 Prozent. Tankbarrieren, erhaltene Heilung und Aggro werden in der bestehenden Charakterberechnung berücksichtigt. Seteffekte laufen in den autoritativen Transaktionen des Plugins. Cooldowns werden gespeichert; Ausrüstungswechsel löschen aktive Tankeffekte, aber keine Abklingzeiten. Verschiedene Exemplare desselben Setteils zählen nur einmal.

Gruppenschutz verwendet den höchsten aktiven Gruppenbonus. Pro Treffer leitet höchstens ein lebender Tank Schaden um; Umleitungen rufen keine weiteren Gegenangriffe auf. Temporäre Avatar-HP laufen durch Begrenzung auf das reguläre Maximum aus und töten den Spieler nicht. Schwere direkte Treffer sind als Rohschaden ab 20 Prozent der maximalen HP definiert.

Einzelrüstungen und Korallenbollwerk stammen aus regulären Gebietskämpfen mit Levelprüfung. Mythische Dungeons bieten zusätzlich einen 25-Prozent-Wurf auf geeignete Tankteile: Sentinel ab Spielerlevel 80, Leviathan ab 99. Dieser Wurf ersetzt keine normale Dungeonbelohnung. Die Endgamesets sind aus Gebietsboss-Pools ausgeschlossen. Itemverwaltung, Aufwertung und Sets-Vervollständigung verwenden vorhandene Wege und Berechtigungen.

## Speicherung und Server
Projektionsversion 15 ergänzt Tankzustand, vier Attribute, Mythic und Belt. Keine massenhafte Umschreibung von Firestore-Dokumenten und kein Neurollen vorhandener Ausrüstung. Alte Profile erhalten sichere Null-/Leerwerte. Publisher bleibt mit Projektionen bis 14 kompatibel. Die Kataloggrenze steigt auf 96.000 Zeichen, der begrenzte Heartbeat-Request auf 128 KiB. Server und Publisher müssen vor Plugin 2.8.6 aktualisiert sein.

## Hauptdateien
- Plugin: `Services/RpgTankCatalog.cs`, `Services/RpgTankCombat.cs`, vorhandene Charakter-, Heilungs-, Boss-, Gruppen-, Loot- und Speicherwege.
- Protokoll: `Sync/src/SnapshotProtocol/SnapshotMessage.cs`, `CombatRewardReceipt.cs`; Backend-Heartbeat und Publisher-Fähigkeiten.
- Oberfläche: `CodexCharacter.tsx`, `GraphicalApp.tsx`, `remote/model.ts`, `types.ts`, `LootPreview.tsx`, `CombatRewardPopup.tsx`, Itemmanifeste und CSS.

## Validierung
1.240 Plugin-Tests, 282 Server-/Publisher-Tests, 183 Oberflächentests bestanden. Die schmalen Twitch-Panel- und Mobilansichten bestehen beide Browserprüfungen einschließlich Mythic-Bildern und Navigation. Neue Tanktests prüfen Setgrenzen, Duplikate, Blocklimit, Barrieren, Rettung, gespeicherte Cooldowns, Avatarablauf, Ausrüstungswechsel, Mehrtank-Umleitung und getrennte Endgame-Pools.

## Grenzen
Zeitbasierte Effekte werden bei vorhandenen Kampfaktionen ausgewertet; sie starten keinen zusätzlichen Hintergrundkampf. Der Avatar wird als aktives Statusbild mit Restzeit angezeigt, nicht als animierter Austausch des Ottermodells. Dungeon-Fundortlinks öffnen den Dungeonbereich; die konkrete Gruppe und Schwierigkeit wählt der Spieler dort selbst. Live-Balance muss anschließend mit echten Gruppen beobachtet werden.
