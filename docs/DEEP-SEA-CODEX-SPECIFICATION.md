# CODEX MASTERPROMPT – DEEP SEA CODEX WINDOWS REDESIGN

Repository: https://github.com/Funjii95/RaidClipPlugin

## Ziel

Überarbeite ausschließlich die Benutzeroberfläche der Windows-Version des Funjii Otter RPG im Stil „Deep Sea Codex“.

Erstelle eine moderne, hochwertige Desktop-RPG-Oberfläche mit dunkelblauer Unterwasserwelt, dezenten goldenen Ornamenten, türkisfarbenen Leuchteffekten und klar lesbaren Inventar- und Charakterfenstern.

**Wichtig: Die bestehenden Funktionen müssen erhalten bleiben. Das Redesign soll keine neue RPG-Engine und kein paralleles Inventarsystem einführen.**

## 1. Vorhandenes Projekt untersuchen

Vor Beginn:

- Windows-UI-Framework und Projektstruktur identifizieren.
- Bestehende Ansichten und Navigation erfassen.
- Aktuelle RPG-Datenmodelle und Services untersuchen.
- Vorhandene Inventar-, Charakter-, Itemset-, Upgrade- und Materialfunktionen ermitteln.
- Bereits integrierte Eternal- und Divine-Definitionen wiederverwenden.
- Bestehende Ressourcen, Styles und Komponenten identifizieren.

Keine Technologieumstellung ohne Notwendigkeit.

## 2. Grundlayout

Die Windows-Anwendung erhält drei Hauptbereiche.

### Kopfzeile

Permanent sichtbar:

- Funjii Otter RPG – Deep Sea Codex
- Spielername und Avatar
- Charakterlevel und EXP-Balken
- Normale Perlenwährung
- Verbindung zum Backend
- Benachrichtigungen
- Einstellungen
- Windows-Fenstersteuerung

Keine erfundenen zusätzlichen Währungen anzeigen.

### Linke Navigationsleiste

Exakt diese zehn Hauptreiter in folgender Reihenfolge:

1. Abenteuer
2. Charakter
3. Waffen
4. Ausrüstung
5. Inventar
6. Aufwertung
7. Materialien
8. Sammlungen
9. Itemsets
10. Boss

Jeder Reiter besitzt ein passendes Icon und eine aktive Hervorhebung.

„Einstellungen“ separat am unteren Ende der Navigation anzeigen.

Die Navigation bleibt beim Seitenwechsel bestehen.

### Hauptbereich

Der Hauptbereich verändert sich abhängig vom gewählten Reiter.

Bei 1920×1080 soll die gesamte verfügbare Fläche sinnvoll genutzt werden.

Unterstütze kleinere Fenstergrößen durch flexible Layouts und Scrollbereiche.

Keine überlappenden oder abgeschnittenen Steuerelemente.

## 3. Abenteuer

Erstelle eine übersichtliche Abenteuerzentrale mit:

- Gebietsauswahl für Tauchen
- Gebietsauswahl für Angeln
- Aktuellem Cooldown
- Verfügbaren Aktivitäten
- Letzten Beutefunden
- Heist und Wettrennen
- Besonderen Ereignissen

Die zehn geplanten Unterwassergebiete darstellen, sofern sie bereits implementiert sind.

Angeln und Tauchen dürfen keine Perlenkosten mehr anzeigen, sobald die kostenfreie Gebietslogik im Backend aktiv ist.

Keine neue Tauchdauer-, Sauerstoff- oder Energieverwaltung einführen.

## 4. Charakter

Dies ist die zentrale Charakteransicht und soll dem zuletzt abgestimmten Mockup entsprechen.

### Mitte

Große Otter-Charakterillustration mit Ausrüstung.

### Ausrüstungsslots

Exakt folgende acht Slots sichtbar:

- Helm
- Brust
- Handschuhe
- Stiefel
- Waffe
- Amulett
- Ring links
- Ring rechts

**Der Waffenslot muss direkt neben dem Charakter sichtbar sein.**

Es darf nicht nur einen separaten Waffenreiter geben.

Keine Bein- oder Schulterslots erfinden.

### Charakterwerte

- Angriff
- Leben
- Rüstung
- Krit-Chance
- Krit-Schaden
- Doppelangriff
- Ausweichen
- Boss-Schaden
- Luck
- Heilung
- Weitere tatsächlich vorhandene Stats

Werte inklusive ausgerüsteter Items, Upgrade-Stufen, aktiver Setboni und Buffs berechnen.

## 5. Waffen

Erstelle einen vollständigen Waffenverwaltungsbereich.

