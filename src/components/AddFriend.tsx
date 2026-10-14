import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Camera, Download, ImagePlus, QrCode, UserPlus, X } from 'lucide-react';
import { decodeInvite, encodeInvite, type FriendInvite } from './FriendInvite';
export function AddFriend({ onClose, onAdd, profileName, selfId }: { selfId: string; profileName: string; onClose: () => void; onAdd: (friend: FriendInvite) => Promise<string | null> }) {
  const [tab, setTab] = useState('扫码添加'); const [name, setName] = useState(''); const [error, setError] = useState('');
  const [qr, setQr] = useState(''); const [candidate, setCandidate] = useState<FriendInvite | null>(null);
  const [camera, setCamera] = useState<'off' | 'loading' | 'on'>('off'); const [reading, setReading] = useState(false);
  const video = useRef<HTMLVideoElement>(null); const stream = useRef<MediaStream | null>(null); const frame = useRef(0); const generation = useRef(0); const mounted = useRef(true);
  const stop = () => { generation.current++; cancelAnimationFrame(frame.current); stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; if (video.current) video.current.srcObject = null; };
  useEffect(() => { mounted.current = true; QRCode.toDataURL(encodeInvite({ id: selfId, name: profileName }), { width: 320, margin: 3, errorCorrectionLevel: 'M', color: { dark: '#183553', light: '#ffffff' } }).then(value => { if (mounted.current) setQr(value); }).catch(() => { if (mounted.current) setError('二维码生成失败，请重新打开'); }); return () => { mounted.current = false; stop(); }; }, [profileName, selfId]);
  const recognize = (text: string) => { stop(); setCamera('off'); try { const friend = decodeInvite(text); if (friend.id === selfId) throw new Error('这是你的二维码，不能添加自己'); setCandidate(friend); setError(''); } catch (e) { setError((e as Error).message); } };
  const start = async () => {
    stop(); setCandidate(null); setError('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return setError('当前环境无法使用摄像头，请使用 HTTPS 打开，或上传二维码图片');
    const token = generation.current; setCamera('loading');
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (!mounted.current || token !== generation.current) { media.getTracks().forEach(t => t.stop()); return; }
      stream.current = media; const el = video.current!; el.srcObject = media; await el.play();
      if (!mounted.current || token !== generation.current) return;
      setCamera('on'); const canvas = document.createElement('canvas'); const context = canvas.getContext('2d', { willReadFrequently: true })!; let last = 0;
      const scan = (now: number) => {
        if (token !== generation.current) return;
        if (el.readyState >= 2 && now - last > 180) { last = now; canvas.width = Math.min(640, el.videoWidth); canvas.height = Math.round(canvas.width * el.videoHeight / el.videoWidth); context.drawImage(el, 0, 0, canvas.width, canvas.height); const pixels = context.getImageData(0, 0, canvas.width, canvas.height); const result = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' }); if (result) { recognize(result.data); return; } }
        frame.current = requestAnimationFrame(scan);
      }; frame.current = requestAnimationFrame(scan);
    } catch (e) { if (!mounted.current || token !== generation.current) return; stop(); setCamera('off'); setError((e as DOMException).name === 'NotAllowedError' ? '未获得摄像头权限，可以上传二维码图片添加' : '摄像头无法启动，请检查设备或上传二维码图片'); }
  };
  const readFile = async (file?: File) => {
    if (!file) return; stop(); setCamera('off'); setCandidate(null); setError(''); setReading(true);
    const token = generation.current;
    try {
      const bitmap = await createImageBitmap(file); const canvas = document.createElement('canvas'); const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height)); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale)); const ctx = canvas.getContext('2d', { willReadFrequently: true })!; ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close(); const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height); const result = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' }); if (!mounted.current || token !== generation.current) return; if (!result) throw new Error('图片中没有识别到二维码，请选择清晰、完整的图片'); recognize(result.data);
    } catch (e) { if (mounted.current && token === generation.current) setError((e as Error).message || '图片无法读取，请换一张图片'); } finally { if (mounted.current) setReading(false); }
  };
  const confirm = async (friend: FriendInvite) => { const message = await onAdd(friend); if (message) setError(message); };
  return <div className="modal-layer" onClick={onClose}><section className="sheet qr-friend-sheet" role="dialog" aria-modal="true" aria-label="添加好友" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Escape') onClose(); }}><button autoFocus type="button" className="close" aria-label="关闭添加好友" onClick={onClose}><X/></button><h2><UserPlus size={22}/> 添加好友</h2><div className="qr-tabs">{['扫码添加', '我的二维码', '昵称添加'].map(t => <button type="button" key={t} className={tab === t ? 'selected' : ''} onClick={() => { stop(); setCamera('off'); setTab(t); setError(''); setCandidate(null); }}>{t}</button>)}</div>
    {tab === '扫码添加' && <><div className={`qr-camera ${camera === 'on' ? 'on' : ''}`}><video ref={video} muted playsInline aria-label="扫码摄像头预览"/>{camera !== 'on' && <div><QrCode size={54}/><p>{camera === 'loading' ? '正在打开摄像头…' : '将好友二维码放入取景框'}</p></div>}<i className="scan-corners"/></div><div className="qr-scan-actions"><button type="button" className="primary" disabled={camera === 'loading' || reading} onClick={() => { if (camera === 'on') { stop(); setCamera('off'); } else void start(); }}><Camera size={18}/>{camera === 'on' ? '停止扫码' : '打开摄像头'}</button><label className="qr-upload"><ImagePlus size={18}/>{reading ? '识别中…' : '上传二维码'}<input aria-label="上传好友二维码" type="file" accept="image/*" disabled={reading || camera === 'loading'} onChange={e => { void readFile(e.target.files?.[0]); e.target.value = ''; }}/></label></div>{candidate && <div className="qr-candidate"><strong>🧑🏻 {candidate.name}</strong><small>ID：{candidate.id}</small><button type="button" className="primary" onClick={() => confirm(candidate)}>确认添加好友</button></div>}<p className="qr-help">支持扫描好友码，或从相册选择二维码图片</p></>}
    {tab === '我的二维码' && <div className="my-qr"><h3>{profileName}</h3><p>ID：{selfId}</p>{qr ? <img src={qr} alt={`${profileName}的好友二维码`}/> : <p>正在生成二维码…</p>}<p>让好友扫一扫，添加你为好友</p>{qr && <a className="outline" href={qr} download={`${profileName}-好友二维码.png`}><Download size={16}/>保存二维码</a>}</div>}
    {tab === '昵称添加' && <form onSubmit={e => { e.preventDefault(); const value = name.trim(); if (!value) return setError('请输入好友昵称'); confirm({ id: `friend-${Date.now()}`, name: value }); }}><label htmlFor="friend-name">好友昵称</label><input id="friend-name" maxLength={16} placeholder="请输入好友昵称" value={name} onChange={e => { setName(e.target.value); setError(''); }}/><button className="primary" type="submit">添加好友</button></form>}
    {error && <p className="form-error" role="alert">{error}</p>}<small className="qr-demo-note">好友关系保存至云端，可跨设备查看</small>
  </section></div>;
}
