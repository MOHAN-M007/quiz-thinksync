export async function onRequestPost(context){
  const { request, env } = context;
  try {
    const { email, answers } = await request.json();
    if (!email || !Array.isArray(answers)) return new Response(JSON.stringify({ success:false, message:"invalid payload" }), { status:400, headers:{'Content-Type':'application/json'} });
    // load questions map
    const qlist = await env.QUIZ_QUESTIONS.list({ prefix: '' });
    const qmap = {};
    for (const k of qlist.keys) {
      const raw = await env.QUIZ_QUESTIONS.get(k.name);
      if (!raw) continue;
      const q = JSON.parse(raw);
      qmap[q.id || k.name] = q;
    }
    let attempted = 0, correct = 0, wrong = 0;
    for (const a of answers) {
      const q = qmap[a.id];
      if (!q) continue;
      if (a.selected === null || a.selected === undefined) continue;
      attempted++;
      if (Number(a.selected) === Number(q.answer)) correct++;
      else wrong++;
    }
    const total = answers.length;
    const marks = correct;
    // store submission under key email
    const existingRaw = await env.QUIZ_SUBMISSIONS.get(email);
    const existing = existingRaw ? JSON.parse(existingRaw) : { email, username: null, submissions: [] };
    const entry = { id: Date.now(), timestamp: new Date().toISOString(), totalQuestions: total, attempted, notAnswered: total - attempted, correct, wrong, marks, answers };
    existing.submissions.push(entry);
    // update username from users KV if present
    const u = await env.QUIZ_USERS.get(email);
    if (u) {
      const user = JSON.parse(u);
      existing.username = user.username || existing.username;
    }
    await env.QUIZ_SUBMISSIONS.put(email, JSON.stringify(existing));
    return new Response(JSON.stringify({ success:true, report: entry }), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}