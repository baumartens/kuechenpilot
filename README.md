# Küchenpilot

Persönliche Küchen-Web-App für iPad 5 (2017), iPadOS 16.7.16 und Safari.

**Live:** https://baumartens.github.io/kuechenpilot/

## Stand

Phase 3 ist auf dem echten iPad freigegeben. Phase 4 ist bewusst pausiert und nicht vollständig abgenommen. Neues Hauptziel ist der persönliche Morgenassistent: Das zweispaltige Dashboard priorisiert Müll/Aufgaben oder persönlichen Start, hält Termine oben rechts und zeigt Radio, E-Mails, Wetter und zuletzt Nachrichten. Die Anordnung wird einmal beim Laden festgelegt. Das dynamische Dashboard ist vom Nutzer auf dem iPad freigegeben. Persönliche Apple-Kalendertermine können jetzt über eine lokale Kurzbefehle-Exportdatei importiert werden; keine automatische Synchronisierung. Gmail ist unverbunden und KI-Sprachbriefing nicht verfügbar. Der neue Kalenderimport wartet auf Geräteabnahme. Kontozugriffe und externe Dienste werden erst nach gesonderter Freigabe eingerichtet.

Die vollständige Reihenfolge steht in [ROADMAP.md](ROADMAP.md), die Prüfprotokolle in [PHASE3_TESTS.md](PHASE3_TESTS.md) und [PHASE4_TESTS.md](PHASE4_TESTS.md).

- **Morgen:** bestehendes Wetter und maximal drei Nachrichten; nächste Abholtermine aus einer lokal importierten ICS-Datei.
- **Rezepte:** eigene Rezepte anlegen, bearbeiten, löschen, suchen, sichern und wieder importieren.
- **Rezeptimport:** Videolink versuchen oder Beschreibung einfügen, erkannte Felder prüfen/bearbeiten und lokal speichern. Im Test liefert YouTube einen Titel; vollständige Beschreibungen von YouTube und Instagram sind im Browser nicht abrufbar. Die lokale Texterkennung benötigt keinen externen Dienst.
- **Kochen:** gespeicherte Schritte, Zutatenliste, Systemstimme zum Vorlesen und bis zu drei Timer.
- **Radio:** hr1, hr3 und Deutschlandfunk. Start/Stopp und Senderwechsel; kein Autoplay.
- **KI-Briefing:** weiterhin ehrlich als Phase 5 gekennzeichnet.

Kalenderdateien werden direkt auf dem iPad ausgewählt. Sie werden nicht hochgeladen. Rezepte, Termine und Timer liegen im lokalen Safari-Speicher. Beim Löschen der Websitedaten gehen sie verloren: Rezepte als JSON sichern, ursprüngliche ICS-Datei aufbewahren. Es gibt keine Synchronisierung und keine garantierte Offline-App.

Timer berechnen ihre Restzeit aus einem gespeicherten Endzeitpunkt. **Safari offen lassen; bei Bildschirmsperre oder im Hintergrund ist kein zuverlässiger Alarm garantiert.** Nach einem Neuladen „Alarmton testen / aktivieren“ antippen. Vorlesen nutzt die vom Gerät bereitgestellten Stimmen; die hochwertige KI-Stimme gehört erst zu Phase 5.

## Technik

Keine Frameworks, externen Schriftarten oder Bilddownloads. Die App verwendet HTML, CSS, Inline-SVG und einfaches JavaScript. `index.html` enthält die App-Hülle, die vier Ansichten, den Ansichtscontroller und die Darstellung der öffentlichen Daten. Die Navigation verwendet URL-Fragmente; Browser-Zurück und direktes Öffnen einer Ansicht funktionieren ohne Server-Routing.

`fetch_data.py` ruft die öffentlichen Quellen serverseitig ab. GitHub Actions veröffentlicht ausschließlich `public/`, mit einer festen Liste der App-Dateien und `data.json`. Wetter-/RSS-Logik, Zeitplan und Ausfallbehandlung bleiben unverändert.

