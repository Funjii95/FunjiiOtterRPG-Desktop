# Masterprompt – Entwicklungsstand

Stand: 26.10.2026. Auftrag: 2f3c6426-fc90-46f4-85ce-36b3bf53a915/Eingefügter Text.txt.
Aktuelle Nutzerkorrektur: Windows-App weiterentwickeln; keine weitere eigenständige Browser-Webseite. Der Windows-Host verwendet weiterhin WebView2. Ein Wechsel seiner Anzeige-Engine ist nicht Teil dieser Anbindung.

Mit ausdrücklicher Freigabe des Nutzers („brings online“) am 26.10.2026 veröffentlicht: Windows 0.9.0 / Plugin 2.8.0 und anschließend Korrekturpatch Windows 0.9.1 / Plugin 2.8.1. Backend und Publisher aktualisiert und gesund geprüft; Publisher akzeptiert Projektion 12 sowie 2–11. Nicht lokal installiert. Twitch-Hosting und Aktivierung bleiben zurückgestellt.

## Funktionen

1. Automatische Bosszuordnung: Kampfkraft mit begrenztem Einfluss einzelner Extremwerte, persönliche HP und Teilnahmbelohnungen implementiert. Ein globaler Sieg tötet keinen noch lebenden persönlichen Boss. Tests bestanden; Live-Balancing ausstehend.
2. Anfänger-Legendaries: 20 Nichtset-Items für alle acht vorhandenen Slots, Stufenanforderungen, Fundorte und echte Effekte implementiert. 20 individuelle Bilder erzeugt, Originale aufbewahrt und Laufzeitbilder visuell geprüft. Katalog-/Effekt-/Drop-Tests bestanden.
3. Gruppen: Erstellen, Einladen, Annehmen, Ablehnen, Verlassen, Entfernen, Leitung übertragen und Auflösen implementiert. Gemeinsame Tauch-/Boss-/Dungeoninstanzen jetzt mit der Windows-Oberfläche verbunden. Twitch-Namenseinladungen, atomare gemeinsame Speicherung mit Konten, individuelle einmalige Belohnungen und persistente Gruppenreplikate. Konkurrenz-, Rollback-, Wiederholungs- und Neustarttests bestanden. Balance-/Lasttests mit vier echten Spielern bleiben ausstehend.
4. Gruppenheilung: Rollenheilung, effektive Heilstatistik, Bedrohung, vorhandene Heiler-Sets und begrenzte Überheilungsschilde implementiert. Heilen belebt nicht wieder. Weitergabe berücksichtigt nur echte Eigenheilung; Gruppenheilung erzeugt keine weiteren Weitergabeketten. Rollen-/Gruppenheilung geprüft; sämtliche Setkombinationen noch nicht einzeln getestet.
5. Statistiken: persistentes begrenztes Modell, Projektion 11 und eigener Reiter. Neue Gebietstauchgänge, Feinde, Treffer, Fische, Materialien, Perlen, Heilung, Zerlegen, regionale Bosse sowie Gruppen-/Dungeonereignisse erfasst. Keine erfundene Historie. Vollständige Abdeckung alter nichtregionaler Bosswege noch offen.
6. Materialnavigation: Fehlmengen, tatsächliche konfigurierte Quellen/Chancen, Gebietsauswahl ohne automatischen Start, Hervorhebung und Rückkehr zur gleichen Aufwertung implementiert und durchgängig geprüft.
7. Rollen: gespeicherte Tank-/Heiler-/Schadenswahl, echte Werteboni, Bedrohung, Heilung, Schutz und Angriffsruf implementiert und angebunden. Rollenwechsel während laufender Boss-/Gruppen-/Dungeonkämpfe gesperrt.
8. Dungeons: drei Instanzen mit sieben Begegnungen, zwei Zwischenbossen und einem Endboss. Normal/Heroisch/Mythisch, automatischer Ablauf im Plugin mit Pause/Fortsetzen, Solo-/Gruppenstart, gemeinsame HP, angekündigte Fähigkeiten/Unterbrechen, Adds, Phasen, Lagererholung, Niederlage/Abbruch/Ablauf und individuelle Beute implementiert und angebunden. Alle drei Schwierigkeiten mit synthetischem Solo-Profil vollständig durchlaufen, Neustart und doppelte Belohnung geprüft. Vorhandene passende Gebiets-/Kreaturen-/Bossbilder werden verwendet. Exklusive Dungeonmaterialien registriert; eigener Handwerksverbrauch dafür noch offen. Kein abschließend freigegebenes Live-Balancing.
9. Heilung: passiv 2 % MaxHP pro Minute und Chat 10 % MaxHP mit 30 Sekunden Cooldown; Nachkommarest, Nachholen, Neustart und Schutz vor Wiederbelebung geprüft. Sushi/Perks bleiben unabhängig. Explizites Ausruhen ist eine separate Aktion.

