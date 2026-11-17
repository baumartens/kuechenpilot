/* Parsing stays off the iPad UI thread; no calendar data leaves the device. */
importScripts('ical.min.js','kitchen-core.js');
self.onmessage=function(event){try{self.postMessage({calendar:KitchenCore.parseCalendar(event.data.text,ICAL,event.data.now)});}catch(error){self.postMessage({error:error.message||'Kalender konnte nicht gelesen werden.'});}};
