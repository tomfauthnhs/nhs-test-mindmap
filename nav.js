(function(){
var S=[
["Service design / mapping",[["network.html","Connected map (as-is)"],["endpoints.html","By end point"],["tree.html","Tree view"]]],
["User research",[["cardsort.html","Card sort vs map"],["placement.html","Where users placed each test"]]],
["Interaction design",[["feeds.html","Idea feeds"]]]
];
var here=location.pathname.split('/').pop()||'index.html';
var css='#sn{background:#003087;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:14px;position:relative;z-index:50}'+
'#sn .r{display:flex;flex-wrap:wrap;align-items:center;gap:4px 22px;padding:10px 24px}'+
'#sn a{color:#fff;text-decoration:none;padding:3px 0;border-bottom:2px solid transparent}'+
'#sn a:hover{border-bottom-color:#fff}#sn a.on{border-bottom-color:#ffeb3b;font-weight:bold}'+
'#sn .h{font-weight:bold;margin-right:6px}#sn .g{display:flex;flex-wrap:wrap;align-items:center;gap:4px 14px}'+
'#sn .l{font-size:11px;text-transform:uppercase;letter-spacing:.05em;opacity:.75}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
document.querySelectorAll('nav').forEach(function(n){n.remove()});
var d=document.createElement('div');d.id='sn';
var h='<div class="r"><a class="h'+(here==='index.html'?' on':'')+'" href="index.html">Test pathways: overview</a>';
S.forEach(function(s){h+='<div class="g"><span class="l">'+s[0]+'</span>';s[1].forEach(function(p){h+='<a href="'+p[0]+'"'+(here===p[0]?' class="on"':'')+'>'+p[1]+'</a>'});h+='</div>'});
d.innerHTML=h+'</div>';document.body.insertBefore(d,document.body.firstChild);
var t=document.getElementById('kt');
if(t){var k=document.createElement('div');k.id='kbox';
var kc=document.createElement('style');kc.textContent='#kbox{background:#fff;border-left:6px solid #00a499;margin:14px 24px;padding:12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#212b32;box-shadow:0 1px 2px rgba(0,0,0,.12)}#kbox h2{margin:0 0 6px;font-size:17px;color:#005eb8}#kbox ul{margin:0;padding-left:20px}#kbox li{margin:3px 0}#kbox .src{font-size:12px;color:#4c6272;margin-top:8px}';
document.head.appendChild(kc);k.innerHTML=t.innerHTML;d.parentNode.insertBefore(k,d.nextSibling);}
})();
