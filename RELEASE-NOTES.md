# Windows 0.9.6 / Plugin 2.8.6 – Tanksets und Itemgrafiken

- 27 neue Tankgegenstände: drei Einstiegsbrustpanzer und drei vollständige Sets mit je acht Teilen.
- Korallenbollwerk (Legendary), Abyss-Sentinel (Mythic) und Ewiger Leviathan (Eternal).
- Zusätzlicher Gürtelplatz; bisherige Waffen, Ringe und Ausrüstung bleiben erhalten.
- Blocken, Tankbarrieren, Aggro, Gruppenschutz, Rettung bei tödlichem Schaden und Leviathan-Avatar mit gespeicherten Abklingzeiten.
- Mythic erhält einen orangefarbenen Seltenheitsrahmen. Alle 27 Tankitems besitzen eigene Bilder; drei Setvorschaubilder und fünf Effektbilder ergänzen die Anzeige.
- 54 ältere Itembilder durch vollständig sichtbare, individuelle Motive ersetzt. Rahmen verwenden die tatsächliche Seltenheit des Gegenstands.
- Größere Katalogübertragung und kompatibles Speicherschema für die neuen Gegenstände.
- Sentinel und Leviathan: zusätzlicher Tankloot-Wurf in mythischen Dungeons ab Stufe 80 bzw. 99. Korallenbollwerk: Gebietskämpfe ab Stufe 50.

# Windows 0.9.5

- Zwölf neue Einzelbilder für Abgrundjäger und Korallenorakel.
- Quadratische Itembilder mit passenden goldenen Seltenheitsrahmen in der Setübersicht.
- Ring-Beschriftung in der Setübersicht korrigiert.
- Passender Plugin-Patch 2.8.5 korrigiert automatische Bosszuweisung und persönliche Boss-HP für starke Ausrüstung.

# Version 0.9.4 – Mehr Inventarplatz und neue Itemgrafiken

- Verdoppeltes Speicherbudget für Spielstände und größere Inventarantworten. Gegenstände und Aufwertungen bleiben erhalten.
- Sammelschätze erscheinen getrennt unter Sammlungen, auch in der Charakteransicht werden sie nicht mehr als Ausrüstung angezeigt. Bereits vorhandene Alte Muscheln bleiben dort erhalten.
- Alte Muschel aus den Beutekonfigurationen entfernt; zu öffnende Muscheln bleiben verfügbar.
- Rollenauswahl beim Erstellen einer Gruppe und beim Annehmen einer Einladung; die bestätigte Rolle gilt für den Kampf.
- Farbige Rahmen für alle zehn Seltenheiten. Neue individuelle Questgegenstandsnamen und 119 neue Cursed-/Abyss-/Questset-Icons.
- Schnellere Aktionsabholung und Ergebnisübertragung durch begrenzte wartende Serveranfragen. Wiederholschutz und Speicherung bleiben erhalten.

Benötigt Plugin 2.8.4 sowie den aktualisierten Backend- und Snapshot-Publisher. Beide Programme gemeinsam aktualisieren.

# Version 0.9.3 – Sofortiges Mehrfachtauchen und Credits

- 10, 25, 50 oder 100 Tauchgänge werden sofort gemeinsam im Plugin simuliert. Keine Tauchpausen zwischen den Würfen; bestehende Abklingzeit wird vor dem Start geprüft und danach gilt eine normale Tauchpause.
- HP und erlittener Schaden zählen innerhalb der Simulation fortlaufend. Bei 0 HP endet sie. Alle bis dahin verdienten Belohnungen werden gemeinsam gespeichert und im fünfsekündigen Abschluss-Popup angezeigt.
- Eine gemeinsame Speicherung mit Wiederholschutz. Speicherfehler rollen die gesamte noch nicht gespeicherte Simulation zurück; beim Wiederholen gibt es keine doppelte Beute.
- „Programmed by Codex“ unter Einstellungen sowie verständliche Hinweise zur KI-unterstützten Entwicklung und zu teilweise KI-generierten, fiktionalen Spielgrafiken. Ein dezenter Hinweis am unteren Fensterrand führt direkt zu den Details.

