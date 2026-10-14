export type FriendInvite = { id: string; name: string };
export function encodeInvite(friend: FriendInvite) { return `gerous-game://friend?v=1&id=${encodeURIComponent(friend.id)}&name=${encodeURIComponent(friend.name)}`; }
export function decodeInvite(text: string): FriendInvite {
  if (text.length > 1024) throw new Error('二维码内容过长');
  let url: URL; try { url = new URL(text); } catch { throw new Error('这不是仇恨体系的好友二维码'); }
  if (url.protocol !== 'gerous-game:' || url.hostname !== 'friend' || url.searchParams.get('v') !== '1') throw new Error('这不是仇恨体系的好友二维码');
  const id = url.searchParams.get('id') ?? ''; const name = url.searchParams.get('name')?.trim() ?? '';
  if (!/^[\w-]{1,64}$/.test(id) || !name || name.length > 16 || /[\x00-\x1f]/.test(name)) throw new Error('好友二维码信息不完整');
  return { id, name };
}
