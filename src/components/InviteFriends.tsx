import { useState } from 'react';
import { Copy, UserPlus, X } from 'lucide-react';
import { invitationLink } from './invitation';
export function InviteFriends({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
 const [message, setMessage] = useState(''); const link = invitationLink(id, name);
 return <div className="modal-layer" onClick={onClose}><section className="sheet invite-sheet" role="dialog" aria-modal="true" aria-label="邀请好友" onClick={e => e.stopPropagation()}><button autoFocus className="close" aria-label="关闭邀请" onClick={onClose}><X/></button><div className="register-icon"><UserPlus size={30}/></div><h2>邀请好友</h2><p>好友通过链接注册或登录后，自动添加你为好友</p><label htmlFor="invite-link">你的专属邀请链接</label><input id="invite-link" value={link} readOnly onFocus={e => e.target.select()}/><button className="primary" onClick={async () => { try { await navigator.clipboard.writeText(link); setMessage('邀请链接已复制，发给好友即可'); } catch { setMessage('请长按或选中上方链接复制'); } }}><Copy size={18}/>复制邀请链接</button>{message && <p role="status">{message}</p>}<small>好友注册或登录后，双方好友关系自动保存至云端。</small>{['localhost','127.0.0.1'].includes(location.hostname) && <small>当前链接仅本机可访问。手机邀请请先用局域网地址打开游戏，再生成链接。</small>}</section></div>;
}