Der Zeitplan läuft zur Minute 17 und 47 jeder Stunde (UTC). GitHub kann Läufe verzögern und nach 60 Tagen ohne Repository-Aktivität deaktivieren. Unter Actions lässt sich der Workflow manuell starten oder wieder aktivieren. Die Aktualisieren-Taste lädt den veröffentlichten Stand, sie startet keinen neuen Workflow.

Jede Quelle behält einen eigenen Erfolgszeitpunkt. Bei Fehlern bleiben ihre vorherigen Daten erhalten, sofern der vorherige veröffentlichte Stand erreichbar ist. Die Oberfläche kennzeichnet fehlerhafte oder ältere Abrufe. Der Browser speichert zusätzlich den letzten geladenen Stand; ein vollständig offline gestarteter Besuch wird nicht garantiert.

Öffentliche Daten, lokale persönliche Daten und spätere KI-Dienste bleiben getrennt. Persönliche Kalender, Rezepte und API-Schlüssel gehören niemals in das öffentliche Repository oder `data.json`. Architekturvorgaben für zukünftige sichere externe Dienste stehen in der Roadmap.

## Lokal prüfen

Python 3.9 oder neuer und Node.js 18 oder neuer; keine zusätzlich zu installierenden Pakete:

```sh
TZ=Europe/Berlin node --test test_kitchen.cjs test_import.cjs test_morning.cjs test_appointments.cjs
python3 -m unittest -v test_fetch.py
python3 fetch_data.py
python3 -m http.server 8765 --bind 127.0.0.1 --directory public
```

Danach `http://127.0.0.1:8765` öffnen. Nach Änderungen die geänderten App-Dateien nach `public/` kopieren oder den Abruf ausführen. Im Browser neu laden.

## Quellen

Wetter: [Open-Meteo](https://open-meteo.com/), CC BY 4.0; modellbasierte Werte. Nachrichten: die offiziellen RSS-Feeds von Deutschlandfunk, Deutsche Welle und SRF, nur Schlagzeilen und Links. Noch keine KI-Zusammenfassung.

## Lokale Kalenderbibliothek

`ical.min.js`: unveränderte ES5-Distribution von [ICAL.js 2.2.1](https://github.com/kewisch/ical.js/tree/v2.2.1), MPL-2.0, siehe [ICAL-LICENSE.txt](ICAL-LICENSE.txt). Der zugehörige Quellcode ist über den Versionslink verfügbar. Kein CDN zur Laufzeit. Die Bibliothek wird nur beim ICS-Import in einem Worker geladen; maximal 1 MB Eingabe, begrenzte Expansion und 8 Sekunden Zeitlimit. Angezeigt wird der im Kalender angegebene Tag, keine Uhrzeit. Der gesamte Abfallkalender wird übernommen, ohne automatische Filterung auf Müllarten.

Radioadressen laut [hr3](https://www.hr3.de/service/faq-zu-hr3de-v1,hilfe-124.html), [hr1-Livestream](https://www.hr3.de/service/livestream-v1,livestream-114.html) und [Deutschlandfunk](https://www.deutschlandfunk.de/livestream-100.html).

Aktuelle Dashboard-Prüfung und Anbindungsvorschlag: [MORGEN_TESTS.md](MORGEN_TESTS.md).

## Persönliche Apple-Termine

[Kurzbefehl-Anleitung](https://baumartens.github.io/kuechenpilot/APPLE_KALENDER.html) · [Prüfprotokoll](APPLE_TESTS.md). In der Terminkachel „Termine importieren“ wählen. Eigene Speicherung unter `kuechenpilot-appointments-v1`, vollständig getrennt vom Abfallkalender. Ein bestätigter Import ersetzt den bisherigen persönlichen Stand. Keine privaten Datenübertragungen und keine neuen Dienste.
