"""Fetch public data server-side; preserve last successful values per source."""
import concurrent.futures
import datetime as dt
import email.utils
import html
import json
import math
import pathlib
import re
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

UTC = dt.timezone.utc
FEEDS = {
    'dlf': ('Deutschlandfunk', 'https://www.deutschlandfunk.de/nachrichten-100.rss'),
    'dw': ('Deutsche Welle', 'https://rss.dw.com/rdf/rss-de-all'),
    'srf': ('SRF International', 'https://www.srf.ch/news/bnf/rss/1922'),
}
WEATHER = 'https://api.open-meteo.com/v1/forecast?' + urllib.parse.urlencode({
    'latitude':49.8741, 'longitude':8.82898,
    'current':'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
    'daily':'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
    'timezone':'Europe/Berlin', 'forecast_days':3, 'timeformat':'unixtime'})
PREVIOUS = 'https://baumartens.github.io/kuechenpilot/data.json'

def now():
    return dt.datetime.now(UTC).isoformat()

def download(url):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent':'Kuechenpilot/1.0 (+https://github.com/baumartens/kuechenpilot)'})
            with urllib.request.urlopen(req, timeout=18) as response:
                raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError('Antwort zu groß')
            return raw
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)

def clean(value):
    return ' '.join(html.unescape(re.sub('<[^>]+>', '', value or '')).split())

def stamp(value):
    try:
        parsed = email.utils.parsedate_to_datetime(value)
    except (ValueError, TypeError):
        try:
            parsed = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        except (ValueError, TypeError, AttributeError):
            return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=UTC)
    return parsed.astimezone(UTC).isoformat()

def parse_feed(raw):
    if b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():
        raise ValueError('Nicht unterstütztes XML')
    root = ET.fromstring(raw)
    items, seen = [], set()
    for element in root.iter():
        if element.tag.split('}')[-1] not in ('item', 'entry'):
            continue
        fields = {}
        for child in element:
            key = child.tag.split('}')[-1]
            if key == 'link' and child.attrib.get('href'):
                fields[key] = child.attrib['href']
            else:
                fields[key] = child.text or ''
        title, link = clean(fields.get('title')), fields.get('link', '').strip()
        if not title or not link.startswith('https://') or link in seen:
            continue
        published = stamp(fields.get('pubDate') or fields.get('date') or fields.get('published') or fields.get('updated'))
        if published and dt.datetime.fromisoformat(published) < dt.datetime.now(UTC) - dt.timedelta(days=3):
            continue
        seen.add(link)
        items.append({'title':title[:300], 'url':link, 'publishedAt':published})
    items.sort(key=lambda x:x['publishedAt'] or '', reverse=True)
    if not items:
        raise ValueError('Keine aktuellen Meldungen im Feed')
    return items[:8]

def weather():
    payload = json.loads(download(WEATHER))
    current = payload['current']
    for key in ['temperature_2m','apparent_temperature','weather_code','wind_speed_10m','time']:
        if not isinstance(current.get(key), (float,int)) or not math.isfinite(current[key]):
            raise ValueError('Ungültige Wetterwerte')
    if abs(time.time() - current['time']) > 10800:
        raise ValueError('Wetterzeitpunkt zu alt')
    daily = payload['daily']
    for key in ['time','temperature_2m_max','temperature_2m_min','precipitation_probability_max','weather_code']:
        if len(daily.get(key, [])) < 3:
            raise ValueError('Unvollständige Vorhersage')
    return {'current':current, 'daily':daily}

def collect(key, loader, previous):
    try:
        value = loader()
        return dict(value=value, fetchedAt=now(), attemptedAt=now(), ok=True, error=None)
    except Exception as exc:
        print('WARN', key, type(exc).__name__)
        return dict(value=previous.get('value'), fetchedAt=previous.get('fetchedAt'),
                    attemptedAt=now(), ok=False, error='Quelle momentan nicht erreichbar oder Daten ungültig')

def build(previous, fetch_weather=weather, fetch_feed=None):
    fetch_feed = fetch_feed or (lambda url:parse_feed(download(url)))
    loaders = {'weather':fetch_weather}
    for key, (_, url) in FEEDS.items():
        loaders[key] = lambda url=url:fetch_feed(url)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        jobs = {key:pool.submit(collect,key,loader,previous.get(key,{})) for key,loader in loaders.items()}
        data = {key:job.result() for key,job in jobs.items()}
    return dict(schema=1, generatedAt=now(), **data)

def main():
    previous = {}
    try:
        candidate = json.loads(download(PREVIOUS))
        if candidate.get('schema') == 1:
            previous = candidate
    except Exception:
        print('Kein vorheriger veröffentlichter Datenstand erreichbar.')
    data = build(previous)
    target = pathlib.Path('public')
    target.mkdir(exist_ok=True)
    for asset in ['index.html', 'appointments.js', 'appointments-ui.js', 'APPLE_KALENDER.html', 'kitchen.css', 'recipe-import.js', 'platform-import.js', 'kitchen-core.js', 'kitchen.js', 'calendar-worker.js', 'ical.min.js', 'ICAL-LICENSE.txt']:
        (target/asset).write_bytes(pathlib.Path(asset).read_bytes())
    (target/'data.json').write_text(json.dumps(data,ensure_ascii=False,allow_nan=False),encoding='utf-8')
    for key in ['weather', *FEEDS]:
        entry = data[key]
        print(key, 'OK' if entry['ok'] else 'FEHLER', entry['fetchedAt'])
    if not any(data[key]['value'] for key in ['weather', *FEEDS]):
        raise SystemExit('Keine nutzbaren Daten. Bestehende Veröffentlichung bleibt erhalten.')

if __name__ == '__main__':
    main()
