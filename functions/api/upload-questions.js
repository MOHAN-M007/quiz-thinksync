export async function onRequestPost(context){
  const { request, env } = context;
  try {
    const auth = request.headers.get("Authorization") || "";
    const valid = "Basic " + btoa("mohan_m:upload");
    if (auth !== valid) return new Response(JSON.stringify({ success:false, message:"unauthorized" }), { status:403, headers:{'Content-Type':'application/json'} });
    const { questions } = await request.json();
    if (!Array.isArray(questions)) return new Response(JSON.stringify({ success:false, message:"invalid payload" }), { status:400, headers:{'Content-Type':'application/json'} });
    let count = 0;
    for (const q of questions) {
      // expect: question, optionA..D or options array, correct (0-3)
      const id = q.id || `q_${Date.now()}_${count}`;
      const question = q.question || q.Question || "";
      let options = q.options || [q.optionA,q.optionB,q.optionC,q.optionD].map(x=>x||"");
      if (!Array.isArray(options)) options = [options];
      const answer = (q.correct !== undefined) ? Number(q.correct) : (q.answer !== undefined ? Number(q.answer) : 0);
      const obj = { id, question, options, answer };
      await env.QUIZ_QUESTIONS.put(String(id), JSON.stringify(obj));
      count++;
    }
    return new Response(JSON.stringify({ success:true, message: `${count} questions uploaded` }), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}