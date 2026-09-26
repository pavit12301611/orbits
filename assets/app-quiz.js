/* Orbit 2.0 — quiz engine: infinite generators, combos runner, mocks, review.
   Requires app.js (state, shell, combos) and data files. */
'use strict';
/* ---------- procedural generators (infinite practice) ---------- */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pickR=a=>a[Math.floor(Math.random()*a.length)];
function numOptions(ans,step){
  step=step||Math.max(1,Math.round(Math.abs(ans)*0.25)||1);
  const set=new Set([String(ans)]);const out=[String(ans)];let k=1;
  while(out.length<4&&k<20){for(const s of [ans+k*step,ans-k*step]){if(out.length>=4)break;const t=String(s);if(!set.has(t)){set.add(t);out.push(t);}}k++;}
  return out;
}
function uniq4(ans,cands){const out=[ans];const seen=new Set([ans]);for(const c of cands){if(out.length>=4)break;if(!seen.has(c)){seen.add(c);out.push(c);}}let k=1;while(out.length<4){const c=ans+k*7+3;if(!seen.has(c)){seen.add(c);out.push(c);}k++;}return out;}
function mkGen(subject,chapter,text,options,explanation){
  return {qid:'gen-'+Date.now()+'-'+Math.floor(Math.random()*1e9),subject,text,options:options.map((t,i)=>({text:t,correct:i===0})),explanation,chapter,diff:1,generated:true};
}
const GENS={
 'Differentiation':[
  ()=>{const n=R(2,9),c=R(2,6);const a=`${c*n}x^${n-1}`;return ['d('+c+'x^'+n+')/dx = ?',[a,...numOptions(c*n,2).slice(1).map(x=>x+'x^'+(n-1))],'Power rule: ('+c+'x^'+n+')′ = '+c*n+'x^'+(n-1)+'.'];},
  ()=>{const a=R(2,9);return ['d/dx (x^'+a+' + 3x) = ?',[a+'x^'+(a-1)+' + 3',(a-1)+'x^'+a+' + 3',a+'x^'+a+' + 3',a+'x^'+(a-1)],'Differentiate term by term: '+a+'x^'+(a-1)+' + 3.'];}
 ],
 'Trigonometry':[
  ()=>{const t=[['sin 30°','1/2'],['cos 60°','1/2'],['tan 45°','1'],['sin 90°','1'],['cos 0°','1'],['sin 0°','0'],['cos 90°','0'],['tan 0°','0']];const q=pickR(t);return [q[0]+' = ?',[q[1],'√3/2','1/√2','√3'].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4),'Standard angle value: '+q[0]+' = '+q[1]+'.'];}
 ],
 'Quadratic Equations':[
  ()=>{const r1=R(-6,6)||2,r2=R(-6,6)||3;const s=r1+r2,p=r1*r2;return ['For x² − ('+s+')x + ('+p+') = 0, the product of roots is:',uniq4(p,[p+1,p-1,p+2,p-2,s,-s,s+1]).map(String),'Product = c/a = '+p+'.'];},
  ()=>{const a=R(2,5),s=R(-8,8)||3;const ans=-a*s;return ['If sum of roots of '+a+'x² + bx + c = 0 is '+s+', then b equals:',uniq4(ans,[a*s,-ans+1,s,-s,ans+1,ans-1,ans+a]).map(String),'Sum = −b/a → b = −a·sum = '+ans+'.'];}
 ],
 'Sequences and Series':[
  ()=>{const a=R(2,12),d=R(2,9),n=R(4,10);const t=a+(n-1)*d;return ['Term '+n+' of AP '+a+', '+(a+d)+', '+(a+2*d)+' … is:',numOptions(t,d),'aₙ = a + (n−1)d = '+a+' + '+((n-1)*d)+' = '+t+'.'];}
 ],
 'Motion in a Straight Line':[
  ()=>{const u=R(0,20),a=R(1,6),t=R(2,8);const v=u+a*t;return ['u = '+u+' m/s, a = '+a+' m/s², t = '+t+' s. v = ?',[v+' m/s',...numOptions(v,a).slice(1).map(x=>x+' m/s')],'v = u + at = '+u+' + '+(a*t)+' = '+v+' m/s.'];}
 ],
 'Current Electricity':[
  ()=>{const v=pickR([6,12,24,18,9]),r=pickR([2,3,4,6]);const i=v/r;return [r+' Ω across '+v+' V. Current?',[i+' A',...numOptions(i,1).slice(1).map(x=>x+' A')],'I = V/R = '+v+'/'+r+' = '+i+' A.'];}
 ],
 'Work, Energy and Power':[
  ()=>{const m=pickR([1,2,4,5]),v=pickR([2,4,6,10]);const k=m*v*v/2;return ['KE of '+m+' kg at '+v+' m/s?',[k+' J',...numOptions(k,m*v).slice(1).map(x=>x+' J')],'K = ½mv² = ½×'+m+'×'+(v*v)+' = '+k+' J.'];}
 ],
 'Mole Concept & Solutions':[
  ()=>{const M=pickR([18,36,40,58,100]),n=R(1,5);const m=M*n;return ['Moles in '+m+' g (M = '+M+' g/mol)?',[n+' mol',...numOptions(n,1).slice(1).map(x=>x+' mol')],'n = m/M = '+m+'/'+M+' = '+n+' mol.'];}
 ],
 'Equilibrium':[
  ()=>{const n=R(1,6);return ['pH of 10⁻'+n+' M HCl (complete dissociation)?',[String(n),String(14-n),String(n+1),String(n-1)],'pH = −log(10⁻'+n+') = '+n+'.'];}
 ]
};
function genFor(subject,chapter,n){
  const fns=GENS[chapter];if(!fns||!fns.length)return [];
  const out=[];for(let i=0;i<n;i++){const g=pickR(fns);try{const [t,o,e]=g();out.push(mkGen(subject,chapter,t,o,e));}catch(err){}}
  return out;
}
/* ---------- question building ---------- */
function bankEntry(subject,chapter,idx,entry){
  return {qid:`${subject}|${chapter}|${idx}`,subject,text:entry[0],rawOptions:entry[1],explanation:entry[2],chapter,diff:entry[4]||2,generated:false};
}
function finalize(q){
  const opts=q.rawOptions?q.rawOptions.map((t,i)=>({text:t,correct:i===0})):q.options;
  return {qid:q.qid,subject:q.subject,text:q.text,options:shuffle(opts),explanation:q.explanation,chapter:q.chapter,diff:q.diff||2,generated:!!q.generated};
}
function subjectPool(subject,chapter){
  const arr=BANK[subject]||[];const out=[];
  arr.forEach((e,i)=>{if(!chapter||e[3]===chapter)out.push(bankEntry(subject,e[3],i,e));});
  return out;
}
function evenSpread(subjectsList,perSubject){
  let out=[];
  for(const s of subjectsList){
    const byCh={};subjectPool(s).forEach(q=>{(byCh[q.chapter]=byCh[q.chapter]||[]).push(q);});
    const chs=shuffle(Object.keys(byCh));let got=[];
    let round=0;
    while(got.length<perSubject&&round<10){for(const c of chs){if(got.length>=perSubject)break;const q=byCh[c][round];if(q)got.push(q);}round++;}
    out=out.concat(got);
  }
  return shuffle(out);
}
function fillGenerated(subjectsList,chapters,count,need){
  const out=[];
  for(const s of subjectsList){
    const chs=chapters&&chapters.length?chapters.filter(c=>c.subject===s):CHAPTERS.filter(c=>c.subject===s);
    for(const c of chs){if(out.length>=need)break;out.push(...genFor(s,c.name,Math.min(4,need-out.length)));}
    if(out.length>=need)break;
  }
  return out.slice(0,need);
}
/* mode presets: learn (untimed, +4/0), drill (+4/−1), sprint (+2/0) */
function buildQuestions({subjectsList,chapters,count,mode,pool}){
  let base=[];
  if(pool==='mistakes'){
    const keys=Object.keys(state.mistakes||{});
    for(const k of shuffle(keys)){
      const m=state.mistakes[k];if(!m)continue;
      const arr=BANK[m.s]||[];const e=arr[m.i];
      if(e&&e[3]===m.c)base.push(bankEntry(m.s,m.c,m.i,e));
      if(base.length>=count)break;
    }
  }else if(chapters&&chapters.length){
    for(const c of chapters)base=base.concat(subjectPool(c.subject,c.name));
    base=shuffle(base);
  }else if(subjectsList&&subjectsList.length){
    if(count>=(subjectsList.length*6))base=evenSpread(subjectsList,Math.ceil(count/subjectsList.length));
    else{for(const s of subjectsList)base=base.concat(subjectPool(s));base=shuffle(base);}
  }
  if(mode==='learn')base.sort((a,b)=>(a.diff||2)-(b.diff||2));
  if(mode==='sprint'||mode==='speedrun'){const easy=base.filter(q=>(q.diff||2)<=2);if(easy.length>=Math.min(count,6))base=shuffle(easy);}
  let picked=base.slice(0,count);
  if(picked.length<count){
    const need=count-picked.length;
    const gen=fillGenerated(subjectsList,chapters,need,need);
    picked=picked.concat(gen);
  }
  if(picked.length<count&&subjectsList){
    const have=new Set(picked.map(q=>q.qid));const extra=[];
    for(const s of subjectsList)for(const q of shuffle(subjectPool(s))){if(!have.has(q.qid)){have.add(q.qid);extra.push(q);}if(picked.length+extra.length>=count)break;}
    picked=picked.concat(extra);
  }
  return picked.slice(0,count).map(finalize);
}
/* ---------- quiz state ---------- */
var activeQuiz=null,quizTimer=null;
const QUIZ_KEY='orbit-quiz-v2';
function persistQuiz(){try{if(activeQuiz)localStorage.setItem(QUIZ_KEY,JSON.stringify(activeQuiz));else localStorage.removeItem(QUIZ_KEY);}catch(e){}}
function restoreQuiz(){
  let q=null;try{q=JSON.parse(localStorage.getItem(QUIZ_KEY)||'null');}catch(e){}
  if(!q||!q.questions||!q.questions.length)return false;
  activeQuiz=q;
  if(q.deadline&&Date.now()>=q.deadline){finishTest(true);return true;}
  if(page==='tests'){renderQuiz();startQuizTimer();}
  return true;
}
function startQuizTimer(){clearInterval(quizTimer);updateQuizTime();if(activeQuiz&&activeQuiz.deadline)quizTimer=setInterval(updateQuizTime,1000);}
function updateQuizTime(){
  if(!activeQuiz||!activeQuiz.deadline)return;
  const sec=Math.max(0,Math.ceil((activeQuiz.deadline-Date.now())/1000));
  const el=document.getElementById('quiz-time');
  if(el){el.textContent=formatTime(sec);el.classList.toggle('low',sec<60);}
  if(sec===0){try{closeModal();}catch(e){}finishTest(true);}
}
function formatTime(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function launchQuiz({label,track,subjectsList,mode,plus,minus,questions,spq}){
  if(!questions.length){toast('No questions available for this selection yet.');return;}
  activeQuiz={id:'attempt-'+Date.now(),label,track:track||state.track,subjectsList,mode,plus,minus,questions,answers:{},locked:{},index:0,started:Date.now(),deadline:spq?Date.now()+questions.length*spq*1000:null,spq:spq||0};
  persistQuiz();
  if(page!=='tests'){location.href='tests.html';return;}
  renderQuiz();startQuizTimer();window.scrollTo(0,0);
}
/* ---------- starters ---------- */
function startCombo(id){
  const c=comboById(id);if(!c){toast('Combo not found.');return;}
  const preset={learn:{plus:4,minus:0,spq:0},drill:{plus:4,minus:state.settings.neg?1:0,spq:state.settings.tpq},sprint:{plus:2,minus:0,spq:30}}[c.mode.mode];
  const qs=buildQuestions({subjectsList:[c.chapter.subject],chapters:[c.chapter],count:c.mode.count,mode:c.mode.mode});
  launchQuiz({label:`${c.chapter.subject} · ${c.chapter.name} · ${c.mode.label}`,subjectsList:[c.chapter.subject],mode:c.mode.mode,plus:preset.plus,minus:preset.minus,questions:qs,spq:preset.spq});
}
function startGrand(id){
  if(id==='mistakes'){
    const n=mistakeCount();
    if(!n){toast('No mistakes banked yet — take any test and your wrong answers will wait for you here.');return;}
    const qs=buildQuestions({subjectsList:Object.keys(BANK),count:Math.min(15,n),mode:'learn',pool:'mistakes'});
    launchQuiz({label:'Mistake fixer',subjectsList:Object.keys(BANK),mode:'learn',plus:4,minus:0,questions:qs,spq:0});return;
  }
  if(id==='daily10'){
    const qs=buildQuestions({subjectsList:subjects(),count:10,mode:'drill'});
    launchQuiz({label:'Daily 10 · '+state.track,subjectsList:subjects(),mode:'drill',plus:4,minus:0,questions:qs,spq:90});return;
  }
  if(id==='speedrun'){
    const qs=buildQuestions({subjectsList:subjects(),count:20,mode:'speedrun'});
    launchQuiz({label:'Speed run · '+state.track,subjectsList:subjects(),mode:'sprint',plus:2,minus:0,questions:qs,spq:20});return;
  }
  if(id==='marathon'){
    const qs=buildQuestions({subjectsList:Object.keys(BANK),count:30,mode:'drill'});
    launchQuiz({label:'Mixed marathon',subjectsList:Object.keys(BANK),mode:'drill',plus:4,minus:state.settings.neg?1:0,questions:qs,spq:60});return;
  }
  if(id==='neet-mock'){
    const qs=evenSpread(['Physics','Chemistry','Biology'],15).slice(0,45).map(finalize);
    launchQuiz({label:'NEET full mock',track:'NEET',subjectsList:['Physics','Chemistry','Biology'],mode:'drill',plus:4,minus:1,questions:qs,spq:60});return;
  }
  if(id==='jee-mock'){
    const qs=evenSpread(['Physics','Chemistry','Mathematics'],10).slice(0,30).map(finalize);
    launchQuiz({label:'JEE full mock',track:'JEE',subjectsList:['Physics','Chemistry','Mathematics'],mode:'drill',plus:4,minus:1,questions:qs,spq:90});return;
  }
}
function startDaily10(){startGrand('daily10');}
function testSetup(subject){
  modal(`<div class="modal-header"><div><div class="eyebrow">${state.track} PRACTICE</div><h2>${esc(subject)}</h2></div><button class="close" onclick="closeModal()" aria-label="Close setup">×</button></div>
  <p class="subtitle" style="margin-bottom:20px">Fresh shuffle every time. Pick your depth and pace.</p>
  <div class="form-group"><label for="question-count">How much would you like to practice?</label>
  <select id="question-count"><option value="8">Quick · 8 questions</option><option value="12" selected>Standard · 12 questions</option><option value="16">Deep · 16 questions</option><option value="20">Marathon · 20 questions</option></select></div>
  <div class="form-group"><label for="question-mode">Mode</label>
  <select id="question-mode"><option value="drill">Drill — timed, +4/−1 exam marking</option><option value="learn">Learn — untimed, instant explanations</option><option value="sprint">Sprint — 30 s per question</option></select></div>
  <div class="modal-footer"><button class="btn light" onclick="closeModal()">Not now</button><button class="btn" onclick="startTest('${esc(subject)}')">Start practice ${icon('arrow')}</button></div>`);
}
function startTest(subject){
  const count=Number((document.getElementById('question-count')||{}).value||12);
  const mode=((document.getElementById('question-mode')||{}).value||'drill');
  const list=subject==='Mixed practice'?subjects():[subject];
  const preset={learn:{plus:4,minus:0,spq:0},drill:{plus:4,minus:state.settings.neg?1:0,spq:state.settings.tpq},sprint:{plus:2,minus:0,spq:30}}[mode];
  const qs=buildQuestions({subjectsList:list,count,mode});
  try{closeModal();}catch(e){}
  launchQuiz({label:`${subject} · ${mode[0].toUpperCase()+mode.slice(1)}`,subjectsList:list,mode,plus:preset.plus,minus:preset.minus,questions:qs,spq:preset.spq});
}
/* ---------- tests page ---------- */
function testsPage(){
  return title('PRACTICE MAKES PROGRESS','Less guesswork. More confidence.','Subject drills, full mocks and a mistake fixer — every attempt freshly shuffled.',trackToggle())
  +resumeBanner()
  +`<div class="section-head"><h2>Grand modes<small>The big sessions.</small></h2></div>
  <div class="grands">${GRANDS.map(g=>`<button class="grand" onclick="startGrand('${g.id}')"><span class="grand-icon">${icon(g.icon)}</span><span><b>${g.name}</b><small>${g.desc}</small></span>${icon('arrow')}</button>`).join('')}</div>
  <div class="section-head"><h2>Quick subject drills<small>Or go chapter-precise with the 150 combos.</small></h2><a href="combos.html">150 combos ${icon('arrow')}</a></div>
  <div class="test-grid">${[...subjects(),'Mixed practice'].map(s=>`<article class="test-card"><div class="subject-icon ${SUBJECTS[s]?SUBJECTS[s].color:'physics'}">${icon(SUBJECTS[s]?SUBJECTS[s].icon:'shuffle')}</div>
  <div class="eyebrow" style="margin-top:20px">${state.track} · SHUFFLED EVERY TIME</div><h3>${s==='Mixed practice'?'A little bit of everything':s}</h3>
  <p>${SUBJECTS[s]?SUBJECTS[s].tagline:'Bring your three subjects together in one focused session.'}</p>
  <div class="meta"><span>${s==='Mixed practice'?subjects().reduce((a,v)=>a+BANK[v].length,0):BANK[s].length} in bank</span><span>+ generated drills</span></div>
  <button class="btn" onclick="testSetup('${s}')">Choose your practice ${icon('arrow')}</button></article>`).join('')}</div>
  <div class="notice" style="margin-top:22px">${icon('target')} Scoring: Drill +4/−1 · Learn +4/0 · Sprint +2/0. Wrong bank answers are saved to your <b>Mistake fixer</b> automatically. Timers keep running even if you leave the page — the test will wait for you here.</div>`+footer();
}
/* ---------- quiz rendering ---------- */
function quizKeys(e){
  if(page!=='tests'||!activeQuiz||!activeQuiz.questions)return false;
  if(document.querySelector('.modal'))return false;
  if(!['INPUT','TEXTAREA','SELECT'].includes(((document||{}).activeElement||{}).tagName)){
    if(e.key>='1'&&e.key<='4'){chooseAnswer(Number(e.key)-1);return true;}
    if(e.key==='ArrowRight'){goQuestion(activeQuiz.index+1);return true;}
    if(e.key==='ArrowLeft'){goQuestion(activeQuiz.index-1);return true;}
  }
  return false;
}
function renderQuiz(){
  const q=activeQuiz;if(!q||!q.questions.length)return;
  const n=q.index,item=q.questions[n],ans=q.answers[n],locked=q.locked[n];
  const total=q.questions.length,done=Object.keys(q.answers).length;
  const isLearn=q.mode==='learn';
  let feedback='';
  if(isLearn&&locked){
    const chosen=item.options[ans],correct=item.options.find(o=>o.correct);
    feedback=`<div class="feedback ${chosen.correct?'good':'bad'}"><b>${chosen.correct?'Correct! +'+q.plus:'Not quite — correct: '+esc(correct.text)}</b><p><b>Why:</b> ${esc(item.explanation)}</p><p class="feedback-ch">${esc(item.subject)} · ${esc(item.chapter)}</p></div>`;
  }
  const content=title(`${esc(q.track)} · ${esc(q.label)}`,'A clear mind. One question at a time.',isLearn?'Answer locks instantly and explains itself. Learn mode is untimed.':'You can skip questions and return before submitting.',`<span class="badge orange">${icon('shuffle')} +${q.plus} / −${q.minus}</span>`)
  +`<div class="quiz-layout"><section class="question-box"><div class="question-heading"><span>QUESTION ${n+1} OF ${total}</span><span>${esc(item.subject)} · ${esc(item.chapter)}</span></div>
  <div class="q-progress"><span style="width:${Math.round(done/total*100)}%"></span></div>
  <h2>${esc(item.text)}</h2>
  <div class="answers">${item.options.map((o,i)=>{
    let cls='answer';if(ans===i)cls+=' selected';
    if(isLearn&&locked){if(o.correct)cls+=' correct';else if(ans===i)cls+=' wrong';}
    return `<button class="${cls}" aria-pressed="${ans===i}" ${isLearn&&locked?'disabled':''} onclick="chooseAnswer(${i})"><span>${String.fromCharCode(65+i)}</span><span>${esc(o.text)}</span></button>`;}).join('')}</div>
  ${feedback}
  <div class="quiz-nav"><button class="btn light" ${n===0?'disabled':''} onclick="goQuestion(${n-1})">← Previous</button>
  ${isLearn?'':'<button class="text-link" onclick="clearAnswer()">Clear answer</button>'}
  ${n===total-1?'<button class="btn" onclick="confirmSubmit()">Review &amp; submit</button>':`<button class="btn" onclick="goQuestion(${n+1})">Next question ${icon('arrow')}</button>`}</div>
  <p class="keys-hint">Keys: 1–4 answer · ← → move</p></section>
  <aside class="panel quiz-side"><div><div class="eyebrow">${q.deadline?'TIME REMAINING':'LEARN MODE · UNTIMED'}</div>
  ${q.deadline?`<div class="timer" id="quiz-time">${formatTime(Math.max(0,Math.ceil((q.deadline-Date.now())/1000)))}</div>`:'<div class="timer calm">∞</div>'}</div>
  <h3 style="font-size:12px;font-weight:550">Your question map</h3>
  <div class="question-palette">${q.questions.map((it,i)=>{let cls='';if(q.answers[i]!==undefined)cls+='answered ';if(isLearn&&q.locked[i])cls+=it.options[q.answers[i]].correct?'good ':'bad ';if(n===i)cls+='current';return `<button class="${cls}" onclick="goQuestion(${i})" aria-label="Question ${i+1}">${i+1}</button>`;}).join('')}</div>
  <p class="quiz-summary">${done} answered · ${total-done} remaining<br>Green squares are answered.</p>
  <button class="btn" style="width:100%;margin-top:16px" onclick="confirmSubmit()">Submit test ${icon('check')}</button>
  <button class="text-link" style="margin-top:10px" onclick="quitQuiz()">End without submitting</button></aside></div>`+footer();
  const el=document.getElementById('content');if(el){el.innerHTML=content;window.scrollTo(0,0);}else return content;
}
function chooseAnswer(i){
  const q=activeQuiz;if(!q)return;
  if(q.mode==='learn'&&q.locked[q.index])return;
  q.answers[q.index]=i;
  if(q.mode==='learn')q.locked[q.index]=true;
  persistQuiz();renderQuiz();
}
function clearAnswer(){delete activeQuiz.answers[activeQuiz.index];persistQuiz();renderQuiz();}
function goQuestion(i){if(i<0||i>=activeQuiz.questions.length)return;activeQuiz.index=i;persistQuiz();renderQuiz();}
function quitQuiz(){modal(`<div class="modal-header"><h2>End this test?</h2><button class="close" onclick="closeModal()" aria-label="Close">×</button></div><p>Your answers so far will be discarded. Submitted tests are the ones that build your progress.</p><div class="modal-footer"><button class="btn light" onclick="closeModal()">Keep going</button><button class="btn" onclick="activeQuiz=null;persistQuiz();clearInterval(quizTimer);closeModal();render();">End test</button></div>`);}
function confirmSubmit(){
  const q=activeQuiz;const left=q.questions.length-Object.keys(q.answers).length;
  modal(`<div class="modal-header"><h2>Ready to see how you did?</h2><button class="close" onclick="closeModal()" aria-label="Close confirmation">×</button></div>
  <p>${left?`You have <strong>${left} unanswered question${left>1?'s':''}</strong>. Skipped questions score zero. You can go back and finish them first.`:'You’ve answered every question. Submit to see your score and detailed explanations.'}</p>
  <div class="modal-footer"><button class="btn light" onclick="closeModal()">Keep practicing</button><button class="btn" onclick="finishTest()">Submit my answers</button></div>`);
}
/* ---------- finishing + results ---------- */
function finishTest(expired=false){
  const q=activeQuiz;if(!q)return;
  clearInterval(quizTimer);
  const r={id:q.id,label:q.label,track:q.track,subjectsList:q.subjectsList||[],mode:q.mode,plus:q.plus,minus:q.minus,questions:q.questions,answers:{...q.answers},index:0,date:new Date().toISOString(),correct:0,incorrect:0,skipped:0,duration:q.deadline?Math.min(Math.round((Date.now()-q.started)/1000),Math.max(60,Math.round((q.deadline-q.started)/1000))):Math.round((Date.now()-q.started)/1000)};
  let xp=0;
  r.questions.forEach((item,i)=>{
    const a=r.answers[i];
    if(a===undefined){r.skipped++;return;}
    const ok=item.options[a].correct;
    if(ok){r.correct++;xp+=item.diff===3?20:item.diff===2?15:10;}
    else r.incorrect++;
    if(!item.generated)recordMastery(item.subject,item.chapter,ok);
    if(!item.generated){
      const parts=String(item.qid).split('|');
      if(parts.length===3){
        if(ok){if(state.mistakes[item.qid])delete state.mistakes[item.qid];}
        else{const prev=state.mistakes[item.qid]||{n:0};state.mistakes[item.qid]={s:parts[0],c:parts[1],i:Number(parts[2]),n:prev.n+1,last:today()};}
      }
    }
  });
  if(q.mode==='learn')xp=Math.round(xp/2);
  r.score=r.correct*q.plus-r.incorrect*q.minus;
  r.maxScore=r.questions.length*q.plus;
  r.xp=xp+5+(r.correct/r.questions.length>=0.8?10:0);
  addXP(r.xp);activity();
  state.attempts.unshift(r);state.attempts=state.attempts.slice(0,100);
  save();activeQuiz=null;persistQuiz();
  try{closeModal();}catch(e){}
  if(page!=='tests'){location.href='tests.html?review='+r.id;return;}
  showResult(r.id);
  if(expired)toast('Time’s up! Your answers were submitted automatically.');
  else toast(`+${r.xp} XP earned. ${r.incorrect?r.incorrect+' added to your Mistake fixer.':'Flawless — nothing to fix!'}`);
}
function showResult(id){
  const r=state.attempts.find(a=>a.id===id);if(!r){render();return;}
  const acc=Math.round(r.correct/r.questions.length*100);
  document.getElementById('content').innerHTML=title(`${esc(r.track)} · ${esc(r.label||r.mode)}`,'Every attempt teaches you something.','Review the why behind each answer — that’s where the marks live.','')
  +`<div class="result-hero"><span class="badge">${icon('check')} PRACTICE COMPLETE · +${r.xp||0} XP</span>
  <h2>${acc>=75?'That’s a strong step forward!':acc>=40?'Solid effort — review and retry.':'A little wiser than before.'}</h2>
  <div class="result-score">${r.score}<small> / ${r.maxScore}</small></div>
  <div class="result-chips"><span>${icon('check')} ${r.correct} correct</span><span>${icon('x')} ${r.incorrect} wrong</span><span>○ ${r.skipped} skipped</span><span>${icon('target')} ${acc}%</span><span>${icon('clock')} ${formatTime(r.duration)}</span></div>
  <div class="result-actions">${r.incorrect+r.skipped?`<button class="btn" onclick="retryAttempt('${r.id}')">${icon('shuffle')} Retry ${r.incorrect+r.skipped} missed</button>`:''}<button class="btn light" onclick="startGrand('mistakes')">${icon('alert')} Mistake fixer</button><a href="progress.html" class="btn light">My progress ${icon('arrow')}</a></div></div>
  <div class="section-head"><h2>Your answer review</h2><small>Understand the why, not just the answer.</small></div>
  ${r.questions.map((item,i)=>{const a=r.answers[i],correct=item.options.find(o=>o.correct);
    const guide=guideForChapter(item.subject,item.chapter);
    return `<article class="review-item"><span class="badge ${a===undefined||!item.options[a].correct?'orange':''}">${a===undefined?'SKIPPED':item.options[a].correct?'CORRECT':'NEEDS A SECOND LOOK'} · ${esc(item.subject)} · ${esc(item.chapter)}</span>
    <h3>${i+1}. ${esc(item.text)}</h3>
    <p class="${a!==undefined&&item.options[a].correct?'correct':'incorrect'}">Your answer: ${a===undefined?'Not answered':esc(item.options[a].text)}</p>
    <p class="correct">Correct answer: ${esc(correct.text)}</p>
    <p><strong>Why:</strong> ${esc(item.explanation)}</p>
    ${guide?`<button class="text-link" onclick="openMaterial('${guide.id}')">Read the guide: ${esc(guide.title)} ${icon('arrow')}</button>`:''}</article>`;}).join('')}`+footer();
  window.scrollTo(0,0);
}
function retryAttempt(id){
  const r=state.attempts.find(a=>a.id===id);if(!r)return;
  const missed=r.questions.map((q,i)=>({q,i})).filter(({q,i})=>r.answers[i]===undefined||!q.options[r.answers[i]].correct).map(({q})=>({...q,options:shuffle(q.options.map(o=>({...o})))}));
  if(!missed.length){toast('Nothing to retry — that attempt was perfect.');return;}
  launchQuiz({label:'Retry · '+(r.label||'practice'),subjectsList:r.subjectsList||subjects(),mode:'learn',plus:4,minus:0,questions:missed,spq:0});
}
