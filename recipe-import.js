(function(root){
'use strict';
function videoLink(value){
 var text=String(value||'').trim();if(!text)return null;
 if(text.length>2048)throw Error('Der Videolink ist zu lang.');
 var u;try{u=new URL(text);}catch(e){throw Error('Bitte einen vollständigen YouTube- oder Instagram-Link mit https:// einfügen.');}
 if(!/^https?:$/.test(u.protocol)||u.username||u.password||u.port)throw Error('Bitte einen öffentlichen YouTube- oder Instagram-Link ohne Zugangsdaten verwenden.');
 var host=u.hostname.toLowerCase(),id,path=u.pathname.split('/').filter(Boolean);
 if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','youtu.be','www.youtu.be'].indexOf(host)>=0){
  if(host.endsWith('youtu.be'))id=path.length===1?path[0]:'';
  else if(u.pathname==='/watch')id=u.searchParams.get('v');
  else if(['shorts','live','embed'].indexOf(path[0])>=0&&path.length===2)id=path[1];
  if(!/^[A-Za-z0-9_-]{11}$/.test(id||''))throw Error('Dieser YouTube-Link enthält keine gültige Video-ID. Bitte den Link eines einzelnen Videos verwenden.');
  return {platform:'YouTube',key:'youtube:'+id,url:'https://www.youtube.com/watch?v='+id};
 }
 if(['instagram.com','www.instagram.com','m.instagram.com'].indexOf(host)>=0){
  if(['p','reel','reels','tv'].indexOf(path[0])<0||path.length!==2||!/^[A-Za-z0-9_-]{5,64}$/.test(path[1]))throw Error('Bitte den direkten Instagram-Link eines Beitrags oder Reels verwenden; keine Profil-, Story- oder Freigabe-Weiterleitung.');
  return {platform:'Instagram',key:'instagram:'+path[1],url:'https://www.instagram.com/'+(path[0]==='reels'?'reel':path[0])+'/'+path[1]+'/'};
 }
 throw Error('Unterstützt werden ausschließlich YouTube- und Instagram-Videolinks.');
}
function sourceKey(value){try{var link=videoLink(value);return link?link.key:'';}catch(e){return '';}}
function stripPrefix(s){return s.replace(/^[\s*#_~•●▪◾☑✅→➜\-–—\uFE0F]+/u,'').replace(/^[^\p{L}\p{N}¼½¾⅓⅔⅛⅜⅝⅞(]+/u,'').trim();}
var quantity='(?:\\d+(?:[.,]\\d+)?(?:\\s+\\d+[/⁄]\\d+|[/⁄]\\d+|[¼½¾⅓⅔⅛⅜⅝⅞])?|[¼½¾⅓⅔⅛⅜⅝⅞])(?:\\s*[–-]\\s*\\d+(?:[.,]\\d+)?)?';
var amountRE=new RegExp('^(?:(?:ca\\.?|etwa|circa)\\s*)?('+quantity+')\\s*(kg|mg|g|ml|cl|dl|l|EL|TL|Esslöffel|Teelöffel|cups?|tbsp|tsp|oz|lbs?|Prisen?|Päckchen|Packungen?|Dosen?|Bund|Handvoll|Zehen?|Stück)?(?=\\s|[A-Za-zÄÖÜäöüß]|$)\\s*(.*)$','i');
function ingredientParts(line){
 var s=stripPrefix(line),m=s.match(amountRE);
 if(m){var unit=m[2]||'',rest=m[3].trim();if(unit&&rest&&!/^\s/.test(s.slice(s.indexOf(m[1])+m[1].length))){/* compact 200g is valid */}
  // A unit prefix must not eat the first letter of a food, e.g. "2 Limetten".
  var rawAfter=s.slice(s.indexOf(m[1])+m[1].length).trim();
  if(unit&&new RegExp('^'+unit+'[a-zäöüß]','i').test(rawAfter)){unit='';rest=rawAfter;}
  return {amount:m[1]+(unit?' '+unit:''),name:rest||s,unclear:!rest||/^(?:gut|gehäuft|gestrichen)/i.test(rest)||/^(?:ca\.?|etwa|circa)\s/i.test(s)};
 }
 return {amount:'Menge prüfen',name:s,unclear:true};
}
function splitSteps(text){
 if(/^(?:Schritt\s*)?\d+[.)\-:]\s*/i.test(text.trim()))return [stripPrefix(text).replace(/^(?:Schritt\s*)?\d+[.)\-:]\s*/i,'').trim()].filter(Boolean);
 return text.replace(/([.!?])\s+(?=[A-ZÄÖÜ])/g,'$1\n').split(/\n|;\s*/).map(function(s){return stripPrefix(s).replace(/^(?:Schritt\s*)?\d+[.)\-:]\s*/i,'').trim();}).filter(Boolean);
}
function parseDescription(raw,titleHint){
 if(typeof raw!=='string'||raw.length>30000)throw Error('Bitte höchstens 30.000 Zeichen auf einmal einfügen.');
 if(!raw.trim())throw Error('Bitte zuerst die Rezeptbeschreibung einfügen.');
 var normalized=raw.replace(/\r\n?/g,'\n').replace(/\u00a0/g,' ').replace(/([0-9])\uFE0F?\u20E3/g,'\n$1. ').replace(/[☑✅▪◾●•]/g,'\n• ');
 // Headings may occur in one copied paragraph; keep their following content.
 normalized=normalized.replace(/\b(Zutaten|Ingredients)(\s*\([^\n)]{0,80}\)|\s+(?:für|for)\s+\d+(?:\s*[–-]\s*\d+)?\s*(?:Personen?|Portionen?|servings?))\s*:/gi,'\n$1$2:\n');
 normalized=normalized.replace(/\b(Zutaten|Ingredients|Zubereitung|Zubereitungsschritte|Anleitung|Instructions|Directions|Method|Vorbereitung)\s*:/gi,'\n$1:\n');
 normalized=normalized.replace(/\s+(\d{1,2}[.)])\s+(?=[A-ZÄÖÜ])/g,'\n$1 ');
 var result={title:'',servings:'',ingredients:[],steps:[],unassigned:[],warnings:[]},section='',candidates=[],hasIngredientHeading=false,hasStepHeading=false,recipeCount=0;
 var servings=normalized.match(/(?:für|for)\s+(\d+)(?:\s*[–-]\s*\d+)?\s*(?:Portionen?|Personen?|servings?)|(?:Portionen?|servings?)\s*:?\s*(\d+)/i);
 if(servings){result.servings=Number(servings[1]||servings[2]);if(/[–-]/.test(servings[0])){result.servings='';result.warnings.push('Die Portionszahl ist als Bereich angegeben. Bitte eine Zahl festlegen.');}}
 normalized.split('\n').forEach(function(rawLine){
  var line=stripPrefix(rawLine);if(!line)return;
  if(/^(?:rezept|recipe)\s*\d+\b/i.test(line))recipeCount++;
  if(/^https?:\/\//i.test(line)||/^\s*#/.test(rawLine)||/^(?:folg(?:e|t)?\b|follow\b|abonni|subscribe|werbung|anzeige|rabatt|discount|mein(?:e)?\s+(?:shop|kanal)|nährwerte|nutrition|kalorien|kcal|social media)/i.test(line))return;
  var heading=line.match(/^(Zutaten|Ingredients)\b(.*)$/i);
  if(heading){section='ingredients';hasIngredientHeading=true;var rest=heading[2].replace(/^\s*[:\-]\s*/,'').trim();if(rest&&!/^(?:\(?für|\(?for|\(?\d+\s*(?:Portion|Person|serving))/i.test(rest)){if(amountRE.test(rest))rest.split(/;\s*|,\s+(?=\d|[¼½¾⅓⅔])/).forEach(function(s){result.ingredients.push(s.trim());});else result.unassigned.push(rest);}return;}
  heading=line.match(/^(Zubereitung(?:sschritte)?|Anleitung|Instructions|Directions|Method|Vorbereitung|So geht(?:'s|’s|s)?|Und so geht(?:'s|’s|s)?)\s*[:\-]?\s*(.*)$/i);
  if(heading){section='steps';hasStepHeading=true;if(heading[2])result.steps=result.steps.concat(splitSteps(heading[2]));return;}
  if(/^(?:Tipps?|Hinweis|Notes?|Guten Appetit|Viel Spaß|Zum Video|Kapitel|Timestamps)(?:\s|[:.!?]|$)/i.test(line)){section='notes';result.unassigned.push(line);return;}
  if(/(?:anleitung|zubereitung|schritte|rezept).*(?:im video|im reel|auf.*kanal|in der bio)|(?:siehe|schau).*video/i.test(line)){result.unassigned.push(line);return;}
  if(/^(?:für|for)\s+\d+.*(?:Portion|Person|serving)|^(?:Portionen?|servings?)\s*:/i.test(line))return;
  if(section==='ingredients'){
   if(/^(?:für\s+(?:die|den|das)|zum\s+(?:garnieren|servieren))\b.*:\s*$/i.test(line)){result.unassigned.push(line);return;}
   // Unheaded instructions after a list are recognized, never treated as amounts.
   if(/\b(?:kochen|braten|backen|schneiden|mischen|verrühren|unterheben|erhitzen|cook|bake|mix)\b/i.test(line)&&!amountRE.test(line)){section='steps';result.steps=result.steps.concat(splitSteps(line));return;}
   line.split(/;\s*|,\s+(?=\d|[¼½¾⅓⅔])/).forEach(function(s){if(s.trim())result.ingredients.push(s.trim());});return;
  }
  if(section==='steps'){result.steps=result.steps.concat(splitSteps(line));return;}
  if(section==='notes'){result.unassigned.push(line);return;}
  if(amountRE.test(line)||/^(?:Salz|Pfeffer|etwas|Prise|nach Geschmack)\b/i.test(line)){result.ingredients.push(line);return;}
  if(/^(?:\d+[.)]|Schritt\s+\d+)/i.test(line)){result.steps=result.steps.concat(splitSteps(line));return;}
  if(/\b(?:kochen|braten|backen|schneiden|mischen|verrühren|unterheben|erhitzen|cook|bake|mix)\b/i.test(line)&&line.length>25){result.steps=result.steps.concat(splitSteps(line));return;}
  candidates.push(line);
 });
 var title=candidates.find(function(line){return line.length<=120&&!/^(?:Rezept\s+für|Rezept$|Recipe$|Heute|In diesem|Hier|Speicher|Abspeicher|Schnell und|Willkommen)/i.test(line)&&!/[.!?].+\s/.test(line);});
 result.title=(title||String(titleHint||'').trim()).replace(/^(?:Rezept|Recipe)\s*:\s*/i,'').slice(0,120);
 result.unassigned=candidates.filter(function(s){return s!==title;}).concat(result.unassigned);
 if(recipeCount>1){result.warnings.push('Mehrere Rezepte erkannt. Bitte nur ein Rezept im Text behalten und erneut auswerten.');result.multiple=true;}
 if(!hasIngredientHeading||!hasStepHeading)result.warnings.push('Nicht alle Abschnittsüberschriften erkannt. Zuordnung bitte besonders sorgfältig prüfen.');
 if(result.ingredients.length>100||result.steps.length>100)throw Error('Zu viele Zutaten oder Schritte. Bitte genau ein Rezept mit höchstens 100 Zeilen je Bereich einfügen.');
 result.warnings=result.warnings.concat(reviewWarnings(result));
 return result;
}
function reviewWarnings(r){var notes=[];if(!r.title.trim())notes.push('Rezeptname fehlt.');if(!r.servings)notes.push('Portionszahl fehlt – bitte ergänzen.');if(!r.ingredients.length)notes.push('Keine Zutaten erkannt.');if(!r.steps.length)notes.push('Keine Kochschritte erkannt. Es wurden keine Schritte erfunden.');var ambiguous=r.ingredients.map(function(s,i){return ingredientParts(s).unclear?i+1:null;}).filter(Boolean);if(ambiguous.length)notes.push('Mengen prüfen bei Zutat '+ambiguous.join(', ')+'.');if(r.ingredients.some(function(s){return /\d\s*(?:g|ml|EL|TL)\b.*\s\d\s*(?:g|ml|EL|TL)\b/i.test(s)&&!/[()]/.test(s);}))notes.push('Möglicherweise stehen mehrere Zutaten in einer Zeile. Bitte bei Bedarf aufteilen.');return notes;}
var api={videoLink:videoLink,sourceKey:sourceKey,parseDescription:parseDescription,ingredientParts:ingredientParts,reviewWarnings:reviewWarnings};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RecipeImport=api;
})(typeof self!=='undefined'?self:this);