Benötigt Plugin 2.8.3 und Publisher-Projektion 14. Beide Programme gemeinsam aktualisieren. Vorhandene 20er-Tauchserien bleiben lesbar und werden mit ihren verbleibenden Tauchgängen gemeinsam abgeschlossen; neu stehen 10/25/50/100 zur Auswahl.

# Version 0.9.2 – Tauchserien und mehr Beute

- 10, 20 oder 100 Tauchgänge automatisch im Plugin. Fortlaufende HP, normale Tauchpausen und automatische Beendigung bei 0 HP. Jeder abgeschlossene Tauchgang speichert seine Beute sofort; kein Verlust bei Abbruch oder Neustart.
- Fortschritt, erlittener Gesamtschaden, Perlen, EP und Gegenstände/Materialien mit Mengen. Gemeinsames Abschluss-Popup für fünf Sekunden, auch wenn gerade ein anderer Reiter offen ist. Manuelles Beenden jederzeit möglich.
- Dungeonabschluss: Normal 50 %, Heroisch 75 %, Mythisch 100 % einer aktuellen Levelstufe, mindestens 10.000 EP vor vorhandenen Setboni. Perlenbelohnungen unverändert.
- Sonnenlagune: dreifache Kampf-EP; zusätzlich 15 Prozentpunkte reguläre Ausrüstungschance, 10 Prozentpunkte Materialchance und 5 Prozentpunkte Chance auf legendäre Anfängerbeute, jeweils höchstens 100 %. Regions-Mimics behalten ihre 50-%-Ausrüstungschance.
- Cloud-Abbruch nach längeren Dungeons behoben: interne Wiederholschutzbelege werden vor der Größenprüfung vom übertragenen Spielstand getrennt. Keine Löschung von Belegen, Gegenständen oder Fortschritt; keine automatische Überschreibung eines abweichenden Serverstands.
- Neutrale Statusanzeige „Automatischer Kampf läuft“.

Benötigt Plugin 2.8.2 und Publisher-Projektion 13. Windows-App und Plugin gemeinsam aktualisieren und neu starten. Bestehende Spielstände und Aufwertungen bleiben erhalten.

# Version 0.9.1 – Automatische Dungeons

- Dungeon einmal starten: Angriffe, Heilung, Schutz und Unterbrechungen laufen im Plugin automatisch, auch bei geschlossenem Dungeon-Reiter.
- Die Gruppe erholt sich zwischen Begegnungen am Lager und setzt den Dungeon selbstständig fort. Die Gruppenleitung kann jederzeit pausieren, fortsetzen oder abbrechen.
- Sichtbare Kampfreaktionen, laufende HP-Anzeige und Kampfprotokoll. „Animationen aus“ wird für die Kampfeffekte berücksichtigt.
- Gruppeneinladungen per Twitch-Name, beispielsweise @Simoncat. Der Name wird bei Twitch zur richtigen ID aufgelöst; vorhandener RPG-Spielstand erforderlich. Bestehende ID-Einladungen bleiben kompatibel.
- Belohnungs-Popup nach Boss-, Mimic-, Gruppen- und Dungeon-Siegen: tatsächlich gespeicherte Perlen, EP, Gegenstände und Materialien mit Bildern und Mengen. Blendet sich nach fünf Sekunden aus und erscheint pro Belohnung nur einmal.
- Server-Verbindungsfehler durch konkurrierende Statusabfragen behoben. Kurzzeitige Serverfehler behalten Sitzung und Aktionsbeleg; keine automatische Doppelbuchung.
- Unveränderte Spielstände werden beim Gruppenkampf nicht mehr unnötig ständig auf dem Server nachgeprüft.

Benötigt Plugin 2.8.1. Beide Programme aktualisieren und neu starten. In einem bereits laufenden älteren Dungeon einmal „Autokampf fortsetzen“ wählen. Für neue Dungeons ist der Autokampf voreingestellt.

