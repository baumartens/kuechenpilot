(function(root){
'use strict';
function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function cleanRecipe(r){
 if(!r||typeof r.title!=='string'||!r.title.trim()||r.title.length>120)throw Error('Bitte einen Rezeptnamen mit höchstens 120 Zeichen eingeben.');
 if(!Number.isInteger(Number(r.servings))||Number(r.servings)<1||Number(r.servings)>100)throw Error('Portionen: Bitte eine ganze Zahl von 1 bis 100 eingeben.');
 function lines(v,max){if(!Array.isArray(v)||!v.length||v.length>max||v.some(function(s){return typeof s!=='string'||!s.trim()||s.length>2000;}))throw Error('Zutaten und Schritte brauchen jeweils mindestens eine Zeile; höchstens '+max+' Zeilen mit je 2.000 Zeichen.');return v.map(function(s){return s.trim();});}
 return {id:typeof r.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(r.id)?r.id:'r'+Date.now()+'_'+Math.random().toString(36).slice(2,9),title:r.title.trim(),servings:Number(r.servings),ingredients:lines(r.ingredients,100),steps:lines(r.steps,100)};
}
function remaining(timer,now){return Math.max(0,timer.paused?timer.remaining:timer.deadline-now);}
function parseCalendar(raw,ICAL,now){
 if(typeof raw!=='string'||raw.length>1000000)throw Error('Die ICS-Datei darf höchstens 1 MB groß sein.');
 var calendar;try{calendar=new ICAL.Component(ICAL.parse(raw));}catch(error){throw Error('Die Datei ist kein lesbarer ICS-Kalender. Bitte die Originaldatei erneut herunterladen.');}
 if(calendar.name!=='vcalendar')throw Error('Keine gültige Kalenderdatei.');
 var components=calendar.getAllSubcomponents('vevent');
 if(!components.length||components.length>3000)throw Error('Der Kalender muss 1 bis 3.000 Termine enthalten.');
 var today=new Date(now);today.setHours(0,0,0,0);var until=new Date(today);until.setFullYear(until.getFullYear()+2);
 var from=dateKey(today),to=dateKey(until),rows=[],seen=new Set(),masters=new Map(),exceptions=[];
 function key(t){return String(t.year).padStart(4,'0')+'-'+String(t.month).padStart(2,'0')+'-'+String(t.day).padStart(2,'0');}
 function add(t,event){
  if(event.component.getFirstPropertyValue('status')==='CANCELLED')return;
  var day=key(t),title=(event.summary||'Abholung').trim().slice(0,200),unique=day+'|'+title;
  if(day>=from&&day<=to&&!seen.has(unique)){seen.add(unique);rows.push({date:day,title:title});}
  if(rows.length>5000)throw Error('Zu viele Termine. Bitte einen kleineren Abfallkalender auswählen.');
 }
 components.forEach(function(c){
  if(!c.getFirstPropertyValue('dtstart'))throw Error('Ein Termin hat kein Startdatum. Der bisherige Kalender bleibt erhalten.');
  var e=new ICAL.Event(c), rules=c.getAllProperties('rrule');
  rules.forEach(function(p){if(['DAILY','WEEKLY','MONTHLY','YEARLY'].indexOf(p.getFirstValue().freq)<0)throw Error('Wiederholungen unter einem Tag werden nicht unterstützt.');});
  if(c.hasProperty('recurrence-id'))exceptions.push(e);
  else {var uid=e.uid||'generated-'+masters.size;if(masters.has(uid))throw Error('Mehrere Versionen desselben Termins. Bitte den Kalender neu exportieren.');masters.set(uid,e);}
 });
 exceptions.forEach(function(e){var parent=masters.get(e.uid);if(!parent)throw Error('Ein geänderter Serientermin hat keinen Ursprungstermin.');parent.relateException(e);});
 masters.forEach(function(e){
  if(e.component.getFirstPropertyValue('status')==='CANCELLED')return;
  if(!e.isRecurring()){add(e.startDate,e);return;}
  if(!e.component.hasProperty('rrule')){
   var excluded=e.component.getAllProperties('exdate').some(function(p){return p.getValues().some(function(t){return t.compare(e.startDate)===0;});});
   if(!excluded){var initial=e.getOccurrenceDetails(e.startDate);add(initial.startDate,initial.item);}
  }
  var iterator=e.iterator(),occ,count=0;
  while((occ=iterator.next())){if(++count>20000)throw Error('Die Terminserie ist zu umfangreich. Bitte einen aktuellen Kalender exportieren.');if(key(occ)>to)break;var detail=e.getOccurrenceDetails(occ);add(detail.startDate,detail.item);}
 });
 // Also include exceptions moved into the window from outside it.
 exceptions.forEach(function(e){add(e.startDate,e);});
 rows.sort(function(a,b){return a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de');});
 if(!rows.length)throw Error('Keine kommenden Termine in den nächsten zwei Jahren gefunden. Der bisherige Kalender bleibt erhalten.');
 return {events:rows,importedAt:new Date(now).toISOString(),through:to};
}
var api={dateKey:dateKey,cleanRecipe:cleanRecipe,remaining:remaining,parseCalendar:parseCalendar};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KitchenCore=api;
})(typeof self!=='undefined'?self:this);
