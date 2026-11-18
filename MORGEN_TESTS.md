# Persönlicher Morgenassistent – Dashboard und Anbindungsprüfung

18. November 2026. Phase 4 bewusst pausiert, keine vollständige Abnahme. Aktuell nur neue Morgenansicht; Kontozugriff und KI-Stimme nicht implementiert.

## Prüfungen

28 automatisierte Tests bestanden: 24 Node-Tests und 4 Python-Tests. Neue Fälle: alle vier Müllfarben, kombinierte Titel, unbekannte Titel, heute und morgen gleichzeitig, nächste Abholung, leerer Kalender, Jahreswechsel, Sommerzeitwechsel sowie aktuelle/veraltete Wetterhinweise.

Browserprüfung: vorhandener lokaler Kalender ohne Neuimport angezeigt. In separater lokaler Testumgebung synthetische ICS-Datei mit Restmüll/Papier heute und Bio/Gelbem Sack morgen importiert. Nach Neuladen alle vier Arten sowie „Abholung heute“ und „Heute Abend rausstellen!“ erhalten. Leerer Kalender zeigt ehrliche fehlende Daten. E-Mail und Termine zeigen „Noch nicht verbunden“; Briefing-Button deaktiviert. Querformat 1024 × 768 und Hochformat 768 × 1024 geprüft. Keine private ICS-Datei hochgeladen oder veröffentlicht.

Unverändert: lokaler Speicherschlüssel und Datenformat, Rezeptimport, Radio, Timer, Kochbegleiter, ICS-Parser, öffentliche Wetter-/Nachrichtenabrufe und Maximalzahl drei Meldungen. Erweiterung des Wetterrenderings nur um einen lokalen, regelbasierten Tageshinweis; kein KI-Ergebnis. Bei fehlenden/älteren oder fehlgeschlagenen Wetterdaten kein praktischer Hinweis aus veralteten Werten.

Müllarten werden anhand der Titel zugeordnet. Unbekannte Bezeichnungen bleiben mit neutralem Symbol und Originaltitel sichtbar. Tageswechsel wird bei Rückkehr in die App und bei geöffneter Ansicht einmal pro Minute berücksichtigt. Die Datumslogik nutzt wie bisher das lokale Gerätedatum. Für Groß-Zimmern sollte das iPad auf deutsche Ortszeit eingestellt sein. Keine garantierten Hintergrundbenachrichtigungen.

Die Prüfung auf dem echten iPad 5/iPadOS 16.7.16 steht aus. Bestehende Phase-3-Gerätefreigabe bleibt gültig; keine neue Gerätefreigabe behauptet.

## Sichere Anbindung – Vorschlag, noch nicht eingerichtet

Gmail: offizielle Google-OAuth-Verbindung mit `gmail.readonly`. Diese Berechtigung erlaubt Lesen, nicht Senden, Löschen, Ändern oder als gelesen markieren. Sie ist dennoch weitreichend: Zugriff auf das Postfach, nicht technisch auf „wichtige“ E-Mails begrenzt. Die App muss ihre Abfragen auf neue relevante Nachrichten begrenzen. Google stuft den Scope als eingeschränkt ein; je nach Veröffentlichung und serverseitiger Verarbeitung können Verifikation und Sicherheitsprüfung erforderlich werden. Vor Kosten oder Einrichtung den konkreten persönlichen Einsatzfall prüfen. [Offizielle Gmail-Berechtigungen](https://developers.google.com/workspace/gmail/api/auth/scopes).

Kalender: möglichst `calendar.events.owned.readonly` für eigene Kalender; nur bei benötigten freigegebenen Kalendern `calendar.events.readonly`. Keine Schreibberechtigungen. Auswahl der Kalender und Zeitraum heute/morgen/nächste sieben Tage explizit festlegen; Ganztagstermine und Zeitzonen berücksichtigen. [Offizielle Kalender-Berechtigungen](https://developers.google.com/workspace/calendar/api/auth).

Vorgeschlagene Architektur: GitHub Pages bleibt öffentliche Oberfläche. Ein separat geschützter Dienst führt Google OAuth aus, verwahrt Refresh-Token verschlüsselt serverseitig und bietet ausschließlich lesende Endpunkte. Keine Token in URLs, GitHub, Actions-Artefakten oder Browser-Dauerspeicher. Zugriff über authentifizierte kurzlebige Sitzung, passende SameSite-/CSRF-Sicherung und enge erlaubte Herkunft; keine öffentliche Kontodaten-Schnittstelle. Für unbeaufsichtigten Abruf beschreibt Google einen serverseitigen Ablauf. [Google-Serverautorisierung](https://developers.google.com/workspace/gmail/api/auth/web-server).

Privatsphäre: gemeinsame iPad-Nutzung erfordert separate Entsperrung vor privaten Inhalten, kurze Sitzung, Sperren beim Verlassen, keine privaten Inhalte in Protokollen/öffentlichen Caches. E-Mail-Text nicht dauerhaft speichern; Trennen der Verbindung löscht gespeicherte Zugriffstoken. Spätere KI-Zusammenfassung übermittelt Inhalte nur nach gesonderter Zustimmung an den vereinbarten Anbieter. Vorlesen privater Inhalte benötigt zusätzlich ausdrückliche Freigabe. Fehlerzustände müssen von „keine wichtigen E-Mails“ bzw. „keine Termine“ getrennt bleiben.

Kosten: jetzt kein neuer Dienst, kein Konto verbunden, keine kostenpflichtige Einrichtung. Vor Umsetzung Anbieter, Region, Aufbewahrung, Verifikationsbedarf und konkrete Hosting-/KI-Kosten vorlegen. Keine pauschale Kostenlosigkeitszusage für die spätere Lösung.

## iPad-Test

App im bisherigen Safari öffnen und neu laden, ohne Websitedaten zu löschen. Vorhandene Mülltermine und Farben mit Kalender vergleichen; kein erneuter Import nötig, wenn dort Daten gespeichert sind. Reihenfolge, Quer-/Hochformat und Scrollen prüfen. E-Mail/Termine müssen unverbunden bleiben. Wetterhinweis und maximal drei Nachrichten prüfen. Anschließend Radio, vorhandenes Rezept/Kochbegleiter und Timer kurz öffnen. Kontoanbindung erst nach eigener gesonderter Freigabe.