# Version 0.9.0 – Rollen und Dungeons

- Entwicklung konzentriert sich auf die Windows-App. Die eigenständige Webseite wird nicht weiterentwickelt.
- Gespeicherte Rollenwahl: Tank, Heiler und Schaden mit echten Boni und gesperrtem Wechsel während eines laufenden Kampfes.
- Gruppenverwaltung für bis zu vier Spieler und gemeinsame Tauch- und Bosskämpfe.
- Neuer Dungeon-Reiter: drei Dungeons, Normal/Heroisch/Mythisch, sieben Begegnungen mit zwei Zwischenbossen und einem Endboss.
- Gemeinsame HP, Gruppenheilung, Schutz, Angriffsruf, unterbrechbare Gegnerfähigkeiten, Kampfverlauf, Lagererholung und individuelle Beute.
- EP-Fortschritt mit nächster Stufe; persistente Statistikansicht und Materialnavigation zurück zur Aufwertung.
- Benötigt RaidClipPlugin 2.8.0. Die Windows-Oberfläche und das Plugin müssen gemeinsam aktualisiert werden.
- Fundorte bei Ausrüstung, Sammelobjekten und Materialien aufklappbar.
- Nullwerte im Charakterfenster ausgeblendet.
- Fehlender Grundschaden wird bei Waffen ergänzt; bestehende positive Werte bleiben erhalten.
- Questtexte auf „Aufwerten“ vereinheitlicht.

# Version 0.8.2 – Eigene Mimic-Bilder

- Alle zehn regionalen Mimics besitzen jetzt eigene Bilder mit ihrem jeweiligen Unterwasserbiom.
- Die Mimic-Liste und die große Kampfansicht wählen das Bild anhand des Fundgebiets aus.
- Sonnenlagune, Tempel, Wrackfriedhof, Korallenwald, Gezeitenstrudel, Kristallgrotten, Verfluchte Tiefen, Wahrer Abgrund, Abyss und Thron der Urtiefe erhalten jeweils ein eigenes Motiv.
- Bildzuordnung und Dateien sind für Windows und das neue Twitch-Hostingpaket vorbereitet und getestet.
- Plugin 2.7.1 bleibt kompatibel; für diese Bilder ist kein neuer Plugin-Download nötig. Twitch zeigt die neuen Motive erst nach Übernahme des neuen Hostingpakets.
- Gemeinsame Mimic-HP, Kampfwerte und der 50-%-Beutewurf bleiben erhalten.

# Version 0.8.1

## Regionale Mimics – 25.10.2026

- Zehn Mimics passend zu den zehn Tauchgebieten. Beim Fund startet ein gemeinsames Ereignis im Boss-Reiter; es gibt keinen sofortigen Solo-Mimic-Kampf mehr.
- Alle Teilnehmer greifen dieselbe regionale Mimic an. Gemeinsame HP und Teilnehmer werden mit jedem Treffer atomar gespeichert und nach Neustarts wiederhergestellt. Ein laufender Boss wird nicht ersetzt.
- Doppelte Gebietsboss-HP, 150 % des Basisangriffs, bei ausgewählten Varianten Doppelbisse oder Rüstungsdurchdringung. Mindestens fünf Minuten Zeit zum gemeinsamen Kampf.
- Jeder überlebende Teilnehmer mit gültigem Angriff erhält nach Sieg genau einen 50-%-Wurf auf den Ausrüstungspool des regionalen Gebietsbosses. Dazu kommen regionale Materialien, EXP und Perlen. Kein zusätzlicher +5-%-Bonus auf diesen festen Beutewurf; keine Divine- oder Questgegenstände.
- Gemeinsamer Mimic-HP-Balken, regionale Beutevorschau und „Mimic angreifen“ in der Windows-App. Reguläre Bossauswahl bleibt gespeichert.

