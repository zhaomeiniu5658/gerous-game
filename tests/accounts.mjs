import assert from 'node:assert/strict';
const base=process.env.TEST_BASE||'http://localhost:8080';
const password='Test-only-Password-2026';
async function request(path,body,cookie,method=body?'POST':'GET') {const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const a=await request('/api/auth/register',{phone:'17099991111',password,remember:true});assert.equal(a.status,200);assert.ok(a.cookie);const b=await request('/api/auth/register',{phone:'17099992222',password,inviter:'17099991111'});assert.equal(b.status,200);
assert.equal((await request('/api/auth/register',{phone:'17099991111',password,remember:true})).status,409);
assert.equal((await request('/api/auth/login',{phone:'17099991111',password:'wrong-password'})).status,401);
assert.equal((await request('/api/me')).status,401);
assert.ok(a.body.expiresAt>Date.now()+89*86400000);
const updated={...a.body.profile,name:'后端测试用户'};assert.equal((await request('/api/profile',updated,a.cookie,'PUT')).status,200);assert.equal((await request('/api/me',null,a.cookie)).body.profile.name,'后端测试用户');
assert.ok((await request('/api/friends',null,a.cookie)).body.friends.some(f=>f.id==='17099992222'));
assert.ok((await request('/api/friends',null,b.cookie)).body.friends.some(f=>f.id==='17099991111'));
assert.equal((await request('/api/profile',{...updated,eyes:99},a.cookie,'PUT')).status,400);
assert.equal((await request('/api/auth/logout',{},a.cookie)).status,200);assert.equal((await request('/api/me',null,a.cookie)).status,401);
assert.equal((await request('/api/auth/login',{phone:'17099991111',password,remember:true})).body.profile.name,'后端测试用户');
console.log('PASS: register, duplicate account, password checks, session expiry, authentication, profile persistence, validation, reciprocal invitation, logout');
