(function(root){
'use strict';
// Only public requests to the selected platform. No cookies, keys, proxies or embeds.
async function request(url,signal,json){
 var response=await fetch(url,{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',signal:signal});
 if(!response.ok)throw Error('HTTP '+response.status);
 if(Number(response.headers.get('Content-Length'))>2000000)throw Error('Antwort zu groß');
 var body=await response.text();if(body.length>2000000)throw Error('Antwort zu groß');return json?JSON.parse(body):body;
}
function decode(s){return s.replace(/&quot;/g,'"').replace(/&#(?:39|x27);/gi,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#(\d+);/g,function(_,n){return Number(n)<=1114111?String.fromCodePoint(Number(n)):'';});}
function metadata(html){
 var title='',description='',partial=true,m=html.match(/"shortDescription"\s*:\s*("(?:\\.|[^"\\])*")/);
 if(m){try{description=JSON.parse(m[1]);partial=false;}catch(ignore){}}
 (html.match(/<meta\b[^>]{0,30000}>/gi)||[]).forEach(function(tag){var attrs={};tag.replace(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g,function(_,key,q,value){attrs[key.toLowerCase()]=decode(value);return '';});var property=attrs.property||attrs.name;if(property==='og:title')title=attrs.content||'';if(!description&&(property==='og:description'||property==='description'))description=attrs.content||'';});
 return {title:title.slice(0,120),description:description.slice(0,30000),partial:partial};
}
async function load(link,signal){
 var title='',description='',partial=false;
 var tasks=[request(link.url,signal,false).then(function(html){var parsed=metadata(html);description=parsed.description;partial=parsed.partial;if(!title)title=parsed.title;}).catch(function(){})];
 if(link.platform==='YouTube')tasks.push(request('https://www.youtube.com/oembed?url='+encodeURIComponent(link.url)+'&format=json',signal,true).then(function(data){if(typeof data.title==='string')title=data.title.slice(0,120);}).catch(function(){}));
 await Promise.all(tasks);
 return {title:title,description:description,partial:partial};
}
root.PlatformImport={load:load};
})(window);