| Gebiet | Mimic | HP | Basisangriff je Treffer |
| --- | --- | ---: | ---: |
| Sonnenlagune | Schnappmuschel | 30.000 | 38 |
| Versunkene Tempel | Runenlade | 70.000 | 75 |
| Wrackfriedhof | Käpt’ns bissige Beutekiste | 140.000 | 135 |
| Leuchtender Korallenwald | Korallenmaul | 240.000 | 218 |
| Strudel der Gezeiten | Strudelschlund | 400.000 | 330 |
| Kristallgrotten | Kristallrachen | 640.000 | 480 |
| Verfluchte Tiefen | Fluchlade | 1.000.000 | 675 |
| Wahrer Abgrund | Urkorallen-Truhe | 1.700.000 | 975 |
| Abyss | Leerenmaul | 3.000.000 | 1.425 |
| Thron der Urtiefe | Königsmimic | 6.000.000 | 2.100 |

# Version 0.8.0

# Quests und legendäre Belohnungssets – 25.10.2026

- Neuer Reiter „Quests“ direkt unter „Abenteuer“.
- Level-1-Rundführung: Tauchen, Ausrüsten, Verstärken, Angeln, Sushi kochen und essen. Abschluss: 100.000 Perlen. Einmalige Starthilfe mit Upgrade-Materialien und bei Bedarf einer Anfängerwaffe.
- Zehn dauerhafte Questreihen für Level 10, 20, 30, 40, 50, 60, 70, 80, 90 und 99. Jedes Gebiet belohnt ein eigenes vollständiges legendäres Achtteil-Set mit zwei unterschiedlichen Ringen.
- Kapitel zählen nacheinander ab dem erforderlichen Level. Belohnungen sind einmalig und gegen doppelte Vergabe geschützt. Neue Questgegenstände sind zunächst gegen Zerlegen gesperrt.
- Unter dem Charakter werden nur tatsächlich getragene Sets mit Teilezahl und aktiven Boni angezeigt.
- Unter „OBS-Quelle erstellen“: markierbare Browserquellen-URL und „URL kopieren“.
- Gespeicherte Spielstände und vorhandene Ausrüstung bleiben erhalten.

# 0.7.2 – Werte und Fundorte korrigiert

- Rüstung auf Gegenständen wird einmalig um 50 % erhöht; der irrtümlich hinzugefügte Bonus von +50 Prozentpunkten Rüstung je Rüstungsteil wird rückwirkend entfernt. Andere prozentuale Rüstungswerte bleiben erhalten.
- Kraft und Ausdauer aller Ausrüstungsgegenstände werden ebenfalls einmalig um 50 % erhöht, einschließlich vorhandener Gegenstände. Aufwertungen, Instanzen und andere Werte bleiben erhalten.
- Jeder Levelaufstieg ab Level 2 gibt dauerhaft +5 Kraft und +5 Ausdauer, rückwirkend aus dem erreichten Level berechnet. Die Ausdauer erhöht die tatsächlichen maximalen HP.
- Beutevorschauen bleiben beim Regenerieren von HP und bei unabhängigen Perlenänderungen erhalten.
- Charakterwerte akzeptieren gleichwertige Zeitstempel aus Plugin und Cloud.
- Fanggebiet-Links öffnen unmittelbar Abenteuer → Angeln und scrollen an den Anfang. Die Gebietsauswahl wird weiterhin vom Plugin bestätigt.
- Separates Twitch-Hosting-Paket mit Tests für alle zehn Seltenheiten; aktive alte Panelversionen werden dadurch nicht automatisch bei Twitch ersetzt.
- Benötigt Plugin 2.6.2 für die korrigierten Gegenstands- und Levelwerte.

# 0.7.1 – Vollständige Sets zum Testen

