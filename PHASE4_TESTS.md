# Phase 4 – Prüfstand und Grenzen

Stand: 18. November 2026. Phase 3 wurde vom Nutzer vollständig auf dem echten iPad 5 freigegeben. Phase 4 wartet nach Veröffentlichung auf dessen Geräteprüfung. Phase 5 wurde nicht begonnen; ihre erweiterten Anforderungen stehen verbindlich in ROADMAP.md.

## Tatsächlich geprüft

- 19 Node-Tests (7 bestehende Küchenfunktionen, 12 Importtests) und 4 Python-Tests bestanden.
- Textfälle: Überschriften, nummerierte Schritte, Emoji-Listen, Dezimalkomma, Brüche, Mengenbereiche, fehlende Schritte, mehrere Rezepte, Inline-Überschriften, ungültige Links, unveränderte Alt-Rezepte und Quelle beim JSON-Rundlauf.
- Browser: echter YouTube-Link https://www.youtube.com/watch?v=8SOGnNHz8uU liefert den Titel „Schnelle Pasta in 20 Minuten“. Beschreibung über Browser nicht abrufbar; entsprechende Meldung sichtbar. Manuell eingefügte tatsächliche Beschreibung ergibt 12 Zutaten, 4 nummerierte Schritte und 2 Portionen. Keine Rezeptinhalte aus dem Link erfunden.
- Browser: echter Instagram-Link https://www.instagram.com/reel/C5UkUukuuyg/ liefert keine zugängliche Beschreibung. Verständliche Fehlermeldung mit manueller Texteingabe geprüft. Kein erfolgreicher automatischer Instagram-Import behauptet.
- Zusätzlich synthetische eingefügte Beschreibungen mit Reis und Haferfrühstück geprüft; lokale Extraktion und editierbare Vorschau funktionieren.
- Titel in der Vorschau bearbeitet, gespeichert, neu geladen: Rezept und Originalvideo erhalten. Bereits vorhandenes Phase-3-Testrezept blieb erhalten.
- Importiertes Rezept im Kochbegleiter geöffnet und nächsten Schritt aufgerufen.
- Erneuter Import desselben YouTube-Videos mit youtu.be-Kurzlink: Rückfrage erscheint. Abbrechen und Neuladen: weiterhin zwei Rezepte, keine zusätzliche Speicherung.
- Sichtprüfung der Vorschau bei 1024 × 768 und 768 × 1024; lange Formulare scrollen innerhalb des Dialogs.
- Bestehendes Inline-Skript für Navigation, Wetter und Nachrichten bytegleich erhalten. Bestehende Wetter-/RSS-Abruflogik nicht verändert; nur neue statische Dateien in die Veröffentlichungsliste aufgenommen.

Nicht erneut als echte Geräteprüfung beansprucht: Safari/iPadOS 16.7.16, hörbares Vorlesen, Radio und Hintergrundalarme. Die Phase-3-Gerätefreigabe stammt vom Nutzer. Die neue Implementierung nutzt vorhandene Dialoge, lokale Speicherung und standardisierte Browserfunktionen; die abschließende iPad-Abnahme bleibt notwendig.

## Was funktioniert und was nicht

Die lokale Texterkennung funktioniert ohne Plattformzugriff und ohne KI-Dienst. Sie kann nur Angaben erkennen, die im eingefügten Text stehen. Unstrukturierte oder mehrdeutige Texte müssen bearbeitet werden. Fehlende Mengen, Portionen und Schritte werden nicht ergänzt. Die Vorschau bleibt verbindlicher Prüfschritt.

Der automatische Linkabruf ist ein Versuch, keine Garantie. Der getestete YouTube-oEmbed-Endpunkt liefert einen Titel, keine Beschreibung. Direkte YouTube-/Instagram-Seiten gestatten im Test keinen browserübergreifenden Beschreibungsabruf. Die App verwendet keine fremden Scraping-Proxys, keine eingebetteten Videos und keine API-Schlüssel. Der Linkabruf erfolgt erst auf Tastendruck, ohne Anmelde-Cookies; die Plattform erhält dabei die Verbindungsdaten und den bereinigten öffentlichen Videolink. Eingefügter Text und Bibliothek werden nicht übertragen.

## Mögliche spätere Anbindung – noch nicht eingerichtet

Für einen verlässlicheren YouTube-Beschreibungsabruf käme ein geschützter externer Dienst mit offizieller YouTube Data API infrage: Browser sendet nur die Video-ID; der Dienst hält Schlüssel serverseitig, begrenzt Zugriffe und gibt erlaubte Metadaten zurück. Keine Bibliotheksübertragung, minimale Protokollierung, Authentifizierung, Missbrauchsschutz und Löschfristen vorab festlegen. Das allein garantiert keinen Zugriff auf beliebige Instagram-Beschreibungen; deren zulässige Plattformanbindung muss gesondert geprüft werden.

Aktuell kein neuer kostenpflichtiger Dienst und keine Dienstkosten eingerichtet. Kosten eines späteren Anbieters hängen von Tarif und Nutzung ab und werden vor Einrichtung konkret erläutert und abgestimmt. Geheimnisse gehören niemals in GitHub Pages. Metas oEmbed ist für Einbettungen vorgesehen und keine allgemeine Rezept-Extraktionsschnittstelle.

Offizielle Referenzen: [YouTube videos.list](https://developers.google.com/youtube/v3/docs/videos/list), [YouTube API-Einstieg](https://developers.google.com/youtube/v3/getting-started), [Instagram oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed/).

## Geräteabnahme

1. Unter Rezepte „Rezept importieren“ öffnen. Einen YouTube-Link abrufen; Titel und ehrliche Beschreibungs-Meldung prüfen. Instagram-Link ebenso versuchen.
2. Eine Rezeptbeschreibung einfügen, auswerten, Zutaten/Mengen/Schritte prüfen und etwas bearbeiten. Fehlende Angaben ergänzen.
3. Speichern, Safari neu laden: altes und neues Rezept sowie Videolink müssen vorhanden sein.
4. Dasselbe Video nochmals importieren und die Rückfrage abbrechen: kein zusätzliches Rezept.
5. Importiertes Rezept kochen, Schritte wechseln und vorlesen lassen. Sicherung exportieren; bestehende Morgen-, Müll-, Radio- und Timerfunktionen kurz prüfen.

Erst nach ausdrücklicher Freigabe durch den Nutzer beginnt Phase 5.
