(function(root){
'use strict';
function day(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dateOnly(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('Ganztagstermine brauchen YYYY-MM-DD.');var d=new Date(s+'T12:00:00');if(day(d)!==s)throw Error('Ungültiger Kalendertag.');return s;}
function instant(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/.test(s)||!Number.isFinite(Date.parse(s)))throw Error('Uhrzeiten brauchen ISO-Datum mit Zeitzone, z. B. 2026-11-19T10:00:00+01:00.');dateOnly(s.slice(0,10));return new Date(s).toISOString();}
function clean(input){
 if(!input||input.schema!=='kuechenpilot-calendar-v1'||!Array.isArray(input.events)||input.events.length>1000)throw Error('Bitte den Küchenpilot-Kalenderexport auswählen (höchstens 1.000 Termine).');
 var from=dateOnly(input.from),through=dateOnly(input.through),exportedAt=instant(input.exportedAt);if(through<from)throw Error('Ungültiger Exportzeitraum.');
 var events=[],seen=new Set();input.events.forEach(function(e){
  if(!e||typeof e.title!=='string'||!e.title.trim()||e.title.length>500||typeof e.allDay!=='boolean')throw Error('Titel oder Ganztagsangabe fehlt.');
  var start=e.allDay?dateOnly(e.start):instant(e.start),end=e.allDay?dateOnly(e.end):instant(e.end);
  if(end<=start)throw Error('Das Terminende muss nach dem Beginn liegen.');
  function text(v){if(v===undefined||v===null)return '';if(typeof v!=='string'||v.length>5000)throw Error('Ort oder Hinweise sind ungültig/zu lang.');return v;}
  var r={title:e.title.trim(),start:start,end:end,allDay:e.allDay,location:text(e.location),notes:text(e.notes)};
  var key=JSON.stringify(r);if(!seen.has(key)){seen.add(key);events.push(r);}
 });
 return {schema:input.schema,from:from,through:through,exportedAt:exportedAt,events:events};
}
function parse(raw){if(typeof raw!=='string'||raw.length>1000000)throw Error('Die Datei darf höchstens 1 MB groß sein.');var value;try{value=JSON.parse(raw.replace(/^\uFEFF/,''));}catch(e){throw Error('Die Datei enthält kein gültiges JSON. Bitte den Kurzbefehl-Export verwenden.');}return clean(value);}
function bounds(now,offset){var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset);return d;}
function between(e,from,to){return e.allDay?e.start<day(to)&&e.end>day(from):Date.parse(e.start)<to.getTime()&&Date.parse(e.end)>from.getTime();}
function select(data,now,mode){var from=bounds(now,mode==='today'?0:1),to=bounds(now,mode==='today'?1:mode==='tomorrow'?2:8);return data.events.filter(function(e){return between(e,from,to);}).sort(function(a,b){return (a.allDay?a.start+'T00:00:00':day(new Date(a.start))+'T'+new Date(a.start).toTimeString().slice(0,8)).localeCompare(b.allDay?b.start+'T00:00:00':day(new Date(b.start))+'T'+new Date(b.start).toTimeString().slice(0,8));});}
function next(data,now){return data.events.filter(function(e){return e.allDay?e.end>day(now)&&e.start<day(bounds(now,8)):Date.parse(e.end)>now.getTime()&&Date.parse(e.start)<bounds(now,8).getTime();}).sort(function(a,b){var x=a.allDay?new Date(a.start+'T00:00:00').getTime():Date.parse(a.start),y=b.allDay?new Date(b.start+'T00:00:00').getTime():Date.parse(b.start);return x-y;})[0]||null;}

var api={parse:parse,clean:clean,select:select,next:next,day:day,bounds:bounds};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PersonalCalendar=api;
})(typeof self!=='undefined'?self:this);
