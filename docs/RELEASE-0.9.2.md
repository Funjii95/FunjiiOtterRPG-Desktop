# Patch 0.9.2 / 2.8.2 – vorbereitet am 26.10.2026

Status: implementiert und lokal geprüft; noch nicht veröffentlicht, keine produktive Cloud-Änderung oder lokale Installation. Bisher live bleiben Windows 0.9.1, Plugin 2.8.1 und Projektion 12. Die produktive Aktualisierung benötigt die ausdrückliche Freigabe gemäß Regel 8 des Multiplayer-Masterprompts.

## Inhalt

- 10/20/100 echte Tauchgänge im Plugin, kein Client-Klickloop. Fortlaufende HP, normale Abklingzeiten; stoppt bei 0 HP oder manueller Beendigung. Jede einzelne Auswertung samt Serienfortschritt und Belohnung wird atomar gespeichert und gegen Wiederholung geschützt. Offline-Zeiten werden nicht als zusätzliche Tauchgänge nachgeholt. Vor Überlauf des Übertragungslimits stoppt die Serie unter Erhalt vorheriger Belohnungen.
- Zusammenfassung mit Gesamtschaden, Mengen, EP und Bildern für Gegenstände/Materialien. Abschluss-Popup bleibt fünf Sekunden sichtbar, auch in einem anderen Reiter, ohne erneute Auszahlung oder wiederholtes Anzeigen nach Aktualisierung.
- Dungeon-EP: Normal 50 %, Heroisch 75 %, Mythisch 100 % einer aktuellen Levelstufe, mindestens 10.000 EP vor vorhandenen Setboni. Eigene konfigurierbare EP-Regeln, unveränderte Perlenberechnung.
- Sonnenlagune: dreifache Kampf-EP; +15 Prozentpunkte reguläre Ausrüstung, +10 Prozentpunkte Materialien, +5 Prozentpunkte Anfänger-Legendäre. Boni konfigurierbar, Chancen begrenzt auf 100 %. Regions-Mimics behalten exakt 50 % Ausrüstung.
- Neutrale Autokampf-Statuszeile.

## Cloud-Ursache und Korrektur

Der reale lokale Kontostand wurde nur gelesen. Seine 972 internen Aktionsbelege ließen den unbereinigten Transportumschlag auf 262.202 Bytes wachsen: 58 Bytes über dem bestehenden 262.144-Byte-Limit. Der Worker prüfte diese Größe vor dem Entfernen der privaten Felder und hielt mit der allgemeinen Konfliktmeldung an. Es wurde kein Revisionskonflikt durch Überschreiben oder Zurücksetzen umgangen.

Neue lokale Projektion entfernt private Belege vor der Transportprüfung; die Belege selbst bleiben vollständig im lokalen Speicher. Netzwerk-Eingang, Nachrichtengrenze, Sender- und Revisionsschutz bleiben streng. Worker, Status, Quest- und Admin-Prüfungen verwenden den lokalen Weg. Lesende Prüfung des betroffenen realen Spielstands gelingt; der letzte Outbox-Hash bleibt unverändert. Die laufende Installation erhält diese Korrektur erst mit dem Patch und anschließendem Neustart.

Projektion 13 ergänzt die optionale persistierte Tauchserie. Alte Spielstände ohne dieses Feld behalten ihre Darstellung/Prüfsumme; Publisher akzeptiert weiterhin Projektionen 2–12. Vor der Plugin-Veröffentlichung die bestehenden Backend-/Publisher-Dienste auf 13 aktualisieren und prüfen; keine Datenziele ändern und keine Baselines neu setzen. Twitch-Hosting bleibt zurückgestellt.

## Prüfung

- 1.213 Plugin-Tests: Gesamtlauf artifacts/2.8.2-release-final-tests.log.
- 273 Backend-Tests: artifacts/2.8.2-backend-tests.log.
- 176 UI-Tests: artifacts/0.9.2-ui-tests-final.log.
- 16 Windows-Tests, erfolgreicher Windows-Build und nativer Starttest: artifacts/native-0.9.2-smoke/result.txt.
- Native API-Brücke mit simulierten isolierten Konten: tools/dive-series-ui-smoke.mjs. Start einer 100er-Serie, Niederlage nach drei Tauchgängen, globales Popup in anderem Reiter, korrekte Mengen/Biom-Bild, fünf Sekunden Sichtbarkeit und kein zweites Popup: artifacts/dive-series-ui/result.txt und rewards.png.
- Bestehender Dungeon-/Einladungs-/Belohnungstest: tools/dungeon-auto-ui-smoke.mjs.

Keine produktiven Spielaktionen wurden zu Testzwecken ausgeführt. Reale Last-/Balanceprüfung mit einer Spielergruppe bleibt nach Freigabe ausstehend.
