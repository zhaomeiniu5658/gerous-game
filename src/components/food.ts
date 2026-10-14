export const foods = [
 { name: '饺子', icon: '🥟', heal: 8, cost: 80 },
 { name: '胡萝卜', icon: '🥕', heal: 5, cost: 50 },
 { name: '雪糕', icon: '🍦', heal: 6, cost: 60 },
 { name: '蛋糕', icon: '🍰', heal: 10, cost: 100 },
];
export const recoverHp = (hp: number, amount: number) => Math.min(100, Math.max(0, Math.round((hp + amount) * 10) / 10));
