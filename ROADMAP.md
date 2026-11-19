# Küchenpilot – verbindliche Roadmap

## Ziel und Grenzen

Persönliche, ressourcenschonende Küchenzentrale für iPad 5 (2017), iPadOS 16.7.16 und Safari. GitHub Pages und Actions bleiben die Basis; kein eigener Heimserver, vorerst keine iPhone-Synchronisierung. Keine API-Schlüssel oder privaten Daten im öffentlichen Repository.

Das Gesamtprojekt ist nicht abgeschlossen. Jede Phase wird separat umgesetzt und technisch geprüft. Der Nutzer prüft die veröffentlichte Version auf dem echten iPad. Die weitere Reihenfolge richtet sich nach der ausdrücklichen Priorisierung des Nutzers.

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

Implementiert und vom Nutzer auf dem echten iPad 5 vollständig getestet und freigegeben: Morgen-Dashboard, ICS-Import, Radio, Rezeptverwaltung, Kochbegleiter einschließlich Vorlesen sowie alle drei Timer. Phase 4 ist damit zur Entwicklung freigegeben.

1. Müllabholung aus lokal importierten ICS-Dateien; Serien und Ausnahmen, zwei Jahre Vorschau.
2. Radioplayer mit hr1, hr3 und Deutschlandfunk, echten Streams und Start/Stopp.
3. Rezeptverwaltung: anlegen, bearbeiten, löschen, suchen, lokal speichern sowie JSON-Sicherung und Wiederimport.
4. Schritt-für-Schritt-Kochbegleiter.
5. Vorlesen mit der vorhandenen Systemstimme und bis zu drei lokale Timer mit Pause/Fortsetzen.

Abnahme mit echten ICS-Terminen, hörbarem Radio, gespeicherten Rezepten, nachvollziehbaren Kochschritten, Vorlesen und Timer auf dem iPad. Einschränkungen von Safari im Hintergrund ausdrücklich prüfen.

## Phase 4 – Rezeptimport

Bewusst pausiert auf Nutzerwunsch vom 18. November 2026. Keine vollständige Geräteabnahme und keine vollständige Freigabe. Bestehende Rezeptfunktionen bleiben erhalten; automatischer YouTube-/Instagram-Import und Screenshot-Erkennung werden vorerst nicht weiterentwickelt.

- YouTube-/Instagram-Link validieren und öffentliche Metadaten abrufen versuchen. Im Test: YouTube-Titel verfügbar, Videobeschreibungen beider Plattformen im Browser nicht abrufbar. Kein vollständiger automatischer Videoimport zugesagt.
- Verlässlicher Zugangsweg: Rezeptbeschreibung selbst einfügen; lokale Textregeln erkennen Rezeptname, Zutaten, Mengen, Portionen und Schritte. Keine KI und keine erfundenen Ergänzungen; Erkennung hängt vom Textformat ab.
- Bearbeitbare Vorschau mit nummerierten Schritten, Mengenprüfung, fehlenden Angaben und nicht zugeordnetem Text.
- Originalvideo speichern, vorhandene lokale Bibliothek erhalten, gleiche Videolinks vor zusätzlicher Speicherung bestätigen lassen.
- Importierte Rezepte im vorhandenen Kochbegleiter verwenden; Sicherung und Wiederimport bleiben erhalten.
- Plattformgrenzen, technische Tests und möglicher späterer externer Dienst: [PHASE4_TESTS.md](PHASE4_TESTS.md).
- Noch offen: persönlicher iPad-Test und Freigabe; vollständiger automatischer Beschreibungsabruf benötigt eine separat geprüfte zulässige Anbindung und ist derzeit nicht verfügbar.

## Phase 5 – „Dein Morgen. Für dich zusammengefasst.“

Neues Hauptziel laut Nutzerpriorisierung vom 18. November 2026. Zuerst Morgen-Dashboard entwickeln, technisch testen und veröffentlichen; danach Prüfung auf dem echten iPad. Die unvollständige Phase-4-Abnahme blockiert diesen ausdrücklich beauftragten Dashboard-Umbau nicht. E-Mail-/Kalenderzugriff, externe Dienste, Kosten und KI-Sprachdienst bleiben bis zur gesonderten Abstimmung und Freigabe unverbunden.

### Aktueller Schritt – dynamisches Morgen-Dashboard

- Zweispaltiges Tablet-Dashboard auch im Hochformat, wechselnde Breiten 60/40 und 40/60, inhaltsabhängige Kachelhöhen.
- Oben links Müll/Aufgaben bei Abholung heute oder morgen, sonst persönlicher Start; persönliche Termine stets oben rechts. Danach Radio und Start bzw. Müll, anschließend E-Mails und Wetter, zuletzt Nachrichten über volle Breite.
- Priorität einmal beim Laden bestimmen; keine Positionswechsel durch Timer, Kalenderaktualisierungen oder Ansichtswechsel. Neu laden übernimmt eine geänderte Priorität. Keine Animationen.
- Vorhandene lokale ICS-Daten weiterverwenden; schwarze, blaue, braune und gelbe Mülltonnensymbole, mehrere Abholarten sichtbar. Vortag: „Heute Abend rausstellen!“, Abholtag: „Abholung heute“.
- Unverbundene Konten ehrlich kennzeichnen; keine erfundenen Anzahlen oder Termine.
- Sichtbarer Button „Morgenbriefing starten“, bis zur Umsetzung deaktiviert und erklärt. Spätere Sprechreihenfolge entspricht der Dashboard-Priorität.
- Anthrazit-Holz-Gold-Design, iPad 5/Safari, bestehende Küchenfunktionen erhalten.
- Bisherige Morgenansicht laut Nutzer auf iPad funktionsfähig. Die dynamische zweispaltige Anordnung wurde am 19. November 2026 vom Nutzer auf dem iPad bestätigt und bleibt unverändert. Anbindungsprüfung: [MORGEN_TESTS.md](MORGEN_TESTS.md).

