// ASSETS and DEFAULT_CONFIG are embedded by scripts/build.mjs.
const OWNER='ac8e2a86-a721-4ed9-b4e9-fe19fd9b3179';
const OWNER_EMAIL='wnyxmanagementgroup@gmail.com';
const CONFIG_KEY='classroom/config-v2.json';
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function validate(c){
 const text=(s,max=2000)=>typeof s==='string'&&s.length<=max;
 if(!c||!Number.isSafeInteger(c.version)||c.version<0||!text(c.announcement)||!Array.isArray(c.lessons)||c.lessons.length!==11)return false;
 const ids=new Set();
 for(const l of c.lessons){
  if(!Number.isInteger(l.id)||l.id<20||l.id>30||ids.has(l.id)||typeof l.visible!=='boolean'||!['1','2','extra'].includes(l.term))return false;ids.add(l.id);
  if(!['title','zh','goal','icon','assignment','due','explanation'].every(k=>text(l[k]))||!l.title.trim()||!l.zh.trim()||!l.goal.trim()||!l.explanation.trim())return false;
  if(l.due&&!/^\d{4}-\d{2}-\d{2}$/.test(l.due))return false;
  if(!Array.isArray(l.vocab)||l.vocab.length<2||l.vocab.length>30||!l.vocab.every(w=>['zh','py','th'].every(k=>text(w[k],200)&&w[k].trim())))return false;
  if(!l.question||!['zh','py','target'].every(k=>text(l.question[k],500)&&l.question[k].trim()))return false;
  if(!Array.isArray(l.answers)||l.answers.length!==2||!l.answers.every(a=>['zh','py'].every(k=>text(a[k],500)&&a[k].trim())))return false;
  if(!Array.isArray(l.tokens)||!l.tokens.length||l.tokens.length>100||!l.tokens.every(t=>text(t,100)&&t.trim())||l.tokens.join('')!==l.answers[0].zh.replace(/[。！？]/g,''))return false;
 }
 return true;
}
export default {
 async fetch(request,env){try{
  const url=new URL(request.url),isTeacher=Boolean(request.headers.get('oai-authenticated-user-id')===OWNER || (request.headers.get('oai-authenticated-user-id') && request.headers.get('oai-authenticated-user-email')?.toLowerCase()===OWNER_EMAIL));
  if(url.pathname==='/api/classroom'){
   if(!['GET','PUT'].includes(request.method))return json({error:'Method not allowed'},405);
   if(request.method==='PUT'){
    if(!isTeacher)return json({error:'เฉพาะครูเจ้าของเว็บไซต์เท่านั้นที่แก้ไขได้'},403);
    if(request.headers.get('Origin')!==url.origin)return json({error:'Origin ไม่ถูกต้อง'},403);
    if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'ต้องส่งข้อมูล JSON'},415);
    if(Number(request.headers.get('Content-Length')||0)>100000)return json({error:'ข้อมูลเกินขนาด'},413);
   }
   if(!env.BUCKET)return json({error:'ระบบเก็บข้อมูลห้องเรียนยังไม่พร้อม'},503);
   const obj=await env.BUCKET.get(CONFIG_KEY);const config=obj?await obj.json():structuredClone(DEFAULT_CONFIG);
   if(request.method==='GET')return json({isTeacher,config:{...config,lessons:isTeacher?config.lessons:config.lessons.filter(l=>l.visible)}});
   const raw=await request.text();if(raw.length>100000)return json({error:'ข้อมูลเกินขนาด'},413);
   let next;try{next=JSON.parse(raw)}catch{return json({error:'รูปแบบ JSON ไม่ถูกต้อง'},400)}
   if(!validate(next))return json({error:'ข้อมูลไม่ครบ กรุณาตรวจพินอิน คำตอบ และคำที่แบ่งสำหรับเรียงประโยค'},400);
   if(next.version!==config.version)return json({error:'มีการแก้ไขจากหน้าต่างอื่น กรุณาโหลดค่าล่าสุดก่อนแก้ไขอีกครั้ง'},409);
   next.version++;next.updatedAt=new Date().toISOString();
   const result=await env.BUCKET.put(CONFIG_KEY,JSON.stringify(next),{httpMetadata:{contentType:'application/json'},onlyIf:obj?{etagMatches:obj.etag}:{etagDoesNotMatch:'*'}});
   if(!result)return json({error:'มีการแก้ไขพร้อมกัน กรุณาโหลดค่าล่าสุด'},409);
   return json({config:next});
  }
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
  const key=url.pathname==='/'?'/index.html':url.pathname;
  const asset=ASSETS[key];if(!asset)return new Response('Not found',{status:404});
  const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':key.endsWith('.mp3')?'public, max-age=86400':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
 }catch{return json({error:'ระบบขัดข้อง กรุณาลองใหม่ ข้อมูลเดิมยังไม่ถูกเปลี่ยน'},500)}}
};
