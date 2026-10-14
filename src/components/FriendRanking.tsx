import { useState } from 'react';
import { Trophy, Swords } from 'lucide-react';
import { Fighter } from './AnimeBattle';
import type { Profile } from './ProfileEditor';
export function FriendRanking({ friends, profile, power, selfId }: { selfId: string; friends: { id: string; name: string; face: string; power: number }[]; profile: Profile; power: number }) {
 const [scope, setScope] = useState('好友');
 const demoUsers = [
  { id: '9001', name: '不加班战神', face: '🧑🏻‍💼', power: 860 },
  { id: '9002', name: '周五大魔王', face: '👩🏻', power: 720 },
  { id: '9003', name: '咖啡续命人', face: '🧑🏻', power: 580 },
  { id: '9004', name: '准点下班', face: '👨🏻', power: 460 },
  { id: '9005', name: '快乐实习生', face: '👩🏻‍🦰', power: 210 },
  { id: '9006', name: '工位小透明', face: '👨🏻‍💼', power: 150 },
 ];
 const participants = [...friends, ...(scope === '所有人' ? demoUsers.filter(user => !friends.some(f => f.id === user.id)) : [])];
 const everyone = [{ id: selfId, name: profile.name, face: '', power }, ...participants].sort((a, b) => b.power - a.power || a.id.localeCompare(b.id));
 const myRank = 1 + participants.filter(f => f.power > power).length;
 return <div className="ranking-page"><div className="filter-tabs ranking-scope" aria-label="排行范围">{['好友', '所有人'].map(item => <button key={item} aria-pressed={scope === item} className={scope === item ? 'selected' : ''} onClick={() => setScope(item)}>{item === '好友' ? '好友排行' : '所有人排行'}</button>)}</div><section className="ranking-summary"><Trophy size={32}/><div><p>{scope === '所有人' ? '我在所有人中的排名' : '我在全部好友中的排名'}</p><h3>第 {myRank} 名 <small>/ {everyone.length} 人</small></h3></div><strong><Swords size={19}/>{power}<small>我的武力</small></strong></section><div className="ranking-caption"><span>{scope === '所有人' ? '所有人武力榜 · 演示' : '好友武力榜'}</span><small>武力相同，并列排名</small></div><div className="ranking-list">{everyone.map(person => { const rank = 1 + everyone.filter(p => p.power > person.power).length; const self = person.id === selfId; return <article key={person.id} className={`ranking-row ${self ? 'is-me' : ''}`} aria-label={`第${rank}名 ${person.name}${self ? ' 我' : ''} 武力${person.power}`}><span className={`rank-number place-${rank}`}>{rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : rank}</span>{self ? <div className="ranking-avatar"><Fighter female={profile.female} hair={profile.hair} shirt={profile.shirt} appearance={profile} headOnly/></div> : <span className="avatar">{person.face}</span>}<div className="ranking-name"><h3>{person.name}{self && <small>我</small>}</h3><p>{self ? '继续训练，冲击更高名次' : `ID：${person.id}`}</p></div><strong><Swords size={14}/>{person.power}</strong></article>; })}</div><p className="friendly-note">{scope === '所有人' ? '包含你、好友与其他演示用户，显示完整榜单' : '包含你和全部已添加好友，训练后排名实时更新'}<br/>{scope === '所有人' ? '演示排名，接入账号与服务端后展示真实全服名次' : '切换「所有人排行」，查看更大范围的排名'}</p></div>;
}
