import { Fighter } from './AnimeBattle';
import type { Profile } from './ProfileEditor';
export function AppearanceOption({ kind, value, profile }: { kind: string; value: number; profile: Profile }) {
 if (kind === 'female' || kind === 'head' || kind === 'face' || kind === 'outfit' || kind === 'stance') {
  const appearance = { ...profile, [kind]: kind === 'female' ? !!value : value };
  return <span className={`appearance-mini ${kind === 'outfit' || kind === 'stance' ? 'full-body' : ''}`}><Fighter female={appearance.female} hair={appearance.hair} shirt={appearance.shirt} appearance={appearance} headOnly={kind !== 'outfit' && kind !== 'stance'}/></span>;
 }
 return <svg className="feature-icon" viewBox="0 0 80 48" aria-hidden="true">
 {kind === 'eyebrows' && <path d={value === 0 ? 'M10 27L29 20M51 20L70 27' : value === 1 ? 'M10 24L29 24M51 24L70 24' : 'M10 27Q20 13 30 27M50 27Q60 13 70 27'} stroke={profile.hair} strokeWidth="5" fill="none" strokeLinecap="round"/>}
 {kind === 'eyes' && (value === 2 ? <path d="M9 28Q20 10 31 28M49 28Q60 10 71 28" stroke="#403549" strokeWidth="4" fill="none" strokeLinecap="round"/> : <g><ellipse cx="20" cy="24" rx="12" ry={value === 1 ? 7 : 15} fill="white" stroke="#7d8fa8" strokeWidth="1.5"/><ellipse cx="60" cy="24" rx="12" ry={value === 1 ? 7 : 15} fill="white" stroke="#7d8fa8" strokeWidth="1.5"/><ellipse cx="22" cy="24" rx="6" ry={value === 1 ? 6 : 11} fill="#403549"/><ellipse cx="62" cy="24" rx="6" ry={value === 1 ? 6 : 11} fill="#403549"/><circle cx="24" cy="20" r="2" fill="white"/><circle cx="64" cy="20" r="2" fill="white"/></g>)}
 {kind === 'nose' && <path d={value === 0 ? 'M36 27L44 27' : value === 1 ? 'M29 23Q40 41 51 23' : 'M42 9L34 32L47 32'} stroke="#b77d65" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
 {kind === 'mouth' && <path d={value === 0 ? 'M25 26L55 24' : value === 1 ? 'M23 20Q40 43 57 20' : 'M23 17Q40 57 57 17Z'} fill={value === 2 ? '#b76a70' : 'none'} stroke="#a26a61" strokeWidth="3" strokeLinecap="round"/>}
 </svg>;
}
