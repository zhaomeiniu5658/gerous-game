import { createAvatar } from '@dicebear/core';
import * as adventurer from '@dicebear/adventurer';
export const hairstyles = [...Array.from({ length: 19 }, (_, i) => `short${String(i + 1).padStart(2, '0')}`), ...Array.from({ length: 26 }, (_, i) => `long${String(i + 1).padStart(2, '0')}`)];
const variant = (index, max) => `variant${String(Math.max(1, Math.min(max, index + 1))).padStart(2, '0')}`;
const cache = new Map();
export function avatarImage(profile) {
    const options = {
        seed: 'office-character', backgroundColor: ['transparent'],
        hair: [hairstyles[profile.haircut ?? (profile.female ? 26 : 7)]],
        hairProbability: 100, hairColor: [(profile.hair ?? '#303649').slice(1)], skinColor: [(profile.skin ?? '#f3c4a5').slice(1)],
        eyes: [variant(profile.eyes ?? 0, 26)],
        eyebrows: [variant(profile.eyebrows ?? 0, 15)],
        mouth: [variant(profile.mouth ?? 0, 30)],
        glassesProbability: profile.glasses ? 100 : 0, glasses: [variant((profile.glasses ?? 1) - 1, 5)],
        earringsProbability: profile.earrings ? 100 : 0, earrings: [variant((profile.earrings ?? 1) - 1, 6)],
        featuresProbability: profile.feature ? 100 : 0, features: [['blush', 'freckles', 'birthmark', 'mustache'][(profile.feature ?? 1) - 1]],
    };
    const key = JSON.stringify([options, profile.face, profile.head, profile.nose]);
    const stored = cache.get(key);
    if (stored)
        return stored;
    let svg = createAvatar(adventurer, options).toString();
    if (profile.nose) {
        const nose = profile.nose === 1 ? '<path d="M354 414q15 18 30 0"/>' : '<path d="M371 394l-10 29h19"/>';
        svg = svg.replace('</svg>', `<g fill="none" stroke="#ad735b" stroke-width="7" stroke-linecap="round">${nose}</g></svg>`);
    }
    const result = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    if (cache.size > 512)
        cache.clear();
    cache.set(key, result);
    return result;
}
export const palette = { hair: ['#303649', '#49372f', '#865c45', '#ba8a51', '#e3c18a', '#765c9b', '#b06479', '#4c8c91'], skin: ['#f8d8bf', '#f3c4a5', '#e5ad8b', '#ca8b66', '#a96948', '#794b35'], shirt: ['#d4e5f8', '#6e9ccf', '#87b3a0', '#b496c8', '#e7b16c', '#d88993', '#52617b', '#eef0f4'] };
