# Chrome-Version – frühere Entwicklung

Am 26.10.2026 vom Nutzer klargestellt: keine weitere eigenständige Browser-Webseite. Entwicklung und Veröffentlichung konzentrieren sich auf die Windows-App. Die folgenden Angaben dokumentieren den früheren Stand.

Die Browser-Version verwendet dieselben Profile, Spielaktionen und Berechtigungen wie die Windows-App. Es entsteht kein separater Spielstand. Anmeldung über den öffentlichen Twitch-Gerätecode, ohne Client-Geheimnis im Browser. Gespeicherte Tokens liegen verschlüsselt in IndexedDB; der Schlüssel ist nicht exportierbar. Das Backend prüft die Twitch-Identität unabhängig.

## Bauen und prüfen

Aus `otter-ui`: `pnpm build:browser`, `pnpm test` und `pnpm exec playwright test --config playwright.browser.config.ts`.

`python otter-ui/scripts/prepare-browser-assets.py <Backend>/wwwroot/browser` erzeugt die optimierten statischen Dateien. Python benötigt Pillow. Der Zielordner ist ausschließlich für generierte Browserdateien reserviert; veraltete Dateien darin werden entfernt. Originalbilder bleiben unverändert.

Der Backend-Build enthält diese Dateien. Einstieg `/browser/`, API auf derselben Herkunft. Die bestehenden API-Berechtigungen bleiben bestehen. Es sind keine CORS-Freigabe, neuen Twitch-Berechtigungen oder Datenbankänderungen für die Browseransicht nötig.

Am 25. Oktober 2026 nach ausdrücklicher Freigabe bereitgestellt: https://desktop---funjii-otter-rpg-backend-test-cwzl75ajla-ey.a.run.app/browser/

Öffentlicher Einstieg und alle Einstiegsdateien mit HTTP 200 und identischem Build-Hash geprüft. Anmeldekonfiguration aktiviert, Backend gesund, Profilzugriff ohne Anmeldung weiterhin HTTP 401. Anmeldeseite im Browser geprüft. Der Twitch-Tag rc1 wurde nicht umgestellt; Extension-Upload und Aktivierung bleiben zurückgestellt.

## Prüfstand

- 168 UI- und Anmeldetests bestanden.
- 2 Chromium-Browsertests bestanden: Gerätecode, verschlüsselte Speicherung, Wiederanmeldung nach Neuladen, bestehendes Profil, Abmelden, Nullwerte und Wiederholen bei Verbindungsfehler.
- 273 Backendtests bestanden.
- 1155 Plugintests bestanden, einschließlich Grundschaden für neue und bereits migrierte Waffen.
- Browseranmeldung mit synthetischen Twitch-Antworten geprüft; echte Anmeldung folgt erst an der bereitgestellten URL.

## Enthaltene Änderungen

- Waffen ohne positiven Angriffswert erhalten einen Grundwert gemäß ihrer Seltenheit. Bestehende positive Angriffe, Aufwertungen und sonstige Werte bleiben erhalten. Wirkt auch auf bereits vorhandene Waffen.
- Fundorte von Ausrüstung, Sammelobjekten und Materialien sind standardmäßig eingeklappt.
- Charakterfenster zeigt keine Nullwerte; fehlende Daten bleiben als solche erkennbar.
- Questtexte verwenden Aufwerten.
