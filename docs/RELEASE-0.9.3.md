# Patch 0.9.3 / 2.8.3 – vorbereitet am 26.10.2026

10/25/50/100 Tauchgänge werden sofort gemeinsam simuliert. Alle Würfe verwenden einen Simulationszeitpunkt; HP, Schaden, Buffs und Beute zählen fortlaufend. Bei 0 HP endet die Auswertung. Eine atomare Speicherung und Wiederholschutz verhindern doppelte Auszahlung. Normale Abklingzeit einmal vor dem Start prüfen und einmal nach Abschluss setzen. Alte gespeicherte 20er-Serien bleiben lesbar. Neue Projektion 14, weiterhin Unterstützung für 2–13.

Unter Einstellungen: „Programmed by Codex“, Hinweis auf KI-unterstützte Entwicklung und teilweise KI-generierte, fiktionale Spielgrafiken. Permanenter dezenter Hinweis mit Navigation zu den Details. Keine Behauptung einer pauschalen Rechtskonformität oder einer technischen Herkunftssignatur; Bilddateien und vorhandene Herkunftsmetadaten bleiben unverändert.

Quelle, geprüft am 26.10.2026: https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act . Die Kommission unterscheidet technische Anbieterkennzeichnung, sichtbare Deepfake-Offenlegung und den Kontext fiktionaler Werke. Der Hinweis ersetzt keine Kennzeichnung künftig etwaiger täuschender Inhalte. EUR-Lex-Abruf war durch eine Bot-Prüfung beschränkt.

Prüfungen: 1.216 Plugin-Tests, zusätzlich 13 Versions-/Mehrfachtauchprüfungen nach Versionsanhebung, 273 Backend-, 176 UI- und 16 Windows-Tests. Windows-Build erfolgreich. Native UI-Brücke prüft alle vier Mengen, Stopp bei 0 HP, Mengen und Bilder im fünfsekündigen Popup sowie KI-Hinweis-Navigation und lesbare Credits. Belege: artifacts/instant-dives-*.log und artifacts/dive-series-ui/credits.png. Keine produktiven Testauszahlungen oder Änderungen an Spielständen/Revisionsbaselines.

Noch nicht veröffentlicht oder installiert. Live bleibt Windows 0.9.2 / Plugin 2.8.2. Eine separate Freigabe für die Veröffentlichung dieser Korrektur ist erforderlich; der erste Veröffentlichungsversuch wurde von der automatischen Freigabeprüfung mit „blocked by policy“ abgelehnt.
