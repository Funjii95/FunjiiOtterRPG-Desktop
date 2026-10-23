# Architektur

- `FunjiiOtterDesktop`: Windows-Forms-Hülle, WebView2, Twitch Device Login, native API-Weiterleitung und automatische Updates mit Velopack.
- `otter-ui`: originale Funjii-Otter-RPG-Oberfläche mit React, lokalen Grafiken und dem Adapter zur bestehenden Spiel-API. Die Windows-Ausgabe lädt ausschließlich den Remote-Adapter; lokale Demo-Daten sind kein Ersatz für einen Backend-Fehler.
- `Sync`: Backend-Erweiterung für Desktop-OAuth und vorhandene gemeinsame Profil-/Aktionsverträge einschließlich Tests. Die Veröffentlichung der Windows-App verändert das laufende Backend nicht automatisch.
- `FunjiiOtterDesktop.Tests`: Update-Zustandsautomat mit Tests für Download, Offlinebetrieb, parallele Prüfungen und kontrollierten Neustart.

Die Benutzer-ID kommt aus der Twitch-Anmeldung. Der Server prüft Tokens bei Twitch, bindet sie an die zugelassene öffentliche Client-ID und verwendet ausschließlich die serverseitige Kanalzuordnung. OAuth-Tokens bleiben im Arbeitsspeicher der nativen Anwendung. Die eingebettete Weboberfläche erhält keine echten Tokens und darf nur fest freigegebene Spieler-Endpunkte über die native Weiterleitung anfragen.

Spielaktionen bleiben durch dieselbe wartende Action-ID, Eigentümerzuordnung und Plugin-Bereitschaft geschützt wie in der Twitch Extension. Charakterattribute kommen aus der Berechnung im Plugin. Die Antwortgrenze ist gemeinsam mit dem Backend auf 384 KiB für das serialisierte Ergebnis begrenzt, damit größere Inventare die separat angeforderten Attribute nicht verlieren.

Updates werden vom öffentlichen GitHub-Release-Feed dieses Repositorys geladen. Velopack prüft Pakete und bereitet sie separat vor. Der Benutzer kann sie durch einen kontrollierten Neustart übernehmen; ein vollständig heruntergeladenes Update wird auch beim nächsten normalen Start übernommen. Lokale App-Daten liegen außerhalb des ersetzten Programmordners. Die Updatequelle ist in der Anwendung fest auf dieses Repository begrenzt.

Die Oberfläche und das Backend basieren auf [Funjii95/RaidClipPlugin](https://github.com/Funjii95/RaidClipPlugin). Die eigenständige Windows-App enthält keine Twitch-/GitHub-Zugangsdaten, Server-Secrets, Spielstände oder lokalen Konfigurationssicherungen. Asset-Herkunft: `otter-ui/ART-SOURCES.md`.
