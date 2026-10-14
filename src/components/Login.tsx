import type { Invitation } from './invitation';
import { useState } from 'react';
import { Smartphone, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import type { Profile } from './ProfileEditor';
export type Session = { phone: string; expiresAt: number; profile: Profile };
export function Login({ onLogin, invitation }: { invitation: Invitation | null; onLogin: (session: Session) => void }) {
 const [mode, setMode] = useState(invitation ? '注册' : '登录'); const [phone, setPhone] = useState(''); const [password, setPassword] = useState(''); const [remember, setRemember] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
 const submit = async (e: React.FormEvent) => {
  e.preventDefault(); if (busy) return; const value = phone.trim(); if (!/^1[3-9]\d{9}$/.test(value)) return setError('请输入正确的 11 位手机号');
  if (password.length < 8 || password.length > 128) return setError('密码需要 8–128 位');
  setBusy(true); setError('');
  try { const session = await api<Session>(mode === '登录' ? '/api/auth/login' : '/api/auth/register', { method: 'POST', body: JSON.stringify({phone:value,password,remember,inviter:invitation?.id}) }); onLogin(session); }
  catch(e) { setError((e as Error).message || '无法连接服务器'); } finally { setBusy(false); }
 };
 return <div className="login-page"><div className="login-brand">👑<h1>仇恨体系</h1><p>打工人的快乐复仇小游戏</p></div><form className="login-card" onSubmit={submit}><div className="profile-editor-tabs">{['登录','注册'].map(m => <button type="button" key={m} className={mode === m ? 'selected' : ''} onClick={() => { setMode(m); setError(''); }}>{m === '登录' ? '手机号登录' : '新用户注册'}</button>)}</div><div className="invite-welcome">{invitation && `${invitation.name} 邀请你加入，登录后自动成为好友`}</div><h2>{mode === '登录' ? '欢迎回来' : '加入职场江湖'}</h2><p>{mode === '登录' ? '登录后，继续你的快乐摸鱼日常' : '注册后，手机号就是你的个人 ID'}</p><label htmlFor="login-phone"><Smartphone size={16}/>手机号</label><input autoFocus id="login-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={11} placeholder="请输入 11 位手机号" value={phone} onChange={e => { setPhone(e.target.value); setError(''); }} aria-invalid={!!error}/><label htmlFor="login-password">密码</label><input id="login-password" type="password" autoComplete={mode === '注册' ? 'new-password' : 'current-password'} minLength={8} maxLength={128} placeholder="请输入至少 8 位密码" value={password} onChange={e => setPassword(e.target.value)}/>{error && <p className="form-error" role="alert">{error}</p>}<button disabled={busy} className="primary" type="submit">{busy ? '正在处理…' : mode === '登录' ? '登录' : '注册并登录'}</button><label className="login-remember-option"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/><span>记住登录 <small>三个月免登录（90 天）</small></span></label></form><p className="login-demo">账号与个人形象保存至云端数据库<br/>手机号作为 ID，密码登录；暂未验证手机号归属</p></div>;
}
