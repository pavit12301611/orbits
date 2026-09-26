/* Orbit 2.1 — core: state, shell, theme, palette, home, combos, library.
   Plain-JS, local-first study app with optional separately verified Google identity. */
'use strict';
const paths={home:'index.html',combos:'combos.html',materials:'materials.html',tests:'tests.html',flashcards:'flashcards.html',formulas:'formulas.html',planner:'planner.html',progress:'progress.html',bookmarks:'bookmarks.html'};
const names={home:'Overview',combos:'Study combos',materials:'Study materials',tests:'Practice tests',flashcards:'Flashcards',formulas:'Formula sheets',planner:'Study planner',progress:'My progress',bookmarks:'Bookmarks'};
const icons={
grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
book:'<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1v15"/>',
test:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2"/>',
chart:'<path d="M4 3v17h17M8 15v-4M13 15V7M18 15v-6"/>',
bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
bell:'<path d="M5 10a7 7 0 0 1 14 0c0 6 2 6 2 7H3c0-1 2-1 2-7M10 21h4"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
flame:'<path d="M13 2c2 7-4 6-3 11-2 0-3-2-3-4-4 4-5 12 4 13 9 0 11-9 2-20Z"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
atom:'<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1"/>',
flask:'<path d="M9 3h6M10 3v7L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3M7 15h10M9 18h1M14 17h1"/>',
leaf:'<path d="M20 3C8 1 2 8 6 16c8 6 16-1 14-13ZM4 21 16 8M8 16v-6M12 12h5"/>',
math:'<path d="m3 14 4 5 5-15h9M15 11l6 7m0-7-6 7"/>',
headphones:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="9" rx="2"/><rect x="17" y="12" width="4" height="9" rx="2"/>',
check:'<path d="m5 12 4 4L20 5"/>',
spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
shuffle:'<path d="M3 5h3l12 14h3M17 15l4 4-4 3M3 19h3l4-5M14 10l4-5h3M17 2l4 3-4 4"/>',
heart:'<path d="M12 21 3 12C-3 3 8 0 12 7c4-7 15-4 9 5z"/>',
download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
bolt:'<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
layers:'<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
moon:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4 4l2 2M18 18l2 2M20 4l-2 2M6 18l-2 2"/>',
cards:'<rect x="2" y="6" width="13" height="13" rx="2"/><path d="M6 6V4h13v13h-2"/>',
sigma:'<path d="M17 5H7l6 7-6 7h10"/>',
play:'<path d="M6 4l14 8-14 8z"/>',
x:'<path d="M5 5l14 14M19 5 5 19"/>',
upload:'<path d="M12 15V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5M12 14v3m-4 4h8m-8 0-1 2m9-2 1 2"/>',
alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4v.5"/>'
};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[n]||icons.book}</svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const fmtDate=iso=>{try{return new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});}catch(e){return iso;}};
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/* ---------- state ---------- */
const LSKEY='orbit-v2';
const defaults=()=>({v:2,track:'NEET',theme:'light',read:[],saved:[],attempts:[],mistakes:{},flash:{},focusMinutes:0,focusSessions:0,focusLog:{},activity:[],mastery:{},xp:0,goals:{q:10,min:25},settings:{neg:true,tpq:90},
tasks:[{id:'welcome-1',title:'Revise motion in a straight line',subject:'Physics',date:today(),done:false},{id:'welcome-2',title:'Take a Daily 10 practice test',subject:'General revision',date:today(),done:false},{id:'welcome-3',title:'Read one chapter guide',subject:'General revision',date:today(),done:false}]});
let state=defaults(),storageWorks=true;
function loadState(){
  try{
    const raw=localStorage.getItem(LSKEY);
    if(raw){state={...defaults(),...JSON.parse(raw)};return;}
    const old=localStorage.getItem('orbit-v1');
    if(old){const o=JSON.parse(old);state={...defaults(),track:o.track||'NEET',read:o.read||[],saved:o.saved||[],attempts:o.attempts||[],focusMinutes:o.focusMinutes||0,activity:o.activity||[],tasks:o.tasks&&o.tasks.length?o.tasks:defaults().tasks};save();}
  }catch(e){storageWorks=false;}
}
function save(){try{localStorage.setItem(LSKEY,JSON.stringify(state));}catch(e){if(storageWorks){storageWorks=false;toast('Browser storage is unavailable. Progress will last this session only.');}}}
loadState();
let page=document.body.dataset.page||'home';
let filter='All subjects',search=new URLSearchParams(location.search).get('q')||'',taskFilter='all';
let comboSubject='All',comboMode='All',comboSearch='';
/* ---------- derived ---------- */
const subjects=()=>TRACKS[state.track]||TRACKS.NEET;
const trackChapters=()=>CHAPTERS.filter(c=>subjects().includes(c.subject));
function activity(){if(!state.activity.includes(today()))state.activity.push(today());save();}
function streak(){const d=new Date();let n=0;if(!state.activity.includes(today()))d.setDate(d.getDate()-1);for(let i=0;i<1000;i++){const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;if(!state.activity.includes(k))break;n++;d.setDate(d.getDate()-1);}return n;}
function level(){return 1+Math.floor((state.xp||0)/250);}
function addXP(n){state.xp=(state.xp||0)+n;save();}
function bankCount(){return Object.values(BANK).reduce((a,b)=>a+b.length,0);}
function questionsToday(){const t=today();return state.attempts.filter(a=>(a.date||'').slice(0,10)===t).reduce((a,r)=>a+r.questions.length,0);}
function focusToday(){return state.focusLog[today()]||0;}
function accuracy(){const t=state.attempts.reduce((a,r)=>a+r.questions.length,0),c=state.attempts.reduce((a,r)=>a+r.correct,0);return {total:t,correct:c,pct:t?Math.round(c/t*100):0};}
function masteryKey(s,c){return s+'|'+c;}
function recordMastery(s,c,ok){const k=masteryKey(s,c);const m=state.mastery[k]||{a:0,c:0};m.a++;if(ok)m.c++;state.mastery[k]=m;}
function masteryPct(s,c){const m=state.mastery[masteryKey(s,c)];if(!m||!m.a)return -1;const raw=m.c/m.a;const conf=Math.min(1,m.a/12);return Math.round(raw*conf*100);}
function mistakeCount(){return Object.keys(state.mistakes||{}).length;}
function guideForChapter(s,c){return MATERIALS.find(m=>m.subject===s&&m.chapter===c);}
/* ---------- combos: 50 chapters x 3 modes = 150 ---------- */
const COMBO_MODES=[
 {mode:'learn', label:'Learn',  count:8,  spq:0,  mark:'+4 / 0',  desc:'Untimed · instant explanations after every answer', icon:'book'},
 {mode:'drill', label:'Drill',  count:10, spq:-1, mark:'+4 / −1', desc:'Exam marking · mixed difficulty · timed', icon:'target'},
 {mode:'sprint',label:'Sprint', count:12, spq:30, mark:'+2 / 0',  desc:'30 seconds per question · speed + recall', icon:'bolt'}
];
function allCombos(){const out=[];for(const c of CHAPTERS)for(const m of COMBO_MODES)out.push({id:`${c.id}-${m.mode}`,chapter:c,mode:m});return out;}
function comboById(id){const m=String(id).match(/^(P\d+|C\d+|B\d+|M\d+)-(learn|drill|sprint)$/);if(!m)return null;const ch=chapterById(m[1]);const mo=COMBO_MODES.find(x=>x.mode===m[2]);return ch&&mo?{id,chapter:ch,mode:mo}:null;}
function comboTime(c){const spq=c.mode.spq===-1?state.settings.tpq:c.mode.spq;return spq?Math.round(c.mode.count*spq/60):null;}
const GRANDS=[
 {id:'neet-mock', name:'NEET full mock', desc:'45 questions · P15 C15 B15 · 45 min · +4/−1', icon:'trophy'},
 {id:'jee-mock', name:'JEE full mock', desc:'30 questions · P10 C10 M10 · 45 min · +4/−1', icon:'trophy'},
 {id:'marathon', name:'Mixed marathon', desc:'30 questions · all subjects · 30 min', icon:'shuffle'},
 {id:'daily10', name:'Daily 10', desc:'10 questions · your track · 15 min · the habit builder', icon:'bolt'},
 {id:'mistakes', name:'Mistake fixer', desc:'Your wrong answers, re-asked until they stick', icon:'alert'},
 {id:'speedrun', name:'Speed run', desc:'20 foundation questions · 20 s each · pure recall', icon:'play'}
];
/* ---------- ui primitives ---------- */
function toast(text){document.querySelector('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.role='status';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),3600);}
let previousFocus=null;
function modal(html,wide=false){previousFocus=document.activeElement;document.getElementById('modal-root').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="Study workspace dialog">${html}</section></div>`;document.body.style.overflow='hidden';setTimeout(()=>document.querySelector('.modal input,.modal select,.modal button')?.focus(),40);}
function closeModal(){document.getElementById('modal-root').innerHTML='';document.body.style.overflow='';if(previousFocus&&previousFocus.focus)previousFocus.focus();}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function applyTheme(){document.documentElement.dataset.theme=state.theme;const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=state.theme==='dark'?'#101915':'#193e35';}
function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';save();applyTheme();render();}
function setTrack(t){try{if(typeof activeQuiz!=='undefined'&&activeQuiz){toast('Finish your current test before switching tracks.');return;}}catch(e){}state.track=t;filter='All subjects';save();render();}
function trackToggle(){return `<div class="track-toggle" role="group" aria-label="Exam track">${['NEET','JEE'].map(t=>`<button class="${state.track===t?'active':''}" aria-pressed="${state.track===t}" onclick="setTrack('${t}')">${t}</button>`).join('')}</div>`;}
function title(eyebrow,heading,sub,extra=''){return `<div class="page-title"><div><div class="eyebrow">${eyebrow}</div><h1>${heading}</h1><p class="subtitle">${sub}</p></div><div class="title-extra">${extra}</div></div>`;}
function footer(){return `<footer class="footer"><span>${icon('heart')} Made for your journey, not just your destination.</span><span>Local-first · No tracking · Study offline &nbsp;✦</span></footer>`;}
function dueCount(){try{if(typeof buildDeck==='function'){const t=today();return buildDeck().filter(c=>{const f=state.flash[c.id];return !f||(f.due||'')<=t;}).length;}}catch(e){}return 0;}
function activeQuizInfo(){try{const raw=localStorage.getItem('orbit-quiz-v2');if(!raw)return null;const q=JSON.parse(raw);return q&&q.questions?{left:Math.max(0,Math.ceil((q.deadline-Date.now())/1000)),quiz:q}:null;}catch(e){return null;}}
/* ---------- shell ---------- */
function shell(){
  applyTheme();
  const due=dueCount();
  const nav=[['home','grid','Overview',null],['combos','layers','Study combos','<em>150</em>'],['materials','book','Materials',null],['tests','test','Practice tests',null],['flashcards','cards','Flashcards',due?`<em>${due}</em>`:null],['formulas','sigma','Formulas',null],['planner','calendar','Planner',null],['progress','chart','Progress',null],['bookmarks','bookmark','Bookmarks',null]];
  document.getElementById('app').innerHTML=`<div class="menu-backdrop" onclick="toggleMenu()"></div>
  <aside class="sidebar"><a class="brand" href="index.html" aria-label="Orbit home"><div class="brandmark"></div>orbit<small>STUDY SPACE</small></a>
  <div class="workspace">${icon('bolt')}<div><b>Level ${level()} learner</b><span>${state.xp||0} XP · ${streak()} day streak</span></div></div>
  <div class="nav-label">YOUR WORKSPACE</div>
  <nav>${nav.map(([p,i,l,b])=>`<a href="${paths[p]}" class="${p===page?'active':''}" ${p===page?'aria-current="page"':''}>${icon(i)}${l}${b||''}</a>`).join('')}</nav>
  <div class="side-bottom"><div class="side-note">${icon('spark')}<b>Big dreams. Small steps.</b><p>You don’t have to do it all today.<br>Just a little better than yesterday.</p><a href="combos.html">Browse 150 combos ${icon('arrow')}</a></div>
  <div class="profile" id="sidebar-profile"><div class="avatar">${state.track==='JEE'?'J':'N'}</div><div><strong>${state.track} track</strong><small>Private · on this device</small></div></div></div></aside>
  <div class="app"><header class="topbar"><button class="mobile-menu" onclick="toggleMenu()" aria-label="Open navigation">${icon('menu')}</button>
  <div class="crumb">Workspace <span>/ &nbsp; ${names[page]}</span></div>
  <div class="top-actions"><button class="top-search" onclick="openPalette()" aria-label="Search everything">${icon('search')}<span>Search chapters, guides, combos…</span><span class="key">/</span></button>
  <button class="icon-btn" onclick="toggleTheme()" aria-label="Toggle dark mode">${icon(state.theme==='dark'?'sun':'moon')}</button>
  <button class="notification" onclick="showUpdates()" aria-label="Workspace updates">${icon('bell')}</button>
  <div id="auth-control" class="auth-control" aria-live="polite"><span class="auth-loading">Account</span></div></div></header>
  <main class="main" id="content"></main></div><div id="modal-root"></div>`;
  render();
  if(!storageWorks)toast('Storage is unavailable; progress stays in this session only.');
}
function toggleMenu(){document.querySelector('.sidebar')?.classList.toggle('open');document.querySelector('.menu-backdrop')?.classList.toggle('show');}
/* ---------- shared blocks ---------- */
function statsRow(){
  const a=accuracy();
  const cards=[
   ['bolt','Learner level',`${level()} <small>· ${state.xp||0} XP</small>`,'Earn XP from every correct answer'],
   ['test','Tests completed',`${state.attempts.length} <small>tests</small>`,'Every attempt is a step forward'],
   ['target','Overall accuracy',`${a.pct}<small>%</small>`,a.total?`Across ${a.total} practice questions`:'Take a test to get started'],
   ['flame','Study streak',`${streak()} <small>days</small>`,'A little consistency goes a long way']];
  return `<div class="stats">${cards.map(([i,l,v,n])=>`<div class="stat"><div class="stat-top"><span class="stat-icon">${icon(i)}</span>${l}</div><div class="stat-value">${v}</div><div class="stat-note">${n}</div></div>`).join('')}</div>`;
}
function subjectCards(){
  return subjects().map(s=>{
    const guides=MATERIALS.filter(m=>m.subject===s),read=guides.filter(m=>state.read.includes(m.id)).length;
    const chs=CHAPTERS.filter(c=>c.subject===s).map(c=>masteryPct(s,c.name)).filter(v=>v>=0);
    const mast=chs.length?Math.round(chs.reduce((a,b)=>a+b,0)/chs.length):0;
    const pct=guides.length?Math.round(read/guides.length*100):0;
    return `<a href="combos.html?subject=${encodeURIComponent(s)}" class="subject-card"><div class="subject-icon ${SUBJECTS[s].color}">${icon(SUBJECTS[s].icon)}</div>
    <h3>${s}</h3><p>${guides.length} guides · ${BANK[s].length} questions · ${mast}% mastery</p>
    <div class="progress"><span style="width:${pct}%"></span></div>
    <div class="progress-label"><span>${read} of ${guides.length} guides read</span><span>${pct}%</span></div>
    <div class="card-bottom">Practice ${s} ${icon('arrow')}</div></a>`;
  }).join('');
}
function weekStrip(){const d=new Date(),start=new Date(d);start.setDate(d.getDate()-((d.getDay()+6)%7));
  return `<div class="week-strip">${['M','T','W','T','F','S','S'].map((v,i)=>{const n=new Date(start);n.setDate(start.getDate()+i);return `<div class="day ${n.toDateString()===d.toDateString()?'today':''}">${v}<b>${n.getDate()}</b></div>`;}).join('')}</div>`;}
function taskRows(tasks,mini=false){
  if(!tasks.length)return '<p class="subtitle" style="padding:15px 0">A fresh page. Add a small goal for today.</p>';
  return tasks.map(t=>`<div class="mini-task ${t.done?'done':''}"><input class="checkbox" type="checkbox" ${t.done?'checked':''} aria-label="Mark ${esc(t.title)} complete" onchange="toggleTask('${t.id}')"><div><strong>${esc(t.title)}</strong><small><span class="task-dot"></span>${esc(t.subject)} · ${t.date===today()?'Today':fmtDate(t.date)}</small></div>${!mini?`<button class="delete-task" onclick="deleteTask('${t.id}')" aria-label="Delete ${esc(t.title)}">×</button>`:''}</div>`).join('');
}
function resumeBanner(){
  const info=activeQuizInfo();if(!info)return '';
  if(info.left<=0)return `<div class="notice warn">${icon('alert')} Your last test ran out of time. <a href="tests.html"><b>Open Practice tests</b></a> to submit it.</div>`;
  return `<div class="notice">${icon('play')} Test in progress: <b>${esc(info.quiz.label||info.quiz.subject||'Practice')}</b> · ${Math.floor(info.left/60)}:${String(info.left%60).padStart(2,'0')} left. <a href="tests.html"><b>Resume →</b></a></div>`;
}
/* ---------- home ---------- */
function home(){
  const date=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'}),hour=new Date().getHours();
  const q=questionsToday(),f=focusToday(),mc=mistakeCount(),due=dueCount();
  const weak=CHAPTERS.map(c=>({c,m:masteryPct(c.subject,c.name)})).filter(x=>x.m>=0).sort((a,b)=>a.m-b.m).slice(0,3);
  const quote=QUOTES[new Date().getDate()%QUOTES.length];
  return title(date,`Good ${hour<12?'morning':hour<17?'afternoon':'evening'}, learner <span class="wave">☀</span>`,`Your dreams are worth the effort. Let’s make today count.`,trackToggle())
  +resumeBanner()
  +`<section class="hero"><div class="hero-copy"><span class="badge">${icon('spark')} 150 STUDY COMBINATIONS · YOUR PACE</span>
  <h2>A little progress, every day.<br>A big difference, one day.</h2>
  <p>${bankCount()} practice questions · 50 chapter guides · flashcards · mocks — all on this device, all free.</p>
  <div class="hero-cta"><a href="combos.html" class="btn">Browse 150 combos ${icon('arrow')}</a><button class="btn light" onclick="startDaily10()">Daily 10 · 15 min</button></div>
  <span class="hero-foot">“${quote[0]}” — ${quote[1]}</span></div>
  <div class="hero-art">${art}</div></section>`
  +statsRow()
  +`<div class="dashboard-grid"><div>
  <div class="section-head"><h2>Today’s mission<small>${q}/${state.goals.q} questions · ${f}/${state.goals.min} focus minutes</small></h2><a href="planner.html">Planner ${icon('arrow')}</a></div>
  <div class="mission"><div class="mission-row"><span>Practice</span><div class="progress"><span style="width:${clamp(q/state.goals.q*100,0,100)}%"></span></div><b>${Math.min(q,state.goals.q)}/${state.goals.q}</b></div>
  <div class="mission-row"><span>Focus</span><div class="progress"><span style="width:${clamp(f/state.goals.min*100,0,100)}%"></span></div><b>${Math.min(f,state.goals.min)}/${state.goals.min}m</b></div>
  <div class="quick-actions"><button class="btn light" onclick="startDaily10()">${icon('bolt')} Daily 10</button><button class="btn light" onclick="startGrand('mistakes')">${icon('alert')} Fix mistakes${mc?` (${mc})`:''}</button><button class="btn light" onclick="focusModal()">${icon('headphones')} Focus</button><a class="btn light" href="flashcards.html">${icon('cards')} Flashcards${due?` (${due})`:''}</a></div></div>
  <div class="section-head"><h2>Your learning path<small>Mastery grows with every combo you finish.</small></h2><a href="combos.html">All 150 combos ${icon('arrow')}</a></div>
  <div class="subjects">${subjectCards()}</div>
  <div class="section-head"><h2>${weak.length?'Weak spots to fix first':'Start anywhere — we’ll find weak spots'}</h2><a href="progress.html">Full report ${icon('arrow')}</a></div>
  ${weak.length?weak.map(({c,m})=>`<div class="practice-card"><div class="practice-info"><div class="practice-icon">${icon(SUBJECTS[c.subject].icon)}</div><div><h3>${c.subject} · ${c.name}</h3><p>Mastery ${m}% — a Learn combo will fix this fast.</p></div></div><button class="btn light" onclick="startCombo('${c.id}-learn')">Learn it ${icon('arrow')}</button></div>`).join(''):`<div class="practice-card"><div class="practice-info"><div class="practice-icon">${icon('spark')}</div><div><h3>Take any combo to unlock insights</h3><p>We track mastery per chapter and point you at what matters.</p></div></div><a class="btn light" href="combos.html">Start ${icon('arrow')}</a></div>`}
  </div><aside class="dashboard-right">
  <div class="panel"><div class="section-head" style="margin:0"><h2 style="font-size:13px">Your plan for today</h2><a href="planner.html">${icon('arrow')}</a></div>${weekStrip()}${taskRows(state.tasks.filter(t=>t.date===today()).slice(0,3),true)}<button class="add-task" onclick="taskModal()">+ &nbsp; Add a study task</button></div>
  <div class="focus-card">${icon('headphones')}<div><h3>A little focus goes a long way.</h3><p>Clear your desk. Take a breath.<br>Your next session is yours.</p><button onclick="focusModal()">Start a focus session &nbsp; →</button></div></div>
  </aside></div>`+footer();
}
const art=`<svg viewBox="0 0 340 250" fill="none" aria-hidden="true"><ellipse cx="172" cy="222" rx="133" ry="11" fill="#dce5cd"/><circle cx="197" cy="108" r="86" stroke="#d0ddc0"/><circle cx="197" cy="108" r="64" stroke="#d0ddc0" stroke-dasharray="3 5"/><path d="M240 212V111" stroke="#6c8057" stroke-width="3"/><path d="M242 162c-22-5-33-23-29-38 25 4 34 18 29 38Z" fill="#879e72"/><path d="M241 142c26-2 40-19 40-38-26 1-39 17-40 38Z" fill="#a5b58d"/><path d="M242 118c-13-14-16-29-7-43 16 11 20 27 7 43Z" fill="#6e885e"/><path d="M238 182c22-1 36-13 36-29-22-2-35 11-36 29Z" fill="#789366"/><path d="M222 186h41l-6 35h-30z" fill="#d8b38e"/><path d="M222 186h41v8h-41z" fill="#cba27b"/><rect x="60" y="192" width="153" height="26" rx="4" fill="#335b46"/><path d="M71 197h137v16H71" fill="#f4f1db"/><path d="M75 203h128M75 207h128" stroke="#d7d7c0"/><path d="M54 173c0-3 2-5 5-5h147v25H59a5 5 0 0 1-5-5z" fill="#b5c694"/><path d="M68 174h137v13H68" fill="#faf7e6"/><path d="M73 179h125M73 183h125" stroke="#d8dcc4"/><rect x="67" y="149" width="133" height="20" rx="3" fill="#e4a16f"/><path d="M79 152h116v12H79" fill="#fbf4e2"/><path d="M87 60c20-4 39 2 51 14 17-4 40 2 59 15l-23 59c-17-14-34-17-50-10-12-14-30-19-52-15Z" fill="#faf9e9" stroke="#9ea984" stroke-width="1.5"/><path d="m138 74-14 64" stroke="#bbc6a7" stroke-width="2"/><path d="M96 75c10 0 20 3 29 8M94 84c11 0 20 3 28 8M91 94c11 0 20 3 28 8M89 103c10 0 19 3 26 8M151 86c10-1 20 3 29 8M148 96c10-1 20 3 29 8M145 106c10-1 20 3 29 8M143 116c10-1 19 3 27 8" stroke="#cbd1b8" stroke-width="2" stroke-linecap="round"/><path d="m44 69 4-9 4 9 9 4-9 4-4 9-4-9-9-4z" fill="#d69b68"/><path d="m282 66 2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#8c9d76"/><circle cx="68" cy="117" r="3" fill="#a7b58c"/><circle cx="254" cy="48" r="4" stroke="#adba96"/><path d="m295 165 7-6m-4 12 8 1" stroke="#9ba987" stroke-width="2" stroke-linecap="round"/></svg>`;
/* ---------- combos page ---------- */
function setComboSubject(s){comboSubject=s;renderCombosGrid();}
function setComboMode(m){comboMode=m;renderCombosGrid();}
function updateComboSearch(v){comboSearch=v;renderCombosGrid();}
function combosPage(){
  return title('150 STUDY COMBINATIONS','Pick a chapter. Pick a pace. Go.','50 chapters × 3 modes. Every combo shuffles fresh questions — no two attempts feel the same.',trackToggle())
  +resumeBanner()
  +`<div class="section-head"><h2>Grand modes<small>Full mocks and power sessions.</small></h2></div>
  <div class="grands">${GRANDS.map(g=>`<button class="grand" onclick="startGrand('${g.id}')"><span class="grand-icon">${icon(g.icon)}</span><span><b>${g.name}</b><small>${g.desc}</small></span>${icon('arrow')}</button>`).join('')}</div>
  <div class="section-head"><h2>Chapter combos<small id="combo-count"></small></h2></div>
  <div class="filters"><div class="filter-group">${['All','Physics','Chemistry','Biology','Mathematics'].map(s=>`<button class="filter ${comboSubject===s?'active':''}" onclick="setComboSubject('${s}')">${s}</button>`).join('')}</div>
  <div class="filter-group">${['All','Learn','Drill','Sprint'].map(m=>`<button class="filter sm ${comboMode===m?'active':''}" onclick="setComboMode('${m}')">${m}</button>`).join('')}</div>
  <input class="combo-search" type="search" placeholder="Find a chapter…" value="${esc(comboSearch)}" oninput="updateComboSearch(this.value)" aria-label="Search combos"></div>
  <div class="combo-grid" id="combo-grid"></div>`+footer();
}
function renderCombosGrid(){
  const grid=document.getElementById('combo-grid');if(!grid)return;
  const list=allCombos().filter(c=>(comboSubject==='All'||c.chapter.subject===comboSubject)&&(comboMode==='All'||c.mode.label===comboMode)&&`${c.chapter.name} ${c.chapter.subject}`.toLowerCase().includes(comboSearch.toLowerCase()));
  const cc=document.getElementById('combo-count');if(cc)cc.textContent=`Showing ${list.length} of 150 combinations.`;
  grid.innerHTML=list.length?list.map(c=>{
    const t=comboTime(c),m=masteryPct(c.chapter.subject,c.chapter.name);
    return `<article class="combo-card"><div class="combo-top"><span class="chip ${SUBJECTS[c.chapter.subject].color}">${c.chapter.subject}</span><span class="chip mode-${c.mode.mode}">${icon(c.mode.icon)} ${c.mode.label}</span></div>
    <h3>${c.chapter.name}</h3><p>${c.mode.desc}</p>
    <div class="combo-meta"><span>${icon('test')} ${c.mode.count} Qs</span><span>${icon('clock')} ${t?t+' min':'untimed'}</span><span>${icon('target')} ${c.mode.mark}</span></div>
    ${m>=0?`<div class="progress"><span style="width:${m}%"></span></div><div class="progress-label"><span>Mastery</span><span>${m}%</span></div>`:'<div class="progress-label"><span>Not attempted yet</span><span>fresh</span></div>'}
    <button class="btn" onclick="startCombo('${c.id}')">Start ${c.mode.label.toLowerCase()} ${icon('arrow')}</button></article>`;
  }).join(''):'<div class="empty">No combos match. Try another chapter or mode.</div>';
}
/* ---------- library (materials + bookmarks) ---------- */
function setFilter(s){filter=s;render();}
function updateSearch(v){search=v;const g=document.getElementById('library-grid');if(g)g.innerHTML=materialCards(page==='bookmarks');}
function materialCards(bookmarks=false){
  const list=MATERIALS.filter(m=>(filter==='All subjects'||m.subject===filter)&&(!bookmarks||state.saved.includes(m.id))&&`${m.title} ${m.subject} ${m.topic} ${m.chapter}`.toLowerCase().includes(search.toLowerCase()));
  if(!list.length)return `<div class="empty">${bookmarks?'No saved guides here yet. Bookmark a chapter in Study materials to find it here.':'No chapters match your search. Try another topic or subject.'}</div>`;
  return list.map(m=>`<article class="material-card"><div class="subject-icon ${SUBJECTS[m.subject].color}">${icon(SUBJECTS[m.subject].icon)}</div>
  <button class="bookmark ${state.saved.includes(m.id)?'saved':''}" onclick="bookmark('${m.id}')" aria-label="${state.saved.includes(m.id)?'Remove bookmark for':'Bookmark'} ${esc(m.title)}" aria-pressed="${state.saved.includes(m.id)}">${icon('bookmark')}</button>
  <div class="eyebrow" style="margin-top:19px;font-size:8px">${m.subject} / ${m.topic}</div><h3>${m.title}</h3><p>${m.intro}</p>
  <div class="meta"><span>${icon('clock')} &nbsp; ${m.time} min read</span><span>${state.read.includes(m.id)?'✓ Completed':'Concepts + example'}</span></div>
  <div class="card-actions"><button class="btn light" onclick="openMaterial('${m.id}')">${state.read.includes(m.id)?'Revise':'Read guide'} ${icon('arrow')}</button><button class="btn ghost" onclick="startCombo('${m.id}-learn')" aria-label="Practice ${esc(m.title)}">${icon('play')}</button></div></article>`).join('');
}
function library(bookmarks=false){
  return title(bookmarks?'KEEP THE GOOD STUFF':'YOUR CONCEPT TOOLKIT',bookmarks?'Saved for a second look.':'Learn it. Understand it. Own it.',bookmarks?'Your bookmarked chapters, all in one quiet corner.':'50 revision guides with formulas, worked examples and exam traps.')
  +`<div class="filters">${['All subjects','Physics','Chemistry','Biology','Mathematics'].map(s=>`<button class="filter ${filter===s?'active':''}" onclick="setFilter('${s}')">${s}</button>`).join('')}<input class="combo-search" style="margin-left:auto" type="search" placeholder="Find a chapter…" value="${esc(search)}" oninput="updateSearch(this.value)" aria-label="Filter chapters"></div>
  <div class="library-grid" id="library-grid">${materialCards(bookmarks)}</div>`+footer();
}
function bookmark(id){if(state.saved.includes(id))state.saved=state.saved.filter(x=>x!==id);else state.saved.push(id);save();const g=document.getElementById('library-grid');if(g)g.innerHTML=materialCards(page==='bookmarks');else render();toast(state.saved.includes(id)?'Chapter added to bookmarks.':'Bookmark removed.');}
function openMaterial(id){
  const m=MATERIALS.find(x=>x.id===id);if(!m)return;
  modal(`<div class="modal-header"><div><div class="eyebrow">${m.subject} · ${m.time} MIN READ · ${m.topic}</div><h2>${m.title}</h2></div><button class="close" onclick="closeModal()" aria-label="Close guide">×</button></div>
  <article class="reader"><p>${m.intro}</p>${m.sections.map(([h,p])=>`<h3>${h}</h3><p>${p}</p>`).join('')}
  <div class="formula">${m.formula}</div><h3>A worked example</h3><p>${m.example}</p><h3>Keep in mind</h3><ul>${m.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
  <div class="trap"><b>Exam trap:</b> ${m.trap}</div></article>
  <div class="modal-footer"><button class="btn light" onclick="downloadGuide('${id}')">${icon('download')} Notes</button><button class="btn light" onclick="closeModal();startCombo('${id}-learn')">${icon('play')} Practice</button><button class="btn" onclick="completeGuide('${id}')">${icon('check')} ${state.read.includes(id)?'Completed — close':'Mark completed'}</button></div>`,true);
}
function completeGuide(id){if(!state.read.includes(id)){state.read.push(id);addXP(10);}activity();closeModal();render();toast('One chapter closer. +10 XP!');}
function downloadGuide(id){const m=MATERIALS.find(x=>x.id===id);const text=`ORBIT STUDY NOTES\n${m.subject}: ${m.title}\n\n${m.intro}\n\n${m.sections.map(([h,p])=>h+'\n'+p).join('\n\n')}\n\nKEY FORMULAS\n${m.formula}\n\nWORKED EXAMPLE\n${m.example}\n\nREMEMBER\n${m.tips.map(t=>'• '+t).join('\n')}\n\nEXAM TRAP\n${m.trap}`;download(`${m.title}.txt`,text,'text/plain');}
/* ---------- command palette ---------- */
function openPalette(){
  modal(`<div class="modal-header"><h2>Search Orbit</h2><button class="close" onclick="closeModal()" aria-label="Close search">×</button></div>
  <input id="palette-input" type="search" placeholder="Type a chapter, guide, formula, or action…" oninput="paletteResults(this.value)" autocomplete="off">
  <div id="palette-results" class="palette-results"></div>`);
  paletteResults('');setTimeout(()=>document.getElementById('palette-input')?.focus(),50);
}
function paletteResults(q){
  q=q.toLowerCase().trim();const box=document.getElementById('palette-results');if(!box)return;
  const ch=CHAPTERS.filter(c=>!q||`${c.name} ${c.subject}`.toLowerCase().includes(q)).slice(0,5);
  const guides=MATERIALS.filter(m=>q&&`${m.title} ${m.subject}`.toLowerCase().includes(q)).slice(0,4);
  const acts=[['Daily 10 — start now',"closeModal();startDaily10()"],['Fix my mistakes',"closeModal();startGrand('mistakes')"],['Start focus session',"closeModal();focusModal()"],['NEET full mock',"closeModal();startGrand('neet-mock')"],['JEE full mock',"closeModal();startGrand('jee-mock')"]].filter(([n])=>!q||n.toLowerCase().includes(q)).slice(0,4);
  box.innerHTML=(ch.map(c=>`<button class="palette-item" onclick="closeModal();location.href='combos.html?q=${encodeURIComponent(c.name)}'"><span class="subject-icon sm ${SUBJECTS[c.subject].color}">${icon(SUBJECTS[c.subject].icon)}</span><span><b>${c.name}</b><small>${c.subject} · 3 combos</small></span></button>`).join('')
  +guides.map(g=>`<button class="palette-item" onclick="closeModal();location.href='materials.html?q=${encodeURIComponent(g.title)}'">${icon('book')}<span><b>${g.title}</b><small>Guide · ${g.time} min</small></span></button>`).join('')
  +acts.map(([n,fn])=>`<button class="palette-item" onclick="${fn}">${icon('bolt')}<span><b>${n}</b><small>Action</small></span></button>`).join(''))||'<div class="empty">Nothing found. Try “photo”, “mole”, “probability”…</div>';
}
/* ---------- render + init ---------- */
function render(){
  const c=document.getElementById('content');if(!c)return;
  if(page==='tests'&&typeof activeQuiz!=='undefined'&&activeQuiz&&activeQuiz.questions&&typeof renderQuiz==='function'){renderQuiz();if(typeof startQuizTimer==='function')startQuizTimer();return;}
  const views={home,combos:combosPage,materials:()=>library(false),bookmarks:()=>library(true),tests:testsPage,flashcards:flashcardsPage,formulas:formulasPage,planner:plannerPage,progress:progressPage};
  c.innerHTML=(views[page]||home)();
  if(page==='combos')renderCombosGrid();
  window.scrollTo(0,0);
}
document.addEventListener('keydown',e=>{
  const dialog=document.querySelector('.modal');
  if(e.key==='Escape'&&dialog){closeModal();return;}
  if(e.key==='Tab'&&dialog){const els=[...dialog.querySelectorAll('button,input,select,a[href]')].filter(el=>!el.disabled);if(!els.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
  if((e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(((document||{}).activeElement||{}).tagName)&&!dialog)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();openPalette();return;}
  if(typeof quizKeys==='function'&&quizKeys(e))return;
});
/* Deferred until DOMContentLoaded so app-quiz.js + app-study.js have executed. */
window.addEventListener('DOMContentLoaded',()=>{
  const qs=new URLSearchParams(location.search);
  const subj=qs.get('subject');
  if(subj&&SUBJECTS[subj]){if(subj==='Biology')state.track='NEET';if(subj==='Mathematics')state.track='JEE';if(page==='materials')filter=subj;if(page==='combos')comboSubject=subj;if(page==='formulas'&&typeof formulaSubject!=='undefined')formulaSubject=subj;if(typeof flashSubject!=='undefined'&&page==='flashcards')flashSubject=subj;save();}
  const q=qs.get('q');if(q&&(page==='combos'))comboSearch=q;
  shell();
  if(page==='tests'){
    const review=qs.get('review');
    if(review&&typeof showResult==='function'&&state.attempts.some(a=>a.id===review)){showResult(review);return;}
    if(typeof restoreQuiz==='function'){if(!restoreQuiz()){const start=qs.get('start');if(start&&typeof testSetup==='function'&&[...subjects(),'Mixed practice'].includes(start))testSetup(start);}}
  }
});
