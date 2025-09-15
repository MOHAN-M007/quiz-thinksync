export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email, password } = await request.json();
    if (!email) return new Response(JSON.stringify({ success:false, message:"email required" }), { status:400, headers:{'Content-Type':'application/json'} });
    const raw = await env.QUIZ_USERS.get(email);
    if (!raw) return new Response(JSON.stringify({ success:false, message:"not found" }), { status:401, headers:{'Content-Type':'application/json'} });
    const user = JSON.parse(raw);
    if (String(user.password) !== String(password)) return new Response(JSON.stringify({ success:false, message:"invalid" }), { status:401, headers:{'Content-Type':'application/json'} });
    return new Response(JSON.stringify({ success:true, email:user.email, username:user.username || null }), { headers:{'Content-Type':'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ success:false, message:err.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}