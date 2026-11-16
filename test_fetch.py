import unittest
import fetch_data as app

class Reliability(unittest.TestCase):
    def test_source_failure_preserves_timestamp_and_data(self):
        previous = {'value':[{'title':'Vorherige Meldung'}], 'fetchedAt':'2026-01-01T12:00:00+00:00'}
        def fail():
            raise OSError('offline')
        result = app.collect('test',fail,previous)
        self.assertFalse(result['ok'])
        self.assertEqual(result['value'],previous['value'])
        self.assertEqual(result['fetchedAt'],previous['fetchedAt'])

    def test_namespaced_feed_and_unsafe_links(self):
        raw = b'<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/"><item><title>Welt &amp; Wissen</title><link>https://example.org/news</link></item><item><title>Bad</title><link>javascript:alert(1)</link></item></rdf:RDF>'
        items = app.parse_feed(raw)
        self.assertEqual(len(items),1)
        self.assertEqual(items[0]['title'],'Welt & Wissen')

    def test_failed_source_does_not_block_other_sources(self):
        def failed_weather():
            raise OSError('offline')
        result = app.build({},failed_weather,lambda url:[{'title':'Test', 'url':'https://example.org'}])
        self.assertFalse(result['weather']['ok'])
        self.assertTrue(all(result[key]['ok'] for key in app.FEEDS))

    def test_rejects_empty_or_entity_xml(self):
        for raw in [b'<rss><channel/></rss>',b'<!DOCTYPE rss><rss/>']:
            with self.assertRaises(ValueError):
                app.parse_feed(raw)
