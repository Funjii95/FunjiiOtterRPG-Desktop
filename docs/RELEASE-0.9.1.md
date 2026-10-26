# Veröffentlichung 0.9.1 / 2.8.1 – 26.10.2026

Die Folgeaufträge zum laufenden, ausdrücklich freigegebenen Update sind abgeschlossen: automatische Dungeons, Twitch-Namenseinladungen, Beutepopup und Verbindungsreparatur.

- Windows: https://github.com/Funjii95/FunjiiOtterRPG-Desktop/releases/tag/v0.9.1 (78ce9d8).
- Plugin: https://github.com/Funjii95/RaidClipPlugin/releases/tag/v2.8.1 (157c7ea).
- GitHub-Prüfungen/Veröffentlichung erfolgreich: Windows 40255122860; Plugin 40255029306.
- Öffentliche Updatefeeds bestätigen beide Versionen. Plugin-Manifest und ZIP-Prüfsumme stimmen überein; Download HTTP 200.
- Backend: funjii-otter-rpg-backend-test-partyauto-b6c331b9d5, Tags desktop und rc1.
- Publisher: funjii-otter-rpg-publisher-test-partyauto-da620cbe48, Tag rc1.
- Gesundheitsprüfungen erfolgreich. Geschützter Publisher-Aufruf bestätigt Projektion 12 und Unterstützung für 2–11. Alte optionale Gruppenfelder behalten ihre bisherigen Inhaltsprüfsummen. Datenziele, Rechte und Datenschutzfreigaben unverändert.
- Fehlerursache der Verbindungsabbrüche: Firestore-Abbrüche wegen konkurrierender Transaktionen bei Statusabfragen. Lesende Belegabfragen und leere Warteschlangen-Abfragen nehmen keine Schreibtransaktionen mehr. Der erste Serverhotfix war bereits vor dem Paketpatch aktiv; auf der reparierten Revision wurden beim Prüfen keine HTTP-500-Antworten mehr gefunden.
- Neue Dungeons starten automatisch. Heilung, Schutz, Unterbrechen, Lager und weitere Begegnungen laufen im Plugin, bis Sieg, Niederlage, Pause, Abbruch oder Ablauf. Keine Endlosschleife mit automatisch neu gestarteten Dungeons.
- Beutebelege entstehen atomar mit der tatsächlichen Belohnung und enthalten nur erhaltene Beute. Das Popup vergibt selbst nichts.

Prüfungen: 1.199 Plugin-Tests, 273 Backend-Tests, 173 UI-Tests bestanden. Automatischer vollständiger Solo-Dungeon mit jeder Rolle; gemischte Zweiergruppe mit Heilung/Schutz/individuellen Belohnungen; Pausen-/Neustart-/Wiederholschutz; Twitch-Namensauflösung; temporärer Serverfehler mit gleicher Sitzung; alte Projektion und Fünf-Sekunden-Popup. Windows-Paketierung und nativer Starttest auch im GitHub-Lauf erfolgreich.

Lokaler UI-Nachweis über synthetische native Windows-API-Brücke: `node tools/dungeon-auto-ui-smoke.mjs`. Bilder/Ergebnis unter artifacts/dungeon-auto-ui/. Keine produktiven Spielaktionen zum Testen ausgeführt. Kein neuer Twitch-Hosting-Upload, keine lokale Installation. Beide Programme aktualisieren; bei einem bereits laufenden älteren Dungeon einmal Autokampf fortsetzen wählen.
