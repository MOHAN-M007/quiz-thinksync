export async function onRequestGet(context){
  const { env } = context;
  try {
    const list = await env.QUIZ_QUESTIONS.list({ prefix: '' });
    const keys = list.keys.map(k=>k.name);
    // shuffle
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    const pick = keys.slice(0,20);
    const out = [];
    for (const k of pick) {
      const raw = await env.QUIZ_QUESTIONS.get(k);
      if (!raw) continue;
      const q = JSON.parse(raw);
      out.push({ id: q.id || k, question: q.question, options: q.options });
    }
    return new Response(JSON.stringify(out), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}