# Phase 2 – Prüfprotokoll

Stand: 17. November 2026. Der echte iPad-Test der neuen Oberfläche ist noch offen.

## Erfolgreich technisch geprüft

- Live-Abruf: Wetter Groß-Zimmern sowie Deutschlandfunk, Deutsche Welle und SRF erfolgreich.
- Vier bestehende Python-Tests bestanden: Ausfall-Isolation, Erhalt alter Daten und Zeitstempel, RSS-Namensräume/sichere Links, ungültige XML-Daten.
- JavaScript-Syntaxprüfung mit `node --check` bestanden.
- Browser: Morgen, Kochen, Rezepte und Radio als eigenständige Ansichten; direkte Rezept-URL bleibt nach Neuladen erhalten.
- Alle vier Nachrichtenfilter zeigen jeweils höchstens drei Meldungen.
- Datenstand-Dialog öffnet und schließt; Abrufzeitpunkte und Quellen sichtbar.
- Veraltete und fehlerhafte Quellen simuliert: Warnungen erscheinen, drei gespeicherte Meldungen bleiben sichtbar.
- Fehlende Datendatei simuliert: Verbindungswarnung erscheint, letzte gespeicherte Daten bleiben erhalten.
- Querformat 1024×768 und Hochformat 768×1024 visuell geprüft. Kein horizontaler Überlauf im Hochformat. Feste Navigation bleibt sichtbar; nur die aktuelle Ansicht scrollt bei Bedarf.
- Datenabrufskript, JSON-Schema, Nachrichtenlimit und Actions-Workflow bleiben erhalten.

## Grenzen

Ein Desktop-Browser mit Tablet-Abmessungen ist kein Test von iPadOS 16.7.16, Safari auf dem iPad oder dessen Speicher- und Audiobeschränkungen. Phase 3 beginnt erst nach Bestätigung des neuen Designs auf dem echten iPad.

## Abnahme auf dem iPad

1. Live-Adresse direkt in Safari vollständig neu laden.
2. Alle vier Navigationsbereiche öffnen; es soll jeweils nur die gewählte Ansicht erscheinen.
3. Im Morgen-Dashboard Temperatur, drei Nachrichten, jeden Quellenfilter und „Aktualisieren“ prüfen.
4. „Datenstand & Quellen“ öffnen und wieder schließen.
5. Ins Hochformat drehen, wieder ins Querformat wechseln; Navigation und Inhalte müssen erreichbar bleiben.
6. Safari verlassen und zurückkehren; Datenanzeige und Navigation erneut prüfen.

Platzhalter in Kochen, Rezepte, Radio, Müllabholung und Briefing sind absichtlich nicht als fertige Funktionen bedienbar.
