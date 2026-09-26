/* Orbit 2.0 — study tools: flashcards (spaced repetition), formulas, planner,
   focus timer, progress analytics, import/export. Requires app.js. */
'use strict';
/* ================= FLASHCARDS ================= */
var flashSubject='All',flashQueue=[],flashPos=0,flashFlipped=false,flashMode='due',flashDone=0;
function buildDeck(){
  const deck=[];
  for(const m of MATERIALS){
    deck.push({id:`g-${m.id}-0`,subject:m.subject,chapter:m.chapter,tag:'Key idea',front:m.title,back:m.intro});
    deck.push({id:`g-${m.id}-1`,subject:m.subject,chapter:m.chapter,tag:'Formula',front:`Recall the key result of “${m.title}”.`,back:`${m.formula}\n\nExample: ${m.example}`});
    deck.push({id:`g-${m.id}-2`,subject:m.subject,chapter:m.chapter,tag:'Exam trap',front:`What is the classic trap in “${m.title}”?`,back:m.trap});
  }
  for(const k of Object.keys(state.mistakes||{})){
    const m=state.mistakes[k];const e=(BANK[m.s]||[])[m.i];
    if(e)deck.push({id:`m-${k}`,subject:m.s,chapter:m.c,tag:'Your mistake',front:e[0],back:`Answer: ${e[1][0]}\n\nWhy: ${e[2]}`});
  }
  return deck;
}
function cardState(id){return state.flash[id]||{box:1,due:today()};}
function setFlashSubject(s){flashSubject=s;startFlash(flashMode);}
function startFlash(mode){
  flashMode=mode||flashMode;flashPos=0;flashFlipped=false;
  const t=today();
  let pool=buildDeck().filter(c=>flashSubject==='All'||c.subject===flashSubject);
  if(flashMode==='due')pool=pool.filter(c=>{const f=state.flash[c.id];return !f||(f.due||'')<=t;});
  flashQueue=shuffle(pool);flashDone=0;
  renderFlashCard();
}
function renderFlashCard(){
  const wrap=document.getElementById('flash-wrap');if(!wrap)return;
  const deck=buildDeck().filter(c=>flashSubject==='All'||c.subject===flashSubject);
  const t=today();const dueN=deck.filter(c=>{const f=state.flash[c.id];return !f||(f.due||'')<=t;}).length;
  const mastered=deck.filter(c=>(state.flash[c.id]||{}).box>=4).length;
  if(!flashQueue.length){
    wrap.innerHTML=`<div class="empty">${flashMode==='due'?'All caught up! No cards due. Switch to “Study all” for extra reps, or come back tomorrow.':'Press Start to shuffle the deck.'}<br><br><button class="btn" onclick="startFlash('${flashMode==='due'?'all':'due'}')">${flashMode==='due'?'Study all cards':'Show due cards only'}</button></div>
    <div class="flash-stats"><span>${dueN} due</span><span>${mastered}/${deck.length} mastered</span><span>${flashDone} reviewed this session</span></div>`;
    return;
  }
  const card=flashQueue[flashPos],st=cardState(card.id);
  wrap.innerHTML=`<div class="flash-stats"><span>${dueN} due</span><span>${mastered}/${deck.length} mastered</span><span>Card ${flashPos+1} of ${flashQueue.length}</span><span>Box ${st.box}/5</span></div>
  <div class="flashcard ${flashFlipped?'flipped':''}" onclick="flashFlip()" role="button" tabindex="0" aria-label="Flashcard. Activate to flip."><div class="flash-inner">
  <div class="flash-face flash-front"><span class="chip ${SUBJECTS[card.subject].color}">${card.subject}</span><span class="chip">${card.tag}</span><h3>${esc(card.front)}</h3><p class="tap-hint">Tap to reveal</p></div>
  <div class="flash-face flash-back"><span class="chip ${SUBJECTS[card.subject].color}">${card.chapter}</span><p>${esc(card.back).replace(/\n/g,'<br>')}</p></div>
  </div></div>
  ${flashFlipped?`<div class="grade-row"><button class="btn grade g1" onclick="flashGrade(1)">Again</button><button class="btn grade g2" onclick="flashGrade(2)">Hard</button><button class="btn grade g3" onclick="flashGrade(3)">Good</button><button class="btn grade g4" onclick="flashGrade(4)">Easy</button></div>`:`<div class="grade-row"><button class="btn light" onclick="flashFlip()">Show answer</button></div>`}`;
}
function flashFlip(){if(!flashQueue.length)return;flashFlipped=!flashFlipped;renderFlashCard();}
function flashGrade(g){
  const card=flashQueue[flashPos];if(!card)return;
  const st=cardState(card.id);let box=st.box;
  if(g===1)box=1;else if(g===2)box=Math.max(1,box-1);else if(g===3)box=Math.min(5,box+1);else box=Math.min(5,box+2);
  const gaps={1:1,2:2,3:4,4:7,5:14};const d=new Date();d.setDate(d.getDate()+gaps[box]);
  state.flash[card.id]={box,due:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  addXP(2);activity();save();flashDone++;flashFlipped=false;flashPos++;
  if(flashPos>=flashQueue.length){flashQueue=[];}
  renderFlashCard();
  if(!flashQueue.length)toast(`Session complete! +${flashDone*2} XP from flashcards.`);
}
function flashcardsPage(){
  const deck=buildDeck();const t=today();
  const dueN=deck.filter(c=>{const f=state.flash[c.id];return !f||(f.due||'')<=t;}).length;
  setTimeout(()=>{if(!flashQueue.length)startFlash('due');else renderFlashCard();},0);
  return title('SPACED REPETITION','Remember it longer.','150+ auto-made cards from your guides, plus every mistake you bank. Grade honestly — the schedule adapts.','')
  +`<div class="notice">${icon('cards')} ${dueN} cards due today. Cards climb Boxes 1→5 when you recall them; forgotten cards fall back to Box 1.</div>
  <div class="filters"><div class="filter-group">${['All','Physics','Chemistry','Biology','Mathematics'].map(s=>`<button class="filter ${flashSubject===s?'active':''}" onclick="setFlashSubject('${s}')">${s}</button>`).join('')}</div>
  <div class="filter-group"><button class="filter sm ${flashMode==='due'?'active':''}" onclick="startFlash('due')">Due only</button><button class="filter sm ${flashMode==='all'?'active':''}" onclick="startFlash('all')">Study all</button></div></div>
  <div id="flash-wrap"></div>`+footer();
}
/* ================= FORMULAS ================= */
var formulaSubject='Physics';
function setFormulaSubject(s){formulaSubject=s;render();}
function copyFormula(i){
  const f=FORMULAS[formulaSubject][i];const text=`${f[0]}: ${f[1]} (${f[2]})`;
  const done=()=>toast('Formula copied.');
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,()=>fallbackCopy(text,done));else fallbackCopy(text,done);
}
function fallbackCopy(text,cb){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();cb();}
function formulasPage(){
  if(!FORMULAS[formulaSubject])formulaSubject='Physics';
  return title('RAPID RECALL','Every formula. One page.','Tap to copy. Read a card, look away, say it out loud — then check.',`<button class="btn light" onclick="window.print()">${icon('download')} Print</button>`)
  +`<div class="filters"><div class="filter-group">${Object.keys(FORMULAS).map(s=>`<button class="filter ${formulaSubject===s?'active':''}" onclick="setFormulaSubject('${s}')">${s}</button>`).join('')}</div></div>
  <div class="formula-grid">${FORMULAS[formulaSubject].map((f,i)=>`<article class="formula-card"><div class="subject-icon ${SUBJECTS[formulaSubject].color}">${icon(SUBJECTS[formulaSubject].icon)}</div><h3>${f[0]}</h3><div class="formula-line">${f[1]}</div><p>${f[2]}</p><button class="btn light sm" onclick="copyFormula(${i})">Copy</button></article>`).join('')}</div>`+footer();
}
/* ================= PLANNER ================= */
function plannerPage(){
  const shown=state.tasks.filter(t=>taskFilter==='all'||(taskFilter==='today'?t.date===today():taskFilter==='done'?t.done:!t.done));
  const done=state.tasks.filter(t=>t.done).length;
  return title('GIVE YOUR DAY A DIRECTION','Small steps. A solid plan.','Make room for what matters, one achievable goal at a time.',`<button class="btn" onclick="taskModal()">+ Add a task</button>`)
  +`<div class="planner-grid"><section><div class="filters" style="margin-top:0">${[['all','All tasks'],['today','Today'],['pending','To do'],['done','Completed']].map(([k,v])=>`<button class="filter ${taskFilter===k?'active':''}" onclick="taskFilter='${k}';render()">${v}</button>`).join('')}<button class="filter" onclick="clearDone()">Clear completed</button></div>
  <div class="panel planner-list">${taskRows(shown)}</div>
  <p class="subtitle" style="margin-top:17px">${done} of ${state.tasks.length} tasks completed · Saved on this browser only.</p>
  <div class="section-head" style="margin-top:26px"><h2>One-click study plans<small>Drop a full week into your planner.</small></h2></div>
  <div class="test-grid">${TEMPLATES.map(t=>`<article class="test-card"><div class="eyebrow">${t.track==='ANY'?'ANY TRACK':t.track+' TRACK'}</div><h3>${t.name}</h3><p>${t.desc}</p><div class="meta"><span>${t.tasks.length} tasks</span><span>7 days</span></div><button class="btn light" onclick="applyTemplate('${t.id}')">Add this plan ${icon('arrow')}</button></article>`).join('')}</div></section>
  <aside><div class="panel"><div class="section-head"><h2>This week, your way.</h2></div>${weekStrip()}<div class="progress"><span style="width:${state.tasks.length?done/state.tasks.length*100:0}%"></span></div><p class="subtitle" style="margin-top:13px">Progress, not perfection.</p><button class="btn light" style="width:100%;margin-top:18px" onclick="focusModal()">${icon('headphones')} Start a focus session</button></div>
  <div class="quote" style="margin-top:20px"><h2>“Great things are done by a series of small things brought together.”</h2><p>— Vincent van Gogh</p></div></aside></div>`+footer();
}
function taskModal(){
  modal(`<div class="modal-header"><h2>One small goal.</h2><button class="close" onclick="closeModal()" aria-label="Close task form">×</button></div>
  <form onsubmit="addTask(event)"><div class="form-group"><label for="task-title">What would you like to work on?</label><input id="task-title" maxlength="100" required placeholder="e.g. Revise Newton’s laws"></div>
  <div class="form-row"><div class="form-group"><label for="task-subject">Subject</label><select id="task-subject">${[...subjects(),'General revision'].map(s=>`<option>${s}</option>`).join('')}</select></div>
  <div class="form-group"><label for="task-date">Study date</label><input id="task-date" type="date" value="${today()}" required></div></div>
  <div class="modal-footer"><button class="btn light" type="button" onclick="closeModal()">Cancel</button><button class="btn" type="submit">Add to my plan ${icon('arrow')}</button></div></form>`);
}
function addTask(e){e.preventDefault();const v=document.getElementById('task-title').value.trim();if(!v){toast('Give your task a name first.');return;}state.tasks.push({id:'task-'+Date.now(),title:v,subject:document.getElementById('task-subject').value,date:document.getElementById('task-date').value,done:false});save();closeModal();render();toast('A little direction for your day. Task added!');}
function toggleTask(id){const t=state.tasks.find(t=>t.id===id);if(!t)return;t.done=!t.done;if(t.done){activity();addXP(5);}else save();render();}
function deleteTask(id){state.tasks=state.tasks.filter(t=>t.id!==id);save();render();toast('Task removed from your plan.');}
function clearDone(){const n=state.tasks.filter(t=>t.done).length;state.tasks=state.tasks.filter(t=>!t.done);save();render();toast(n?`${n} completed task${n>1?'s':''} cleared.`:'No completed tasks to clear.');}
function applyTemplate(id){
  const t=TEMPLATES.find(x=>x.id===id);if(!t)return;
  modal(`<div class="modal-header"><h2>${t.name}</h2><button class="close" onclick="closeModal()" aria-label="Close">×</button></div><p>${t.desc} This adds <b>${t.tasks.length} tasks</b> starting today.</p><div class="modal-footer"><button class="btn light" onclick="closeModal()">Cancel</button><button class="btn" onclick="confirmTemplate('${id}')">Add ${t.tasks.length} tasks</button></div>`);
}
function confirmTemplate(id){
  const t=TEMPLATES.find(x=>x.id===id);if(!t)return;
  const base=new Date();
  t.tasks.forEach(([off,subj,title],i)=>{const d=new Date(base);d.setDate(base.getDate()+off);state.tasks.push({id:'tpl-'+Date.now()+'-'+i,title,subject:subj,date:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,done:false});});
  save();closeModal();render();toast(`${t.tasks.length} tasks added. Day 1 starts today!`);
}
/* ================= FOCUS TIMER ================= */
var focusTimer=null;
const FOCUS_KEY='orbit-focus-v2';
function focusState(){try{return JSON.parse(localStorage.getItem(FOCUS_KEY)||'null')||{len:25*60,remaining:25*60,running:false,deadline:0};}catch(e){return {len:25*60,remaining:25*60,running:false,deadline:0};}}
function saveFocus(s){try{localStorage.setItem(FOCUS_KEY,JSON.stringify(s));}catch(e){}}
function focusModal(){
  modal(`<div class="modal-header"><div><div class="eyebrow">LESS DISTRACTION. MORE INTENTION.</div><h2>Your quiet focus time.</h2></div><button class="close" onclick="closeFocusModal()" aria-label="Close timer">×</button></div>
  <p class="subtitle" style="text-align:center">Choose one thing. The rest can wait. The timer survives page switches.</p>
  <div class="focus-presets"><button class="filter" onclick="setFocusLen(15)">15 min</button><button class="filter" onclick="setFocusLen(25)">25 min</button><button class="filter" onclick="setFocusLen(50)">50 min</button></div>
  <div class="focus-time" id="focus-time">--:--</div>
  <div class="focus-controls"><button class="btn" id="focus-toggle" onclick="toggleFocus()">Start focus</button><button class="btn light" onclick="resetFocus()">Reset</button></div>
  <p class="subtitle" style="text-align:center;margin-top:23px">Completed sessions add minutes + XP to your progress.</p>`);
  paintFocus();clearInterval(focusTimer);focusTimer=setInterval(paintFocus,500);
}
function closeFocusModal(){clearInterval(focusTimer);closeModal();try{render();}catch(e){}}
function setFocusLen(min){const s=focusState();if(s.running){toast('Pause first to change the length.');return;}s.len=min*60;s.remaining=min*60;saveFocus(s);paintFocus();}
function toggleFocus(){
  const s=focusState();
  if(s.running){s.remaining=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));s.running=false;saveFocus(s);}
  else{if(s.remaining<=0)s.remaining=s.len;s.deadline=Date.now()+s.remaining*1000;s.running=true;saveFocus(s);}
  paintFocus();
}
function resetFocus(){const s=focusState();s.running=false;s.remaining=s.len;saveFocus(s);paintFocus();}
function paintFocus(){
  const s=focusState();let rem=s.remaining;
  if(s.running){rem=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));if(rem===0){completeFocus(s);return;}}
  const el=document.getElementById('focus-time');if(el)el.textContent=`${String(Math.floor(rem/60)).padStart(2,'0')}:${String(rem%60).padStart(2,'0')}`;
  const btn=document.getElementById('focus-toggle');if(btn)btn.textContent=s.running?'Pause':'Start focus';
}
function completeFocus(s){
  clearInterval(focusTimer);
  const mins=Math.round(s.len/60);
  state.focusMinutes+=mins;state.focusSessions++;state.focusLog[today()]=(state.focusLog[today()]||0)+mins;
  addXP(mins);activity();
  saveFocus({len:s.len,remaining:s.len,running:false,deadline:0});
  closeModal();render();toast(`${mins} minutes well spent. +${mins} XP — take a little break!`);
}
/* ================= PROGRESS ================= */
function sparkline(){
  const last=state.attempts.slice(0,15).reverse();
  if(last.length<2)return '<p class="subtitle">Take a few tests and your accuracy trend will draw itself here.</p>';
  const pts=last.map(r=>Math.round(r.correct/r.questions.length*100));
  const W=300,H=70,P=8;
  const X=i=>P+i*(W-2*P)/(pts.length-1),Y=v=>H-P-(v/100)*(H-2*P);
  const line=pts.map((v,i)=>`${X(i)},${Y(v)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="Accuracy trend">${pts.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3.2" fill="${v>=60?'#4c7a5b':'#c9764e'}"><title>${v}%</title></circle>`).join('')}<polyline points="${line}" fill="none" stroke="#4c7a5b" stroke-width="2.5" stroke-linejoin="round"/></svg><p class="subtitle">Last ${pts.length} attempts · latest: ${pts[pts.length-1]}%</p>`;
}
function masteryBlock(){
  const subs=subjects();
  return subs.map(s=>{
    const chs=CHAPTERS.filter(c=>c.subject===s);
    const rows=chs.map(c=>{const m=masteryPct(s,c.name);const g=guideForChapter(s,c.name);
      return `<div class="mastery-row"><span class="mastery-name">${c.name}</span><div class="progress"><span style="width:${m<0?0:m}%"></span></div><b>${m<0?'—':m+'%'}</b><button class="text-link" onclick="startCombo('${c.id}-learn')">Practice</button></div>`;}).join('');
    const vals=chs.map(c=>masteryPct(s,c.name)).filter(v=>v>=0);
    const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
    return `<div class="panel mastery-panel"><div class="section-head"><h2>${s} <small>${avg}% average mastery</small></h2><a href="combos.html?subject=${encodeURIComponent(s)}">Combos ${icon('arrow')}</a></div>${rows}</div>`;
  }).join('');
}
function progressPage(){
  const a=accuracy();
  return title('SEE HOW FAR YOU’VE COME','Your effort, made visible.','Real progress from the chapters you read and the practice you put in.',`<span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn light" onclick="exportCSV()">${icon('download')} CSV</button><button class="btn light" onclick="exportJSON()">${icon('download')} Backup</button></span>`)
  +statsRow()
  +`<div class="section-head"><h2>Accuracy trend</h2>${trackToggle()}</div><div class="panel">${sparkline()}</div>
  <div class="section-head" style="margin-top:26px"><h2>Chapter mastery<small>Accuracy × volume. 12+ questions per chapter fills the bar.</small></h2></div>
  <div class="mastery-grid">${masteryBlock()}</div>
  <div class="section-head" style="margin-top:26px"><h2>Your practice history</h2><span class="subtitle">${state.attempts.length} attempts · latest 100 saved</span></div>
  <div class="panel">${state.attempts.length?`<div class="table-wrap"><table class="results-table"><thead><tr><th>TEST</th><th>DATE</th><th>SCORE</th><th>ACCURACY</th><th>TIME</th><th></th></tr></thead><tbody>
  ${state.attempts.map(r=>`<tr><td><strong>${esc(r.label||r.subject||r.mode)}</strong><br><small>${esc(r.track||'')} · ${r.questions.length} Qs · +${r.plus}/−${r.minus}</small></td><td>${new Date(r.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td><td>${r.score} / ${r.maxScore}</td><td>${Math.round(r.correct/r.questions.length*100)}%</td><td>${formatTime(r.duration)}</td><td><button class="text-link" onclick="showResult('${r.id}')">Review ${icon('arrow')}</button></td></tr>`).join('')}</tbody></table></div>`
  :`<div class="empty" style="border:0">${icon('chart')}<h3>Your story starts with one attempt.</h3><p>Complete a practice test and your results will appear here.</p><a href="tests.html" class="btn">Take your first test ${icon('arrow')}</a></div>`}</div>
  <div class="section-head" style="margin-top:26px"><h2>Settings &amp; data<small>Everything lives in this browser. Back it up before clearing site data.</small></h2></div>
  <div class="settings-grid"><div class="panel"><h3>Daily goals</h3><div class="form-row"><div class="form-group"><label>Questions / day</label><input id="goal-q" type="number" min="1" max="200" value="${state.goals.q}"></div><div class="form-group"><label>Focus min / day</label><input id="goal-min" type="number" min="5" max="600" value="${state.goals.min}"></div></div><button class="btn" onclick="saveGoals()">Save goals</button></div>
  <div class="panel"><h3>Test defaults</h3><div class="form-group"><label>Seconds per question (Drill)</label><select id="set-tpq">${[60,90,120].map(v=>`<option value="${v}" ${state.settings.tpq===v?'selected':''}>${v} seconds</option>`).join('')}</select></div><label class="check-line"><input type="checkbox" id="set-neg" ${state.settings.neg?'checked':''} class="checkbox"> Negative marking in Drills (−1)</label><div style="margin-top:14px"><button class="btn" onclick="saveSettings()">Save settings</button></div></div>
  <div class="panel"><h3>Backup &amp; reset</h3><p class="subtitle">Moving devices? Export a backup file, then import it on the other browser. No account needed — ever.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn light" onclick="document.getElementById('import-file').click()">Import backup</button><input id="import-file" type="file" accept=".json" style="display:none" onchange="importJSON(this)"><button class="btn danger" onclick="resetAll()">Reset everything</button></div></div></div>`+footer();
}
function saveGoals(){state.goals.q=clamp(Number(document.getElementById('goal-q').value)||10,1,200);state.goals.min=clamp(Number(document.getElementById('goal-min').value)||25,5,600);save();render();toast('Daily goals saved.');}
function saveSettings(){state.settings.tpq=Number(document.getElementById('set-tpq').value);state.settings.neg=document.getElementById('set-neg').checked;save();render();toast('Test defaults saved.');}
function exportCSV(){
  if(!state.attempts.length){toast('Complete your first test to export results.');return;}
  const rows=[['Date','Track','Test','Questions','Correct','Incorrect','Skipped','Score','Max','Duration(s)','XP'],...state.attempts.map(r=>[r.date,r.track,r.label||'',r.questions.length,r.correct,r.incorrect,r.skipped,r.score,r.maxScore,r.duration,r.xp||0])];
  download('orbit-practice-results.csv',rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n'),'text/csv');
}
function exportJSON(){download('orbit-backup-'+today()+'.json',JSON.stringify(state),'application/json');toast('Backup downloaded. Keep it somewhere safe.');}
function importJSON(input){
  const f=input.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{try{const o=JSON.parse(rd.result);if(!o||typeof o!=='object'||!Array.isArray(o.attempts))throw 0;state={...defaults(),...o,v:2};save();render();toast('Backup imported. Welcome back!');}catch(e){toast('That file doesn’t look like an Orbit backup.');}};
  rd.readAsText(f);input.value='';
}
function resetAll(){modal(`<div class="modal-header"><h2>Reset everything?</h2><button class="close" onclick="closeModal()" aria-label="Close">×</button></div><p>This erases all progress, plans, bookmarks and results on this browser. Export a backup first if you might want it back.</p><div class="modal-footer"><button class="btn light" onclick="closeModal()">Keep my progress</button><button class="btn danger" onclick="localStorage.removeItem('${LSKEY}');localStorage.removeItem('orbit-quiz-v2');location.reload()">Erase everything</button></div>`);}
/* ================= UPDATES ================= */
function showUpdates(){
  modal(`<div class="modal-header"><h2>Your study arsenal.</h2><button class="close" onclick="closeModal()" aria-label="Close updates">×</button></div>
  <div class="reader"><h3>Inside this workspace</h3><p><b>${bankCount()} practice questions</b> across 50 chapters, <b>150 chapter combos</b> (Learn / Drill / Sprint), 6 grand modes including full NEET &amp; JEE mocks, <b>50 study guides</b> with exam traps, spaced-repetition flashcards, formula sheets, a planner with one-click study plans, and a focus timer.</p>
  <h3>Private by design</h3><p>Study data stays in this browser. Optional Google sign-in only verifies your identity; it does not sync progress. No tracking. Use <b>Backup</b> in Progress to move between devices. This is a starter revision library — pair it with your textbooks and NCERT for the full syllabus.</p></div>
  <div class="modal-footer"><button class="btn" onclick="closeModal()">Let’s keep going ${icon('arrow')}</button></div>`);
}
