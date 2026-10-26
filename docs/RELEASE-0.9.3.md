# Veröffentlichung 0.9.3 / 2.8.3 – 26.10.2026

10/25/50/100 Tauchgänge werden sofort gemeinsam simuliert. Alle Würfe verwenden einen Simulationszeitpunkt; HP, Schaden, Buffs und Beute zählen fortlaufend. Bei 0 HP endet die Auswertung. Eine atomare Speicherung und Wiederholschutz verhindern doppelte Auszahlung. Normale Abklingzeit einmal vor dem Start prüfen und einmal nach Abschluss setzen. Alte gespeicherte 20er-Serien bleiben lesbar. Neue Projektion 14, weiterhin Unterstützung für 2–13.

Unter Einstellungen: „Programmed by Codex“, Hinweis auf KI-unterstützte Entwicklung und teilweise KI-generierte, fiktionale Spielgrafiken. Permanenter dezenter Hinweis mit Navigation zu den Details. Keine Behauptung einer pauschalen Rechtskonformität oder einer technischen Herkunftssignatur; Bilddateien und vorhandene Herkunftsmetadaten bleiben unverändert.

Quelle, geprüft am 26.10.2026: https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act . Die Kommission unterscheidet technische Anbieterkennzeichnung, sichtbare Deepfake-Offenlegung und den Kontext fiktionaler Werke. Der Hinweis ersetzt keine Kennzeichnung künftig etwaiger täuschender Inhalte. EUR-Lex-Abruf war durch eine Bot-Prüfung beschränkt.

Prüfungen: 1.216 Plugin-Tests, zusätzlich 13 Versions-/Mehrfachtauchprüfungen nach Versionsanhebung, 273 Backend-, 176 UI- und 16 Windows-Tests. Windows-Build erfolgreich. Native UI-Brücke prüft alle vier Mengen, Stopp bei 0 HP, Mengen und Bilder im fünfsekündigen Popup sowie KI-Hinweis-Navigation und lesbare Credits. Belege: artifacts/instant-dives-*.log und artifacts/dive-series-ui/credits.png. Keine produktiven Testauszahlungen oder Änderungen an Spielständen/Revisionsbaselines.

Nach separater ausdrücklicher Freigabe „Ja, Korrekturpatch jetzt veröffentlichen“ veröffentlicht und geprüft. Keine lokale Installation.

- Windows 0.9.3: https://github.com/Funjii95/FunjiiOtterRPG-Desktop/releases/tag/v0.9.3 ; Quellstand 45565dd, erfolgreicher Workflow 40279690448.
- Plugin 2.8.3: https://github.com/Funjii95/RaidClipPlugin/releases/tag/v2.8.3 ; Quellstand 4d9510b, erfolgreicher Workflow 40279402767. Archivdigest und Manifest-Prüfsumme geprüft.
- Backend: funjii-otter-rpg-backend-test-instantdives-0ea606fc1d, Tags desktop und rc1.
- Publisher: funjii-otter-rpg-publisher-test-instantdives-ee61dfa3d5, Tag rc1. Gesundheitsprüfung erfolgreich, geschützte Fähigkeitsprüfung bestätigt Projektionen 2–14 sowie unveränderten Kanal und Transportgrenze.
- Öffentliche Updatefeeds bestätigen beide neuen Versionen. Plugin-Update-ZIP und beide Installer liefern HTTP 200.
- Beide Programme aktualisieren und neu starten. Twitch-Hosting und OBS bleiben unverändert.

Der anschließende kombinierte Dokumentations-/Push-Aufruf wurde von der automatischen Freigabeprüfung abgelehnt. Die Veröffentlichung selbst war zuvor erfolgreich abgeschlossen und unabhängig öffentlich geprüft worden; dieser Nachweis wurde daraufhin nur lokal aktualisiert.