- Adminpanel → Items & Loot: alle vollständig konfigurierten Ausrüstungssets mit Teilezahl vollständig vergeben.
- Gemeinsame Empfänger-Twitch-ID oberhalb der Set-Buttons; Vergabe ergänzt nur fehlende Teile und bestätigt Setname, Empfänger und Anzahl.
- Nur der Kanalinhaber darf Sets erzeugen, einschließlich Divine. Moderatoren erhalten weiterhin keinen Zugriff darauf.
- Inventar: Suche nach Setnamen und eigener Setfilter mit Teilezahl.
- Die Plugin-Anzeige meldet die erfolgreiche Wiederverbindung nach einem Verbindungsfehler.
- Die Vergabe aller angebotenen Sets wurde gegen die tatsächlichen Ausrüstungs-IDs getestet. Muscheln werden dabei nicht als Setteile erzeugt.
- Benötigt Plugin 2.6.1. Bei HTTP 400 nach längerem Stillstand Windows-Uhrzeit synchronisieren.

# 0.7.0 – Beute, Biome und Abenteuer

- Beute-Popup nach Tauchen und Angeln: fünf Sekunden sichtbar, mit Gegner, tatsächlichen Drops sowie Materialbildern und Mengen.
- 30 Kreaturenporträts, 22 Fischbilder mit passenden Biomen und neue Bilder für Schatzkammer, Gladiatorenduell, Otter-Wettlauf und mystische Muschel.
- Feste Fisch-Fanggebiete und anklickbare Fanggebiete in der Sushi-Küche.
- Ausrüstungsvorschau beim Tauchen und unter Bossen; Fundort-Links, Wertebereiche und Seteffekte per Mouseover. Divine bleibt aus den Vorschauen ausgeblendet.
- Sushi im Bossbereich essen; aktueller Schatzkammer-Jackpot. Animationsschalter unten fixiert.
- Duelle vergleichen serverseitig die ausgerüstete Ausrüstung; stärkere Ausrüstung gewinnt, Gleichstand erstattet den Einsatz.
- Muschel-Perlengewinn jetzt 100–10.000 Perlen bei unveränderten Gewinnkategorien.
- Alle vier Rüstungsslots besitzen Rüstung, Ausdauer und Kraft sowie jeweils +50 % Rüstung. Bestehende Gegenstände werden einmalig ergänzt.
- Aktivierte Gegenstands- und Materialwürfe im Gegnerkampf erhalten +5 Prozentpunkte Dropchance, maximal 100 %. Mimic-Materialchance: 55 %.
- Versionsnummer neben „Updates prüfen“ öffnet die mitgelieferten Patchnotes.
- Benötigt RaidClipPlugin 2.6.0 für neue Spielregeln und Fundortdaten.

# 0.6.1 – Anmeldung merken und Charakteransicht

- Twitch-Anmeldung wird für den Windows-Benutzer verschlüsselt gespeichert, beim Start geprüft und bei Bedarf automatisch erneuert. Abmelden entfernt die gespeicherte Sitzung.
- Itemdetails per Mauszeiger und Tastatur im Inventar und an den Charakterplätzen: gespeicherte Werte, Effekte und Setboni.
- Acht Ausrüstungsplätze in vier festen Reihen ohne Überschneidungen; responsive Werte- und Inventarspalten mit Tiefseekulisse und goldenen Rahmen.
- Dezente Unterwasserbeleuchtung und Blasen; abschaltbar über Animationseinstellung und reduzierte Bewegung.
- Nach dem ersten Update einmal mit Twitch anmelden, damit die Sitzung gespeichert werden kann.
# 0.6.0 – Deep Sea Codex 2.0

- Neue Windows-Abenteueransicht mit allen zehn Gebieten, eigener Detailspalte und aufklappbarem Adminpanel.
- Inventar nach Platz, Seltenheit, Favoriten, Sperren und Ausrüstungsstatus filtern; nach Seltenheit, Name, Aufwertung oder Zerlegewert sortieren.
- Drei vollständige Eternal-8er-Setübersichten mit allen 24 vorhandenen Itembildern und beiden Ringplätzen.
- Originales Twitch-Extension-Logo als Programm-, Fenster- und Installationssymbol.
- Zusätzliche Status-/Protokollansicht für den Kanalinhaber. Moderatorbeschränkungen bleiben unverändert.
- Prüfung des lokalen Web-Pakets beim Start; Installation immer mit dem vollständigen Installer aktualisieren.
- Mit Plugin 2.5.1 verwenden: Der große neue Admin-Katalog unterbricht den Aktionskanal nicht mehr.
- Das neue Anfänger-Balancing ist ein separater, unveröffentlichter Quellcode-Stand und nicht Bestandteil dieser Windows-Veröffentlichung.

