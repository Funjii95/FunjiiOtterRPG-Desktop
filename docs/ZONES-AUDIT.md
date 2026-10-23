# Ist-Zustand vor der Gebietskorrektur

Geprüft: RpgAdventureService, RpgEnemyService, RpgFishingService, RpgLootService,
RpgDepthsLootService, RpgMaterialLootService, GraphicalApp, RemoteRpgExecutor,
SnapshotProtocol und Backend/Players. Stand: 23.10.2026, vor Implementierung der zehn Gebiete.

## Bereits funktionsfähig

- Chat, Windows und Twitch verwenden denselben autoritativen Plugin-Spielstand.
- Der Store speichert Aktionen atomar und verhindert Wiederholung erfolgreicher Aktionen.
- HP, Gegnerkämpfe, EXP, Fischsammlung, Sushi, Materialien, Inventar und beide Ringslots bestehen.
- Cooldowns und Spielstände werden gespeichert und über Firestore projiziert.
- Adminaktionen prüfen die authentifizierte Kanalinhaber-ID in Backend und Plugin.

## Fehlend oder abweichend

- Keine veröffentlichte Gebietsauswahl oder Gebietstabelle. Der neue, noch unveröffentlichte
  Eternal-Entwurf enthielt zunächst nur einen vorbereiteten AdventureArea-Wert. Dieser wird
  durch die verbindlichen getrennten Felder SelectedDivingZone und SelectedFishingZone ersetzt.
- Gegner werden bisher aus fünf Einsatzstufen ausgewählt, ohne feste Gebietslevel.
- Tauchbeute, Fischpool und Materialtabellen hängen bisher nicht vom Gebiet ab.
- Einsätze sind in der Abenteueransicht auswählbar; kostenlose Gebietsausflüge sind noch nicht verbindlich.
- Gewöhnliche Tauchrollen und Angeln können bisher Ausrüstung erzeugen.
- Die unabhängigen True-/Cursed-/Abyss-Zusatzrollen sind nicht an die geforderten Gebietssiege gebunden.
- Entdeckte Mimics starten bisher einen separaten globalen Boss, ohne Herkunftsgebiet.
- Die Oberfläche zeigt keine zehn verbindlich angebundenen Gebietskarten.

## Korrekturrichtung

Eine gemeinsame Gebietstabelle erweitert die bestehenden Dienste. Auswahl und Ergebnis bleiben
in den bisherigen Transaktionen, Cooldowns und Projektionen. Ausrüstung wird ausschließlich
beim autoritativen Kampfabschluss vergeben. Passive Bonusrollen werden ausdrücklich ohne
Ausrüstung und ohne rekursive Kampf- oder Eternal-Rollen ausgeführt. Bestehende Spielstände
ohne Auswahl verwenden Sonnenlagune; unbekannte IDs werden zurückgewiesen.
