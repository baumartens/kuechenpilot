# Phase 3 – technische Prüfung

Stand: 17. November 2026. Phase 2 ist vom Nutzer auf dem echten iPad freigegeben. Phase 3 braucht noch die Geräteabnahme. Phase 4 wurde nicht begonnen.

## Automatisiert ausgeführt

- `node --test test_kitchen.cjs`: 7 Tests erfolgreich. ICS-Zeilenfaltung, Escape-Zeichen, Sortierung, vergangene Termine, doppelte Einträge, wöchentliche Serien, EXDATE, verschobene/abgesagte Ausnahmen, RDATE, Kalendertage mit Uhrzeit, ungültige und zu häufige Serien, Zweijahresgrenze, Rezeptvalidierung und Timer nach Zeitablauf/Pause.
- `python3 -m unittest -v test_fetch.py`: bestehende 4 Tests erfolgreich. Quellenausfälle bleiben getrennt, letzte Erfolgsdaten und Zeitstempel erhalten, unsichere RSS-Links und XML abgewiesen.
- JavaScript-Syntaxprüfung erfolgreich.
- Echter Abruf von Open-Meteo, Deutschlandfunk, DW und SRF erfolgreich. Die Abruflogik wurde nicht geändert; lediglich die explizite Dateiliste für die Veröffentlichung wurde erweitert.

## Im lokalen Browser tatsächlich geprüft

- Rezept angelegt, bearbeitet, nach Neuladen wiedergefunden; Suchfeld verwendet.
- JSON-Sicherung heruntergeladen, über Dateiauswahl wieder importiert, zusätzliches Testrezept gelöscht.
- Kochschritte vor/zurück, letzter Schritt begrenzt, Fortschritt nach Neuladen erhalten.
- Vorlesen meldete gestartete und beendete Wiedergabe; Stopp bedient. Dies ist keine Bestätigung der hörbaren Qualität auf dem iPad.
- Drei Timer gleichzeitig, Pause, Fortsetzen, Begrenzung auf drei, sichtbarer Ablauf, Abschluss/Entfernen. Zustände nach Neuladen korrekt; ein pausierter Timer lief währenddessen nicht weiter. Alarmaktivierung bedient, Hörtest auf dem echten Gerät offen.
- ICS-Testdatei über die Dateiauswahl importiert: 5 erwartete Termine einschließlich Wiederholung und EXDATE. Ungültige Folgedatei ließ den Kalender unverändert. Termine blieben nach Neuladen erhalten. Keine echten persönlichen Abholdaten getestet.
- hr1, hr3, Deutschlandfunk: Browser meldete `playing`, Medienzustand `paused=false`, `readyState=3`; Senderwechsel und Fortsetzung beim Ansichtswechsel. Start/Stopp bedient. Kein Hör- oder Sperrbildschirmtest auf dem echten iPad.
- 1024 × 768 und 768 × 1024: Ansichten und Touchbedienung geprüft; kein horizontaler Überlauf im Hochformat. Scrollen innerhalb der Ansicht bleibt bei langem Inhalt möglich.
- Alle vier Nachrichtenfilter liefern weiterhin höchstens drei Artikel. Warnungen für den später veralteten lokalen Datenstand sichtbar. Keine JavaScript-Fehler im Browserprotokoll.

## Safari-16-Kompatibilität und Grenzen

Kein Framework, keine externen Fonts, keine Hintergrundanimation. App-Dateien etwa 68 KB; die rund 92 KB große ICS-Bibliothek wird nur im Import-Worker geladen und danach freigegeben. Grenzen für Dateien, Rezepte, Termine und Timer schützen den begrenzten Gerätespeicher. Eigene App-Daten bleiben getrennt von öffentlichem `data.json`.

Verwendete Dialoge, dynamische Viewport-Einheiten und `:has()` sind bereits seit Safari 15.4 verfügbar: [Apple Release Notes](https://developer.apple.com/documentation/safari-release-notes/safari-15_4-release-notes). Vorlesen wird auf Verfügbarkeit geprüft; WebKit beschreibt die vorhandene Sprachsynthese in [Safari 14.1](https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/). Audio startet nur nach einer Nutzeraktion. Keine neueren APIs wie File System Access, OffscreenCanvas oder Notification-Tricks erforderlich.

Diese Code-/Browserprüfung ersetzt keinen Test unter iPadOS 16.7.16. Nicht gemessen: tatsächlicher RAM-Verbrauch auf dem iPad, hörbare Stimmen-/Radioqualität, Dateidialog in iPad-Safari, Verhalten bei Sperrbildschirm und Speicherdruck. Bei Hintergrundbetrieb kann Safari Timer und Audio unterbrechen; es gibt keine Alarmgarantie. Lokale Daten können durch Löschen der Safari-Websitedaten verloren gehen.

## Kurze Geräteabnahme

1. Live-Seite neu laden, Morgen im Quer- und Hochformat ansehen; Wetter und Nachrichten prüfen.
2. „Kalender verwalten“ → eigene ICS-Datei wählen, die nächsten Abholdaten vergleichen, neu laden.
3. Rezept mit Zutaten und mindestens drei Schritten speichern, bearbeiten; Seite neu laden. Sicherungsdatei in „Dateien“ ablegen und testweise importieren.
4. „Kochen“ öffnen, vor/zurück wechseln und Schritt vorlesen/stoppen.
5. Drei kurze Timer starten, einen pausieren/fortsetzen. „Alarmton testen / aktivieren“ antippen, Ablauf und hörbaren Ton bei geöffnetem Safari prüfen. Nach Neuladen Ton erneut aktivieren.
6. Alle drei Radiosender hörbar prüfen, beim Abspielen zu Morgen wechseln, wieder zum Radio und stoppen. Optional Sperrbildschirmverhalten beobachten.

Erst nach Bestätigung dieser Phase beginnt Phase 4. Roadmap für Phase 4/5 bleibt in ROADMAP.md erhalten.