﻿# 0.5.0 – Gebietsbosse, Magie und Eternal-8er-Sets

Zehn persönliche Gebietsbosse teilen einen gemeinsamen prozentualen Eventfortschritt. Die erste erfolgreiche Teilnahme bindet die Bossauswahl für dieses Event; Schaden und Belohnungen bleiben individuell. Bossauswahl, Treffer, Wiederverbindung und Belohnungen werden dauerhaft und gegen Wiederholungen geschützt verarbeitet.

Enthalten sind zwölf neue Waffen mit Mana, Magie- und Elementareffekten sowie drei zusätzliche Eternal-8er-Sets mit 24 Einzelbildern und acht kumulativen Setstufen. Die bisherigen Eternal-6er-Sets und das Divine-Set bleiben erhalten. Die neuen 8er-Sets besitzen separate seltene Kampf-Dropwürfe; Eonath-Beute bleibt berechtigten persönlichen Eonath-Teilnehmern vorbehalten.

Die Windows-Seitenleiste enthält 15 Hauptbereiche. RPG-Verwaltung unterstützt freigegebene Moderator-IDs; Itemvergabe, Konfigurationsänderungen und Divine bleiben dem Kanalinhaber vorbehalten. Sammelobjekte werden im Sammelinventar angezeigt und ungeschützte Exemplare über fünf bei erfolgreichen Spielstandänderungen automatisch zum vorhandenen Zerlegewert umgewandelt.

Mit Plugin 2.5.0 und Cloud-Projektion 9 verwenden. OBS-Browserquelle unverändert. Weitere Komfortfunktionen und optischer Feinschliff folgen getrennt.

# 0.4.2 – Divine-Set mit acht Teilen

Der Dreizack der Urschöpfung und der Siegelring der Grenzenlosigkeit ergänzen das Adminset auf alle acht Ausrüstungsplätze. Ab sieben unterschiedlichen Teilen: +500 % Erfahrung und +100 % Bewegungstempo. Mit 8/8 werden reguläre Gebietsbelohnungen sechsfach statt dreifach ausgegeben; Eternal-Würfe und Mimic-Materialsonderwürfe bleiben unverändert.

Im Adminbereich ergänzt „Göttliches Set vervollständigen“ ausschließlich fehlende Teile. Vorhandene Instanzen bleiben erhalten. Benötigt Plugin 2.4.1.

# 0.4.1 – Adminpanel wieder sichtbar

Der Kanalinhaber erreicht das vollständige Adminpanel über den neuen Eintrag „Admin“ in der Windows-Seitenleiste. Talente, Perks, Kochen und Perlen-Minispiele sind ebenfalls direkt in der Seitenleiste erreichbar. Boss- und Eventstart, Heal all, Itemerstellung sowie Material- und Divine-Verwaltung bleiben erhalten.

# 0.4.0 – Deep Sea Codex

Neue Windows-Oberfläche mit zehn Hauptbereichen, Charakterausrüstung, Itemvergleich und Materialübersicht. Enthält 24 Eternal-/Divine-Gegenstände, zehn Tauch- und Angelgebiete, die fehlenden Itembilder und zehn neue Sushi-Spezialitäten.

Alle Sushi-Buffs halten eine Stunde. Maximaler Perk-Kauf kauft alle bezahlbaren Stufen mit einer einzigen Abbuchung. Angel-Perlenperks und -talente geben jetzt zusätzliche Fische; Tauch-Perlenboni erhöhen stattdessen Materialfunde. Bestehende Stufen und Talentpunkte bleiben erhalten. Das Divine-Set erhöht die relative Gegnerchance um 1000 Prozent.

