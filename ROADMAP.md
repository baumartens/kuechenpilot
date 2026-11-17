# Küchenpilot – verbindliche Roadmap

## Ziel und Grenzen

Persönliche, ressourcenschonende Küchenzentrale für iPad 5 (2017), iPadOS 16.7.16 und Safari. GitHub Pages und Actions bleiben die Basis; kein eigener Heimserver, vorerst keine iPhone-Synchronisierung. Keine API-Schlüssel oder privaten Daten im öffentlichen Repository.

Das Gesamtprojekt ist nicht abgeschlossen. Jede Phase wird separat umgesetzt und technisch geprüft. Der Nutzer prüft die veröffentlichte Version auf dem echten iPad. Die nächste Phase beginnt nach dessen Bestätigung der vorherigen Phase.

## Phase 1 – funktionierende Grundlage

- GitHub Pages und zeitgesteuerte GitHub Actions eingerichtet.
- Open-Meteo für Groß-Zimmern, Deutschlandfunk, Deutsche Welle und SRF angebunden.
- Höchstens drei Nachrichten, auch nach Quellenfilter.
- Letzte erfolgreiche Daten mit unverändertem Zeitstempel bei Ausfällen; Warnungen bei veralteten Daten.
- Vom Nutzer auf dem iPad bestätigt, einschließlich der Begrenzung auf drei Meldungen.

## Phase 2 – App-Design

Implementiert und vom Nutzer auf dem echten iPad erfolgreich geprüft und freigegeben.

- Anthrazit, Holz- und Goldakzente, getrennte abgerundete Kacheln.
- Feste Navigation und eigenständige Ansichten: Morgen, Kochen, Rezepte, Radio.
- Morgen-Dashboard: Wetter und drei Nachrichten aktiv; Müllabholung, Radio und KI-Briefing als ehrliche Platzhalter.
- Große Touchflächen, Quer- und Hochformat, keine externen Fonts oder Frameworks, keine Animationen.
- Bestehender Datenabruf, öffentliches JSON-Schema und Aktualisierungszeitplan bleiben erhalten.
- Geräteabnahme: alle vier Ansichten, Quellenfilter, Aktualisieren, Datenstand-Dialog, beide Orientierungen und Rückkehr aus dem Hintergrund in Safari prüfen.

## Phase 3 – Küchenfunktionen

Nach bestätigtem Phase-2-iPad-Test implementiert; Phase-3-Abnahme auf dem echten iPad steht aus. Phase 4 beginnt ausdrücklich erst nach dieser Freigabe.

1. Müllabholung aus lokal importierten ICS-Dateien; Serien und Ausnahmen, zwei Jahre Vorschau.
2. Radioplayer mit hr1, hr3 und Deutschlandfunk, echten Streams und Start/Stopp.
3. Rezeptverwaltung: anlegen, bearbeiten, löschen, suchen, lokal speichern sowie JSON-Sicherung und Wiederimport.
4. Schritt-für-Schritt-Kochbegleiter.
5. Vorlesen mit der vorhandenen Systemstimme und bis zu drei lokale Timer mit Pause/Fortsetzen.

Abnahme mit echten ICS-Terminen, hörbarem Radio, gespeicherten Rezepten, nachvollziehbaren Kochschritten, Vorlesen und Timer auf dem iPad. Einschränkungen von Safari im Hintergrund ausdrücklich prüfen.

## Phase 4 – Rezeptimport

- Import aus YouTube- und Instagram-Beschreibungen, soweit zugänglich.
- Zutaten, Mengen und Kochschritte automatisch erkennen.
- Ergebnis vor dem Speichern prüfen und bearbeiten.
- Zugriffsfehler und nicht verfügbare Beschreibungen transparent anzeigen; manuelle Texteingabe als mögliche Rückfallebene.
- Keine Extraktion oder Vollständigkeit behaupten, solange sie nicht mit echten Beispielen geprüft wurde.

## Phase 5 – KI und Sprache

- Persönliches KI-Morgenbriefing.
- Natürliche, hochwertige Sprachwiedergabe.
- Zusammenfassung mehrerer Nachrichtenquellen mit Quellenbezug.
- Interaktive Gespräche.
- Erst danach optionale Kalender- und E-Mail-Funktionen.

## Architektur für spätere Phasen

- Der Ansichtscontroller und die Darstellung bleiben vom öffentlichen Datenabruf getrennt.
- `data.json` enthält ausschließlich öffentliche Wetter- und Nachrichtendaten. Persönliche Termine und Rezepte gehören nicht in diese Datei oder das öffentliche Repository.
- Für Phase 3 zunächst lokale Speicherung auf dem iPad vorsehen, mit späterer Export-/Sicherungsmöglichkeit. Noch keine Synchronisierung implementiert.
- KI- und Plattformzugriffe können einen sicheren externen Dienst erfordern. Schlüssel ausschließlich serverseitig in dessen Secret-Verwaltung; Authentifizierung, begrenzte Berechtigungen, Ratenlimits und minimale Datenübertragung vor Einführung festlegen.
- Der Browser ruft später nur die definierte Schnittstelle auf. Ein Platzhalter oder kommentierter Architekturhinweis ist noch keine implementierte Dienstanbindung.
- Keine neuen Cloud-Kosten oder Kontoverbindungen ohne konkreten Bedarf und Abstimmung.