- Waffenliste
- Suche und Filter
- Seltenheitsanzeige
- Waffenkategorie
- Einzelattribute
- Einzigartige Effekte
- Upgrade-Stufe
- Ausrüsten
- Vergleichen

Nur Waffentypen anzeigen, die das vorhandene Spielsystem tatsächlich unterstützt.

Keine Runen-, Transmog- oder Sockelsysteme neu implementieren, sofern diese nicht bereits existieren.

## 6. Ausrüstung

Eigenständige Verwaltungsansicht für alle Rüstungsteile und Schmuckgegenstände.

- Filter nach Equipment-Slot
- Filter nach Seltenheit
- Itemgrid
- Itemdetails
- Vergleich mit aktuell ausgerüstetem Item
- Aktive Setzugehörigkeit
- Statveränderung vor Ausrüstungswechsel
- Ausrüsten und Ablegen

Der Waffenreiter und das Ausrüstungsfenster müssen auf denselben Spielerzustand zugreifen.

## 7. Inventar

Großzügiges Inventarraster mit:

- Itembildern
- Seltenheitsrahmen
- Stapelmengen
- Suche
- Kategorien
- Sortierung
- Itemdetails
- Vorhandenen Zerlegefunktionen

Keine Gegenstände anhand ihrer UI-Position identifizieren. Stabile Iteminstanz-IDs verwenden.

## 8. Aufwertung

Vollständige Integration des vorhandenen Systems +0 bis +9.

- Gegenstand auswählen
- Aktuelle Stufe anzeigen
- Nächste Stufe anzeigen
- Festgelegte Statverbesserung anzeigen
- Normale Perlenkosten
- Benötigte Materialien
- Materialbestand
- Upgrade-Button
- Endveredelung bei +9

**Upgrades sind immer garantiert erfolgreich.**

Keine Erfolgswahrscheinlichkeit und keine Fehlschlagsanzeige einführen.

Divine-Ausrüstung als „Nicht aufwertbar“ kennzeichnen.

Eternal-Ausrüstung darf nach den gültigen Kostenregeln aufgewertet werden.

Bereits vorhandene Backend-Transaktionslogik verwenden.

## 9. Materialien

Eigenständiger Materialreiter für die elf zuvor definierten Aufwertungsmaterialien.

Darstellen:

- Itembild
- Materialname
- Seltenheit
- Besitzmenge
- Beschreibung
- Fundorte
- Verwendungszweck

Normale Perlenwährung nicht als Upgrade-Material behandeln.

Die rote, blaue und weiße Perle sind separate Inventarmaterialien.

## 10. Sammlungen

Erstelle eine Schatzsammlungsansicht.

Jedes Sammelartefakt zeigt:

- Bild
- Name
- Seltenheit
- Fundort
- Menge 0/5 bis 5/5
- Fortschrittsanzeige

Gesamtfortschritt dynamisch aus registrierten Sammelartefakten berechnen.

Keine fest codierte Anzahl von zehn Artefakten verwenden.

Nicht entdeckte Artefakte optional als Silhouetten darstellen.

## 11. Itemsets

Erstelle eine umfangreiche Setübersicht.

Unterstütze bestehende und neue Setarten:

- Klassische 4er-Sets
- Legendäre 6er-Sets
- Wahre Sets
- Abyss-Sets
- Eternal-Sets
- Divine-Set

Setfortschritt mit jeweils korrekten Schwellen anzeigen.

**Eternal und Divine besitzen Seteffekte bei 1/2/3/4/5/6 Teilen.**

Bestehende 2/3/4- oder 2/4/6-Sets behalten ihre aktuellen Schwellen.

Aktive Boni hervorheben, inaktive Boni gedimmt darstellen.

Pro Set:
- Name
- Seltenheit
- Liste der enthaltenen Items
- Ausgerüstete Teile
- Verbleibende Teile
- Alle Seteffekte

## 12. Boss

Erstelle eine Boss-Übersicht mit:

- Aktuellem oder nächstem Boss
- Bossbild
- Bossname
- HP
- Level
- Kampfstatus
- Teilnehmern
- Schaden
- Belohnungen
- Vorhandenen Angriffs- und Teilnahmefunktionen

Die tatsächlichen Bosszustände aus dem Backend verwenden.

Keine simulierten HP-Werte oder Countdown-Timer im produktiven Modus anzeigen.

## 13. Eternal und Divine – Visuelle Integration

### Eternal

Farbe: `#FFF2A8`

- Hellgelbe Seltenheitsrahmen
- Dezenter gelber Leuchteffekt
- Eigenes Eternal-Symbol
- Anzeige aller sechs möglichen Setboni
- Normale Upgrade-Möglichkeiten