Zusätzlich: EP innerhalb des aktuellen Levels mit tatsächlichen Servergrenzen, Fortschrittsbalken und Anzeige der Maximalstufe.

## Anbindung und Prüfungen

partyCombat verwendet das bestehende autorisierte Aktionsjournal. Operationen, Ziele, Dungeon-IDs und Schwierigkeiten werden im gemeinsamen Vertrag geprüft. Heilung/Schaden/Beute werden vom Plugin berechnet. dungeonStatus liefert Übersicht und aktuellen Gruppenstand. Kampfbestätigungen übernehmen das gespeicherte Profil und die Werte sofort in die Oberfläche. Gemeinsame Kämpfe blockieren parallele Soloausflüge.

- Plugin-Gesamtlauf: 1.192 Tests bestanden. Nach Releaseversionsanpassung auch der GitHub-Release-Lauf erfolgreich. Zusätzlicher Schutz beim Verlassen einer Instanz entfernt alle gespeicherten Mitgliedszuordnungen; Neustarttest bestanden.
- Backend: 273 Tests bestanden.
- Oberfläche: 171 Tests bestanden; Windows-Build erfolgreich.
- Windows-Hülle: 16 Tests bestanden; nativer Starttest mit gebündelter Oberfläche und den neuen Gruppen-/Dungeon-Reitern erfolgreich.
- Vor der Browser-Korrektur des Nutzers: zwei Chromium-Tests bestanden, einschließlich Dungeonstart, gemeinsamem HP-Update, Unterbrechen und 500-Pixel-Ansicht. Weitere Browserentwicklung eingestellt.

Belege liegen lokal unter artifacts/, insbesondere masterprompt-plugin-tests.log, dungeon-final-tests.log, masterprompt-backend-tests.log und masterprompt-native-smoke/result.txt. Keine dieser Prüfungen verändert produktive Spielstände.

## Folgepatch 0.9.1 / 2.8.1

Veröffentlicht und geprüft. Automatische Kämpfe einschließlich Heilung/Unterbrechen/Lager, Twitch-Namenseinladung und echte fünfsekündige Beutepopups implementiert. Verbindungsfehler durch Firestore-Lesesperren repariert. Aktuelle Prüfung: 1.199 Plugin-, 273 Backend- und 173 UI-Tests. Belege und Live-Revisionen siehe RELEASE-0.9.1.md. Live-Balancing mit echten Vierergruppen und die genannten sonstigen Restpunkte bleiben offen.


## Folgepatch 0.9.2 / 2.8.2 – vorbereitet

Tauchserien 10/20/100 mit fortlaufenden HP, Stop bei 0 HP und persistierter Beute; globale Fünf-Sekunden-Zusammenfassung; deutlich erhöhte Dungeon-EP und Sonnenlagunen-Beute; Größenfehler des Cloud-Senders nach langen Dungeons reproduziert und korrigiert. 1.213 Plugin-, 273 Backend-, 176 UI- und 16 Windows-Tests bestanden. Noch nicht veröffentlicht oder installiert. Details und Aktivierungsreihenfolge: RELEASE-0.9.2.md. Live bleibt der oben dokumentierte Patch 0.9.1 / 2.8.1.
