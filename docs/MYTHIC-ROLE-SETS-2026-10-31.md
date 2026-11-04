# Mythische Rollen-Sets – nächstes Update

Zwei elfteilige Sets ab Spielerlevel 80: **Zorn des Sturmkrakens** für DDs und **Gesang der Lebensquelle** für Heiler. Elf unterschiedliche Plätze: Helm, Brust, Handschuhe, Stiefel, Waffe, zwei Ringe, Amulett, Gürtel und zwei Trinkets. Keine Rollenbindung beim Ausrüsten. Keine Änderung vorhandener Gegenstände oder Speicher-Slotwerte.

## Fundorte

Die 22 Gegenstände ergänzen den bestehenden zusätzlichen 25-Prozent-Beutewurf nach erfolgreichen mythischen Dungeons. Der Wurf wählt ein geeignetes Teil aus dem gemeinsamen Pool mit Tankausrüstung und bisherigen mythischen Trinkets; er bedeutet nicht 25 Prozent je Gegenstand. Keine neuen Teile in normalen Gebietsboss-, Mimic- oder Tauchpools. Fundortvorschau und Setvergabe verwenden den gemeinsamen Katalog.

## Kumulative Setboni

| Teile | Zorn des Sturmkrakens | Gesang der Lebensquelle |
|---|---|---|
| 2 | +15 % Angriff | +15 % Heilwirkung; aktive Gruppenheilung verfügbar |
| 4 | +8 Prozentpunkte Krit-Chance, +20 % Krit-Schaden | +15 % maximales Leben |
| 6 | +20 % Boss-Schaden | +10 Prozentpunkte kritische Heilchance |
| 8 | +10 Prozentpunkte Doppelangriffschance, bestehendes Limit gilt | +20 % Heilwirkung |
| 9 | +20 % Gesamtschaden | Überheilung erzeugt Gruppenschilde bis zum bestehenden Schildlimit |
| 11 | Kritischer Hauptangriff: 250 % Angriffsschaden als Wasser, 8 s Abklingzeit | Aktive Gruppenheilung: zusätzliche Heilung des verletztesten anderen lebenden Mitglieds mit 60 % Grundheilung, 8 s Abklingzeit |

Sturmstoß wird in Tauch-, Boss- und Gruppenkämpfen angewendet, profitiert von Wasser-/Elementarschaden und wird von Zielrüstung begrenzt. Keine Kettenauslösung. Die Kampfstärkebewertung berücksichtigt seinen erwarteten Beitrag. Die zweite Heilwelle verwendet normale Heilwirkung und kritische Heilchance, kann Überheilungsschutz erzeugen, aber keine weitere zweite Heilwelle auslösen. Abklingzeiten liegen im gespeicherten Profil und werden durch Ausrüstungswechsel nicht zurückgesetzt. Bereits vorhandene kritische Heilwerte der Ausrüstung werden nun auch bei aktiver Gruppenheilung berücksichtigt.

## Grundwerte ohne Aufwertung

DD: Jedes Teil +18 Kraft und +14 Ausdauer. Vier Rüstungsteile jeweils 44 Rüstung/120 HP, Gürtel 28 Rüstung/60 HP, übrige Teile 60 HP. Waffe +280 Angriff/+4 Krit-Chance/+12 Krit-Schaden; Trinkets jeweils +58 Angriff/+2 Krit-Chance/+4 Krit-Schaden; andere Teile +12 Angriff/+2 Krit-Chance/+4 Krit-Schaden.

Heiler: Jedes Teil +8 Kraft und +18 Ausdauer. Vier Rüstungsteile jeweils 36 Rüstung/120 HP, Gürtel 28 Rüstung/60 HP, übrige Teile 60 HP. Waffe +180 Angriff/+12 Heilwirkung/+4 kritische Heilchance; Trinkets jeweils +30 Angriff/+6 Heilwirkung/+2 kritische Heilchance; andere Teile +3 Heilwirkung/+2 kritische Heilchance. Die Waffen haben normale Angriffswerte; ihre Seteffekte benötigen kein Mana.

Alle Werte sind feste Grundwerte, nicht zufällige Rolls. Bestehende Aufwertungsregeln bleiben wirksam. Die neuen Set-Trinkets tragen passive Attribute; ihr besonderer Auslöseeffekt gehört zum vollständigen Set und ist kein zusätzlicher unabhängiger Trinket-Proc.

## Veröffentlichung

Am 04.11.2026 veröffentlicht: Windows 0.9.8 und Plugin 2.8.8. Twitch 0.0.3 wurde mit identischem Inhaltsstand aktualisiert (gehosteter Test). Keine lokale Installation durchgeführt. Balance muss mit echten Dungeon-Gruppen erprobt werden.

## Grafiken und Prüfung (04.11.2026)

22 individuelle transparente Bilder mit dem eingebauten ImageGen-Werkzeug erzeugt. Produktionsdateien: `otter-ui/public/items/mythic-roles/`. Originale: `artifacts/mythic-art/originals/`. Zuordnung: `docs/mythic-role-art.json`; verwendete Prompts: `docs/mythic-role-art-prompts.json`. Die bestehenden mythischen Rahmen werden in der Oberfläche ergänzt. Alle Motive visuell geprüft.

1.255 Plugin-Tests erfolgreich, darunter sieben neue Prüfungen zu Setvollständigkeit, Duplikaten, Lootgrenzen, Sturmstoß, gespeicherten Abklingzeiten, Überheilungsschutz und zusätzlicher/kritischer Gruppenheilung. Produktionsbuild und alle 187 UI-Tests erfolgreich. Zwei Layoutprüfungen bei 1.400 und 390 Pixeln: alle 22 Bilder laden mit mythischen Rahmen, kein horizontaler Überlauf. Die Layoutprüfung verwendet eine statische Testansicht; Kampfprüfungen verwenden synthetische Profile.
