
let questions = [], current=0, answers=[], timerSec=20*60, timerInterval=null;
async function loadQuiz(){
  const res = await fetch('/api/quiz');
  questions = await res.json();
  answers = questions.map(q=>({id:q.id, selected:null}));
  document.getElementById('qcount').innerText = `Q: 1/${questions.length}`;
  showQuestion(); startTimer();
}
function showQuestion(){
  const q = questions[current];
  document.getElementById('questionText').innerText = q.question;
  const opts = document.getElementById('options'); opts.innerHTML='';
  q.options.forEach((o,i)=>{
    const d = document.createElement('div'); d.className='opt fadeInUp'; d.innerText = o;
    d.onclick = ()=>{ answers[current].selected=i; document.querySelectorAll('.opt').forEach(x=>x.classList.remove('selected')); d.classList.add('selected'); };
    opts.appendChild(d);
  });
  document.getElementById('qcount').innerText = `Q: ${current+1}/${questions.length}`;
  document.getElementById('prevBtn').disabled = current===0;
  document.getElementById('nextBtn').style.display = (current===questions.length-1)?'none':'inline-block';
  document.getElementById('submitBtn').style.display = (current===questions.length-1)?'inline-block':'none';
}
document.getElementById('nextBtn')?.addEventListener('click', ()=>{ if(current<questions.length-1){ current++; showQuestion(); } });
document.getElementById('prevBtn')?.addEventListener('click', ()=>{ if(current>0){ current--; showQuestion(); } });
document.getElementById('submitBtn')?.addEventListener('click', submitQuiz);
function startTimer(){ document.getElementById('timerWrap').style.display='block'; clearInterval(timerInterval); timerInterval = setInterval(()=>{ timerSec--; const m=Math.floor(timerSec/60), s=timerSec%60; document.getElementById('timer').innerText = `${m}:${s<10?'0'+s:s}`; const pct = 100*(1 - timerSec/(20*60)); document.getElementById('progressBar').style.width = pct + '%'; if(timerSec<=0){ clearInterval(timerInterval); alert('Time up! Submitting...'); submitQuiz(); } },1000); }
async function submitQuiz(){ clearInterval(timerInterval); const u = JSON.parse(localStorage.getItem('quizUser')||'{}'); const res = await fetch('/api/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: u.email, answers }) }); const j = await res.json(); if (j.success){ alert(`Score: ${j.report.marks}/${j.report.totalQuestions}`); window.location.href='/leaderboard.html'; } else alert('Error'); }
window.addEventListener('load', ()=>{ if(location.pathname.endsWith('/quiz.html')){ const u = localStorage.getItem('quizUser'); if(!u) location.href='/participant-login.html'; loadQuiz(); } });