### Persönliches KI-Morgenbriefing

- Persönliches Morgenbriefing mit freundlicher, natürlicher Ansprache und hochwertiger Sprachwiedergabe.
- Mehrere Nachrichtenquellen mit Quellenbezug zusammenfassen.
- E-Mails, persönliche Termine und bestehende Müllabholtermine integrieren.
- Interaktive Gespräche und Rückfragen ermöglichen, etwa „Welche Termine habe ich morgen?“

### E-Mail-Check

- Neue E-Mails über eine sichere, ausschließlich lesende Kontoverbindung prüfen.
- Wichtige und handlungsrelevante Nachrichten erkennen und kurz zusammenfassen.
- Verständlich zurückmelden, wenn keine wichtigen neuen E-Mails vorliegen; einen fehlgeschlagenen Abruf klar davon unterscheiden.
- Niemals E-Mails automatisch versenden, verändern, löschen oder als gelesen markieren.

### Persönliche Termine – Apple-Kalender als aktueller Entwicklungsschritt

- Ausschließlich nativer Apple-Kalender; manueller Export über einen selbst erstellten Apple-Kurzbefehl als lokale JSON-Datei. Kein Google-Kalenderdienst erforderlich.
- Lokaler Import mit eigenem Speicherbereich, Export-/Importstand, Heute/Morgen/nächste sieben Tage, Uhrzeit, Titel, Ort, Hinweisen, Ganztags- und mehrtägigen Terminen sowie hervorgehobenem nächsten Termin.
- Müllkalender, bestehende Küchenfunktionen und bestätigte Dashboard-Anordnung bleiben separat erhalten.
- Keine automatische Synchronisierung: Änderungen benötigen erneuten Export und Import; keine privaten Dateien in GitHub.
- Anleitung in APPLE_KALENDER.html. Import technisch geprüft; echter Kurzbefehle-Durchlauf und Geräteabnahme auf iPadOS 16.7.16 noch offen. Keine vorgetäuschte native Direktverbindung.
- Gmail und gesprochenes KI-Briefing folgen als separate spätere Schritte.

### Weitere Terminfunktionen

- Termine für heute, morgen und die nächsten sieben Tage abrufen.
- Uhrzeit und Bezeichnung anzeigen und im Morgenbriefing an bevorstehende Termine erinnern.
- Bestehende Müllabholtermine weiterhin berücksichtigen.

### Privatsphäre und Freigabe

- Auf dem gemeinsam genutzten iPad private E-Mail-Inhalte nur nach ausdrücklicher Freigabe vorlesen; keine automatische Sprachausgabe dieser Inhalte.
- Vor einer Kontoverbindung Berechtigungen, Zugriffsschutz auf dem gemeinsam genutzten Gerät, Datenübertragung, Speicherung, Widerruf und Dienstkosten prüfen und abstimmen.
- Keine privaten Zugangsdaten, Zugriffstoken, E-Mail-Inhalte oder persönlichen Kalenderdaten in GitHub Pages, öffentlichen Build-Artefakten oder im Repository speichern.
- Falls ein externer Dienst benötigt wird, Geheimnisse ausschließlich sicher serverseitig verwalten; minimale, lesende Berechtigungen verwenden.

Diese Anforderungen ersetzen die frühere Einordnung von E-Mail und persönlichen Kalendern als erst nach Phase 5 folgende optionale Funktionen. Sie sind Bestandteil der verbindlichen Phase 5, wobei aktuell nur die Morgenansicht umgesetzt wird.

## Architektur für spätere Phasen

- Der Ansichtscontroller und die Darstellung bleiben vom öffentlichen Datenabruf getrennt.
- `data.json` enthält ausschließlich öffentliche Wetter- und Nachrichtendaten. Persönliche Termine und Rezepte gehören nicht in diese Datei oder das öffentliche Repository.
- Für Phase 3 zunächst lokale Speicherung auf dem iPad vorsehen, mit späterer Export-/Sicherungsmöglichkeit. Noch keine Synchronisierung implementiert.
- KI- und Plattformzugriffe können einen sicheren externen Dienst erfordern. Schlüssel ausschließlich serverseitig in dessen Secret-Verwaltung; Authentifizierung, begrenzte Berechtigungen, Ratenlimits und minimale Datenübertragung vor Einführung festlegen.
- Der Browser ruft später nur die definierte Schnittstelle auf. Ein Platzhalter oder kommentierter Architekturhinweis ist noch keine implementierte Dienstanbindung.
- Keine neuen Cloud-Kosten oder Kontoverbindungen ohne konkreten Bedarf und Abstimmung.
