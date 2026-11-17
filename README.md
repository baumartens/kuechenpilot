# Küchenpilot

Persönliche Küchen-Web-App für iPad 5 (2017), iPadOS 16.7.16 und Safari.

**Live:** https://baumartens.github.io/kuechenpilot/

## Stand

Phase 2: dunkles App-Design mit vier eigenständigen Ansichten, Kacheln und fester Navigation. Wetter und Nachrichten bleiben funktionsfähig. Die neue Oberfläche ist technisch geprüft; der Test dieser Version auf dem echten iPad steht noch aus. Das Gesamtprojekt ist nicht fertig.

Die vollständige Reihenfolge und Abnahmekriterien stehen in [ROADMAP.md](ROADMAP.md). Das Prüfprotokoll steht in [PHASE2_TESTS.md](PHASE2_TESTS.md).

- **Morgen:** Wetter für Groß-Zimmern und maximal drei Nachrichten aus Deutschlandfunk, Deutsche Welle und SRF. Quellenfilter, Aktualisieren und Datenstand-Dialog.
- **Kochen / Rezepte / Radio:** eigenständige, ausdrücklich als geplant gekennzeichnete Ansichten. Noch kein Kochbegleiter, Rezeptimport oder Radioplayer.
- **Müllabholung / KI-Briefing:** gekennzeichnete Platzhalter im Morgen-Dashboard.

## Technik

Keine Frameworks, externen Schriftarten oder Bilddownloads. Die App verwendet HTML, CSS, Inline-SVG und einfaches JavaScript. `index.html` enthält die App-Hülle, die vier Ansichten, den Ansichtscontroller und die Darstellung der öffentlichen Daten. Die Navigation verwendet URL-Fragmente; Browser-Zurück und direktes Öffnen einer Ansicht funktionieren ohne Server-Routing.

`fetch_data.py` ruft die öffentlichen Quellen serverseitig ab. GitHub Actions veröffentlicht ausschließlich `public/`, mit `index.html` und `data.json`. Der Workflow und die Datenabrufe wurden für Phase 2 nicht geändert.

Der Zeitplan läuft zur Minute 17 und 47 jeder Stunde (UTC). GitHub kann Läufe verzögern und nach 60 Tagen ohne Repository-Aktivität deaktivieren. Unter Actions lässt sich der Workflow manuell starten oder wieder aktivieren. Die Aktualisieren-Taste lädt den veröffentlichten Stand, sie startet keinen neuen Workflow.

Jede Quelle behält einen eigenen Erfolgszeitpunkt. Bei Fehlern bleiben ihre vorherigen Daten erhalten, sofern der vorherige veröffentlichte Stand erreichbar ist. Die Oberfläche kennzeichnet fehlerhafte oder ältere Abrufe. Der Browser speichert zusätzlich den letzten geladenen Stand; ein vollständig offline gestarteter Besuch wird nicht garantiert.

Öffentliche Daten, lokale persönliche Daten und spätere KI-Dienste bleiben getrennt. Persönliche Kalender, Rezepte und API-Schlüssel gehören niemals in das öffentliche Repository oder `data.json`. Architekturvorgaben für zukünftige sichere externe Dienste stehen in der Roadmap.

## Lokal prüfen

Python 3.9 oder neuer; keine zusätzlichen Python-Pakete:

```sh
python3 -m unittest -v test_fetch.py
python3 fetch_data.py
python3 -m http.server 8765 --bind 127.0.0.1 --directory public
```

Danach `http://127.0.0.1:8765` öffnen. Nach Änderungen an `index.html` erneut nach `public/index.html` kopieren oder den Abruf ausführen. Im Browser neu laden.

## Quellen

Wetter: [Open-Meteo](https://open-meteo.com/), CC BY 4.0; modellbasierte Werte. Nachrichten: die offiziellen RSS-Feeds von Deutschlandfunk, Deutsche Welle und SRF, nur Schlagzeilen und Links. Noch keine KI-Zusammenfassung.
