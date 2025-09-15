
async function loadLeaderboard(){
  const res = await fetch('/api/admin-dashboard', { headers: { 'Authorization': 'Basic ' + btoa('gc:2006') } });
  const j = await res.json();
  const wrap = document.getElementById('leaderboard');
  if(!j.success) { wrap.innerHTML = '<p>No leaderboard data yet</p>'; return; }
  const list = j.participants.slice(0,20);
  wrap.innerHTML = '';
  list.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className = 'lb-card fadeInUp';
    card.innerHTML = `<div class="rank-badge">${i+1}</div><h3>${p.username||p.email}</h3><p>Best: ${p.bestScore} • Latest: ${p.latestScore}</p><p>Accuracy: ${p.accuracy}%</p>`;
    if (i<3) { card.classList.add('pulse'); }
    wrap.appendChild(card);
    setTimeout(()=> card.style.transform = 'translateY(0)', 100 + i*70);
  });
}
window.addEventListener('load', ()=>{ if(location.pathname.endsWith('/leaderboard.html')) loadLeaderboard(); });
