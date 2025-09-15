export async function onRequestPost(context){
  const { request, env } = context;
  try {
    const { email, username } = await request.json();
    if(!email || !username) return new Response(JSON.stringify({ success:false, message:"email+username required" }), { status:400, headers:{'Content-Type':'application/json'} });
    const raw = await env.QUIZ_USERS.get(email);
    const user = raw ? JSON.parse(raw) : { email, password:'', username:null };
    user.username = username;
    await env.QUIZ_USERS.put(email, JSON.stringify(user));
    return new Response(JSON.stringify({ success:true }), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}