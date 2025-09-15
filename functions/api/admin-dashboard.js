export async function onRequestGet(context){
  const { request, env } = context;
  try {
    const auth = request.headers.get("Authorization") || "";
    const allowed = ["gc:2006", "harish:2005", "jai:2006"];
    let ok = false;
    for (const a of allowed) {
      if (auth === ("Basic " + btoa(a))) { ok = true; break; }
    }
    if (!ok) return new Response(JSON.stringify({ success:false, message:"unauthorized" }), { status:403, headers:{'Content-Type':'application/json'} });
    // list submission keys
    const list = await env.QUIZ_SUBMISSIONS.list({ prefix: '' });
    const participants = [];
    for (const key of list.keys) {
      const raw = await env.QUIZ_SUBMISSIONS.get(key.name);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      const subs = obj.submissions || [];
      const latest = subs.length ? subs[subs.length-1] : null;
      let best = null;
      for (const s of subs) if (!best || s.marks > best.marks) best = s;
      const accuracy = latest && latest.attempted ? Math.round((latest.correct / latest.attempted)*100) : 0;
      participants.push({ email: obj.email, username: obj.username || null, attempts: subs.length, latestScore: latest ? latest.marks : 0, bestScore: best ? best.marks : 0, accuracy });
    }
    participants.sort((a,b)=> b.bestScore - a.bestScore);
    return new Response(JSON.stringify({ success:true, participants }), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}