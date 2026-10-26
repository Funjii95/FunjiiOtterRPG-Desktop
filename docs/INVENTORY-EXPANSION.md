# Inventar-Erweiterung (vorbereitet, noch nicht veröffentlicht)

- Verdoppeltes Budget für synchronisierte Spielstände: 512 KiB statt 256 KiB, inklusive JSON-Transporthülle.
- Aktionsantworten unterstützen 768 KiB statt 384 KiB, damit größere Inventare samt Werten vollständig ankommen.
- Keine Änderung an Item-IDs, Instanzen, Werten, Aufwertungen oder vorhandenen Spielständen. Keine automatische Löschung oder Zerlegung.
- Es gibt weiterhin keine feste Anzahl von Plätzen: Die mögliche Itemzahl hängt von den übrigen gespeicherten Profildaten und den Itemdaten ab.

## Veröffentlichung

Zuerst Backend und Snapshot-Publisher mit den neuen Grenzen bereitstellen und ihre Fähigkeiten prüfen; erst danach das Plugin ausliefern. Der bestehende Capability-Check verhindert die Synchronisierung eines neuen Plugins mit einem Publisher, der weiterhin nur 256 KiB unterstützt. Die Windows-App unterstützt bereits Antworten bis 4 MiB.

Nach Annahme größerer Profile keinen Publisher mit der alten Grenze einsetzen, ohne die größeren Spielstände weiterhin unterstützen zu können. Nicht durch Kürzen von Inventaren zurückrollen.

## Prüfung

282 Backend-Tests erfolgreich, einschließlich der bestehenden Größen- und Authentifizierungsprüfungen. Neue Tests prüfen einen vollständigen Roundtrip von 600 Ausrüstungsgegenständen über die Snapshot-Validierung und den Firestore-SDK-Testtransport sowie eine große Aktionsantwort inklusive wiederholter Zustellung. Der Testtransport ersetzt keinen Produktivlasttest.
