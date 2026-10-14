import { UserPlus, Clock } from 'lucide-react';
import { GoldCoin } from './GoldCoin';
export function TaskList({ invited, inviteClaimed, checkInAt, now, onInvite, onInviteClaim, onCheckIn }: { invited: number; inviteClaimed: boolean; checkInAt: number; now: number; onInvite: () => void; onInviteClaim: () => void; onCheckIn: () => void }) {
 const remaining = Math.max(0, checkInAt - now);
 return <section className="task-list"><article><span className="task-icon"><UserPlus size={22}/></span><div><h3>邀请一位好友</h3><p>新增好友后领取 · <GoldCoin/> +200</p><small>{inviteClaimed ? '奖励已领取' : `进度 ${Math.min(1, invited)}/1`}</small></div><button className="mini-primary" disabled={inviteClaimed} onClick={invited ? onInviteClaim : onInvite}>{inviteClaimed ? '已完成' : invited ? '领取' : '去邀请'}</button></article><article><span className="task-icon"><Clock size={22}/></span><div><h3>定时打卡</h3><p>每小时可打卡一次 · <GoldCoin/> +80</p><small>{remaining ? `${duration(remaining)}后可打卡` : '现在可以领取'}</small></div><button className="mini-primary" disabled={remaining > 0} onClick={onCheckIn}>{remaining ? '等待中' : '打卡'}</button></article></section>;
}
function duration(ms: number) { const seconds = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor(seconds % 3600 / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