Mit RaidClipPlugin 2.4.0 verwenden. Die Twitch-Erweiterung nutzt weiterhin denselben Spielstand und ihr bestehendes Layout.

# 0.3.1 – Startkorrektur und vollständiger Admin-Itemkatalog

Plugin 2.3.1 behebt die Start-/Speicherblockade beim Aktualisieren vorhandener Einstellungen. Gültige alte Dateien werden vor ihrer Prüfung um die neuen Seltenheiten ergänzt; vorhandene Werte und Sicherungen bleiben erhalten. Beschädigte ursprüngliche Werte werden weiterhin abgelehnt.

Der Windows-Adminbereich zeigt alle 54 neuen Ausrüstungsteile mit Bildvorschau, Suche, Seltenheitsfiltern für Wahr/True, Cursed und Abyss sowie einer Katalog-Aktualisierung. Neue seltene Items stehen in der Auswahlliste oben. Heal all, Materialvergabe und Aufwertungen sind enthalten.

Feste Cursed- und Abyss-Schmuckwerte bleiben auch beim Aktivieren des vorhandenen Zufallsgenerators erhalten. Mit Plugin 2.3.1 verwenden.

# 0.3.0 – Tiefen-Erweiterung und garantierte Aufwertungen

54 neue Ausrüstungsteile: drei Wahre Sets, drei Abyss-Sets, zwölf Abyss-Schmuckstücke und sechs verfluchte Gegenstände. 81 zugeordnete Einzelbilder aus den bereitgestellten Illustrationen, einschließlich Materialien und vorhandener Sets.

Elf stapelbare Aufwertungsmaterialien, Materialfunde beim Angeln, Tauchen, besiegten Gegnern, geöffneten Tauchtruhen, Bossen und Mimics. Jede Mimic hat eine unveränderliche 50-%-Sonderchance auf ein Material aus ihrem gewichteten Pool.

Garantierte Aufwertungen von +0 bis +9 und einmalige Endveredelung auf +9. Positive ursprüngliche Werte steigen bis +45 % beziehungsweise veredelt +50 %; negative Fluchwerte, einzigartige Effekte und Setboni bleiben unverändert. Kosten und Materialverbrauch werden zusammen dauerhaft gespeichert.

Windows und Twitch verwenden dasselbe Materialinventar und dieselben Plugin-Regeln. Im Adminbereich lassen sich Fundchancen, Mengen, Mimic-Gewichte und Upgrade-Kosten bearbeiten sowie Testmaterialien vergeben.

Neuer Adminbutton „Heal all“: alle vorhandenen Spieler auf ihre jeweiligen maximalen HP heilen. Die Aktion wird gemeinsam gespeichert, prüft Kanalinhaberrechte und ist gegen doppelte Verarbeitung abgesichert.

Gemeinsam mit Plugin 2.3.0 und Cloud-Projektion 6 einsetzen. Vorhandene Iteminstanzen werden weder ersetzt noch neu ausgewürfelt.

# 0.2.0 – Gezeiten-Erweiterung

Windows-Adminbereich für den verifizierten Kanalinhaber: Boss, Mimic, Rennen, Heist und Hot-Time starten; Ausrüstung mit zufälligen, minimalen, maximalen oder eigenen Werten für bestehende Twitch-Spieler erstellen. Rechte werden im Backend und Plugin geprüft. Itemaufträge sind dauerhaft gegen doppelte Verarbeitung geschützt.

66 neue Ausrüstungsgegenstände, drei legendäre 6er-Sets und drei Schmuck-Kombinationen. Neue Werte für Rüstung, Heilungswirkung und Angriffstempo, Anzeige autoritativer Schildpunkte und einzeln zugeordnete Platzhaltergrafiken. Zufallswerte werden vom Plugin beim Fund erzeugt und dauerhaft gespeichert.

Gemeinsam mit Plugin 2.2.0 und Publisher mit RPG-Projektion 5 einsetzen. Publisher und Backend müssen gemeinsam aktualisiert sein.
