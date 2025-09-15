export async function onRequestPost(context){
  const { request, env } = context;
  try {
    const auth = request.headers.get("Authorization") || "";
    const valid = "Basic " + btoa("mohan_m:upload");
    if (auth !== valid) return new Response(JSON.stringify({ success:false, message:"unauthorized" }), { status:403, headers:{'Content-Type':'application/json'} });
    const { users } = await request.json();
    if (!Array.isArray(users)) return new Response(JSON.stringify({ success:false, message:"invalid payload" }), { status:400, headers:{'Content-Type':'application/json'} });
    let count = 0;
    for (const u of users) {
      const email = (u.email || u.gmail || u.Email || "").toString().trim();
      const password = (u.password || u.pw || u.phone || "").toString().trim();
      const username = u.username || null;
      if (!email) continue;
      const obj = { email, password, username };
      await env.QUIZ_USERS.put(email, JSON.stringify(obj));
      count++;
    }
    return new Response(JSON.stringify({ success:true, message: `${count} users uploaded` }), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}