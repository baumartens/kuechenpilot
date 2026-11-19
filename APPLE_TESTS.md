# Apple-Kalenderimport – 19. November 2026

## Implementiert

Lokaler JSON-Dateiimport nach expliziter Bestätigung, eigener Safari-Speicherschlüssel, keine Netzwerkaufrufe in den beiden neuen Kalendermodulen. Heute/Morgen/nächste sieben Tage ab morgen, lokale Anzeige von ISO-Zeitstempeln mit Zeitzone, Ganztage mit exklusivem Enddatum, überlappende mehrtägige Ereignisse, nächster bzw. laufender Termin, Ort und aufklappbare Hinweise. Exportzeit, Importzeit, Warnung nach 24 Stunden und unvollständiger Zeitraum sichtbar. Leerer Export erlaubt; ungültiger Import lässt bisherigen Stand erhalten. Höchstens 1 MB und 1.000 Ereignisse. Exakte Duplikate werden entfernt. Keine Seriendefinitionen: Kurzbefehle muss konkrete Vorkommen exportieren.

## Tatsächlich geprüft

29 Node-Tests und 4 Python-Tests bestanden. Neue Fälle: ISO-Zeitzonen, ungültiges Datum/Format/Ende, Ganztag und Mehrtag, Filtergrenzen, nächste Termine, Sonderzeichen/Zeilenumbrüche, JSON-Rundlauf, Duplikate, leere Liste, falsche Datei und Größenlimits.

Browser mit ausschließlich synthetischen Daten: drei Termine importiert, explizit übernommen und neu geladen. Uhrzeit/Ort, Hervorhebung, Morgen-Ganztag und spätere Termine in Siebentageansicht sichtbar. Ungültiges JSON abgewiesen, Übernehmen deaktiviert. Leerer Export ersetzt nach Bestätigung die Liste und bleibt nach Neuladen leer. Vorhandener Mülltermin blieb unverändert. Beide Tabletgrößen 768 × 1024 und 1024 × 768 geprüft; bestehendes Grid und Positionierungslogik unverändert, keine überlaufenden Grid-Reihen. Einträge werden als Text erzeugt, nicht als HTML interpretiert.

Nicht geprüft: tatsächliche Ausführung des beschriebenen Kurzbefehls auf iPadOS 16.7.16, echte Apple-Kalenderdaten, konkrete Serienausnahmen der Apple-Ausgabe und Speicherung auf dem echten iPad. Es gibt keine installierbare oder als getestet bezeichnete .shortcut-Datei. Die Anleitung beschreibt Standardaktionen, ist aber am Gerät noch zu bestätigen. Kein direkter oder automatischer Zugriff auf den nativen Kalender behauptet.

## Datenschutz

Nur selbst ausgewählte Datei, keine öffentliche Kalenderfreigabe, kein Server, kein Upload. Kalenderinhalte werden nicht in GitHub, data.json oder Actions gespeichert. Die öffentliche Anleitung enthält ausschließlich erfundene Beispiele. Persönliche Termine sind auf dem gemeinsam verwendeten iPad sichtbar, Notizen aufklappbar. Kein automatisches Vorlesen. Lokale Entfernung berührt Apple-Kalender und Müllkalender nicht. Das Löschen der Safari-Websitedaten entfernt lokale Daten. Dateiablage „Auf meinem iPad“ wählen; iCloud Drive würde über Apple synchronisieren.

## iPad-Abnahme

1. Anleitung über „Termine importieren“ öffnen und Kurzbefehl aufbauen. Zunächst Testkalender mit erfundenen Terminen nutzen.
2. Einen Termin heute mit Uhrzeit/Ort/mehrzeiliger Notiz, einen Ganztag morgen und einen Termin in einigen Tagen exportieren. Anzahl und Zeitraum prüfen, importieren und mit Apple-Kalender vergleichen.
3. Safari neu laden: Daten müssen erhalten bleiben. Heute/Morgen/nächste sieben Tage und beide Ausrichtungen prüfen.
4. Testtermin ändern oder löschen, neu exportieren und importieren: alter Stand muss ersetzt werden. Serien und mehrtägigen Ganztag gesondert vergleichen.
5. Müllkalender, Rezepte, Radio und Timer müssen weiter vorhanden sein. Keine neue ICS-Datei für Müll nötig.

Gmail und KI-Stimme werden nicht in diesem Schritt eingerichtet. Phase 4 bleibt bewusst pausiert und nicht vollständig abgenommen.
