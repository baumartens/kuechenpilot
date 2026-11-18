(function(root){
'use strict';
function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function cleanSource(value){if(!value)return '';var parser=typeof RecipeImport!=='undefined'?RecipeImport:require('./recipe-import.js');return parser.videoLink(value).url;}
function cleanRecipe(r){
 if(!r||typeof r.title!=='string'||!r.title.trim()||r.title.length>120)throw Error('Bitte einen Rezeptnamen mit höchstens 120 Zeichen eingeben.');
 if(!Number.isInteger(Number(r.servings))||Number(r.servings)<1||Number(r.servings)>100)throw Error('Portionen: Bitte eine ganze Zahl von 1 bis 100 eingeben.');
 function lines(v,max){if(!Array.isArray(v)||!v.length||v.length>max||v.some(function(s){return typeof s!=='string'||!s.trim()||s.length>2000;}))throw Error('Zutaten und Schritte brauchen jeweils mindestens eine Zeile; höchstens '+max+' Zeilen mit je 2.000 Zeichen.');return v.map(function(s){return s.trim();});}
 return {id:typeof r.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(r.id)?r.id:'r'+Date.now()+'_'+Math.random().toString(36).slice(2,9),title:r.title.trim(),servings:Number(r.servings),ingredients:lines(r.ingredients,100),steps:lines(r.steps,100),sourceUrl:cleanSource(r.sourceUrl)};
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
function wasteTypes(title){
 var t=title.toLowerCase(),types=[];
 if(/rest|hausm[uü]ll|schwarz/.test(t))types.push({key:'rest',label:'Restmüll'});
 if(/papier|pappe|karton|blaue?/.test(t))types.push({key:'paper',label:'Papier'});
 if(/bio|braune?/.test(t))types.push({key:'bio',label:'Bio'});
 if(/gelb|leichtverpack|\blvp\b|wertstoff/.test(t))types.push({key:'yellow',label:'Gelber Sack / Gelbe Tonne'});
 return types.length?types:[{key:'unknown',label:title}];
}
function wasteAgenda(events,now){
 var today=dateKey(now),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),nextDay=dateKey(tomorrow);
 var rows=events.filter(function(e){return e.date>=today;}).slice().sort(function(a,b){return a.date.localeCompare(b.date);});
 var urgent=rows.filter(function(e){return e.date===today||e.date===nextDay;});
 var selected=urgent.length?urgent:rows.filter(function(e){return e.date===rows[0].date;});
 return selected.map(function(e){return {date:e.date,title:e.title,types:wasteTypes(e.title),message:e.date===today?'Abholung heute':e.date===nextDay?'Heute Abend rausstellen!':'Nächste Abholung',urgent:e.date===today||e.date===nextDay};});
}
function weatherAdvice(w,now){
 if(!w||!w.ok||!w.value||!w.value.current||!w.fetchedAt||!Number.isFinite(Date.parse(w.fetchedAt))||now-Date.parse(w.fetchedAt)>7200000)return 'Kein aktueller Tageshinweis – Wetterdaten fehlen oder sind veraltet.';
 var c=w.value.current,d=w.value.daily||{},h=[];
 if(c.wind_speed_10m>=40)h.push('Draußen auf kräftigen Wind einstellen.');
 if(c.temperature_2m<=3)h.push('Warm anziehen; bei Nässe auf glatte Wege achten.');
 else if(c.temperature_2m>=28)h.push('Wasser mitnehmen und Schattenpausen einplanen.');
 if(d.precipitation_probability_max&&d.precipitation_probability_max[0]>=50||c.weather_code>=51)h.push('Regenschutz mitnehmen.');
 return h.length?h.join(' '):'Vor dem Losgehen Temperatur und Tagesprognose prüfen. Für längere Wege eine zusätzliche Schicht einpacken.';
}
var api={wasteTypes:wasteTypes,wasteAgenda:wasteAgenda,weatherAdvice:weatherAdvice,dateKey:dateKey,cleanRecipe:cleanRecipe,remaining:remaining,parseCalendar:parseCalendar};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KitchenCore=api;
})(typeof self!=='undefined'?self:this);