Sets:
- Sternenjäger des Urmeers
- Gezeitensegen der Ewigkeit
- Zorn der Ewigen Urtiefe

### Divine

Farbe: `#FFD700`

- Prunkvoller goldener Rahmen
- Weißgoldene Lichtpartikel
- Eindeutige Kennzeichnung „ADMIN ONLY“
- Keine Upgrade-Möglichkeit
- Keine Zerlege- oder Handelsfunktion

Set:
- Erhabenheit der Unendlichkeit

Die vorhandenen Itemdefinitionen und Statwerte verwenden.

**Keine neuen Itemwerte oder Seteffekte aus generierten Mockup-Bildern übernehmen.**

## 14. Einheitliches Designsystem

Erstelle wiederverwendbare UI-Komponenten:

- Navigationseintrag
- Inventarslot
- Equipment-Slot
- Itemtooltip
- Seltenheitsrahmen
- Statzeile
- Fortschrittsbalken
- Setbonus-Anzeige
- Materialkostenanzeige
- Bestätigungsdialog
- Fehlermeldung
- Ladezustand
- Leere Inventaransicht

Visuelle Vorgaben:

- Hintergrund: dunkles Tiefseeblau
- Sekundärflächen: Marineblau
- Aktive Auswahl: Türkis/Cyan
- Rahmen: dezentes Gold
- Text: Cremeweiß
- Starke Kontraste und gut lesbare Schriften
- Ornamente primär an Fensterrändern
- Keine überladenen Hintergrundeffekte hinter Zahlen oder Tooltips

Seltenheitsfarben zentral aus dem bestehenden Rarity-System beziehen.

## 15. Technische Regeln

- Keine neue getrennte Spielstandsdatenbank.
- Kein zweites Inventarsystem.
- Keine lokalen Kopien als autoritative Spielerdaten.
- Vorhandene Backendservices weiterverwenden.
- Bestehende Windows-Adminfunktionen erhalten.
- Keine neuen Adminberechtigungen allein durch UI-Sichtbarkeit erteilen.
- Vorhandene Cloud-Synchronisation nicht unterbrechen.
- Bestehende Twitch Extension nicht redesignen.

Die Windows-Oberfläche darf den tatsächlichen Spielfortschritt weder zurücksetzen noch eigene Spielregeln einführen.

## 16. Implementierungsablauf

1. Bestehende Windows-Architektur analysieren.
2. Gemeinsames Designsystem erstellen.
3. Neue Hauptnavigation implementieren.
4. Charakteransicht mit Waffenslot erstellen.
5. Waffen- und Ausrüstungsansichten anbinden.
6. Inventar übernehmen.
7. Upgrade- und Materialansichten integrieren.
8. Sammlungen und Itemsets integrieren.
9. Abenteuer- und Bossansichten übernehmen.
10. Eternal- und Divine-Darstellung vervollständigen.
11. Responsive Fenstergrößen prüfen.
12. Automatisierte Tests ausführen.

## 17. Qualitätssicherung

Prüfe insbesondere:

- Alle zehn Navigationsreiter funktionieren.
- Waffenslot am Charakter vorhanden.
- Beide Ringslots funktionieren.
- Keine falschen Equipment-Slots.
- Items behalten ihre Instanz-IDs.
- Eternal-Farbe korrekt.
- Divine-Farbe korrekt.
- Divine nicht aufwertbar.
- Upgrade-Kosten werden korrekt geladen.
- Alle Setboni korrekt angezeigt.
- Materialbestände stimmen mit Backend überein.
- Sammlungsmengen maximal 5/5.
- Keine doppelten Ausrüstungsboni.
- Adminfunktionen bleiben geschützt.
- Bestehende Spielstände werden korrekt geladen.
- Anwendung funktioniert bei verschiedenen Fenstergrößen.

## 18. Ergebnis

Liefere:

- Fertig integriertes Windows-Redesign
- Liste geänderter Dateien
- Beschreibung der neuen Komponenten
- Tatsächlich ausgeführte Tests
- Hinweise auf nicht vorhandene Backend-Funktionen
- Screenshots der implementierten Ansichten, sofern möglich

Keine Testergebnisse erfinden.

**Kein automatisches Deployment, kein produktives Update und keine Veröffentlichung ohne gesonderten Auftrag.**

Oberste Priorität: Das neue Deep-Sea-Codex-Design soll die bestehende Windows-Anwendung visuell modernisieren, ohne bereits funktionierende RPG-Systeme zu beschädigen.