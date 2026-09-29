import { useState } from 'react';
import { repo } from './db';
import type { Entry } from './types';
import { getLanguage } from './i18n';
const today = () => new Date().toISOString().slice(0, 10);
const copy: Record<string, { today: string; goal: string; item: string }> = { fa: { today: 'آب امروز', goal: 'هدف روزانه', item: 'آب' }, ar: { today: 'ماء اليوم', goal: 'الهدف اليومي', item: 'ماء' }, he: { today: 'מי היום', goal: 'יעד יומי', item: 'מים' }, fr: { today: "Eau d’aujourd’hui", goal: 'Objectif quotidien', item: 'Eau' }, it: { today: "Acqua di oggi", goal: 'Obiettivo giornaliero', item: 'Acqua' }, es: { today: 'Agua de hoy', goal: 'Objetivo diario', item: 'Agua' }, tr: { today: 'Bugünün suyu', goal: 'Günlük hedef', item: 'Su' }, en: { today: "Today's water", goal: 'Daily goal', item: 'Water' } };

export function waterTitle(entry: Entry) {
    const amount = entry.title.match(/^water:(\d+(?:\.\d+)?)$/)?.[1];
    if (entry.section !== 'water' || !amount) return entry.title;
    const locale = getLanguage(); return `${amount} ${locale === 'fa' ? 'میلی‌لیتر' : 'ml'} ${copy[locale].item}`;
}
export function WaterEnhancement({ rows, done }: { rows: Entry[]; done: () => Promise<void> }) {
    const [saving, setSaving] = useState(false); const [goal, setGoal] = useState(() => Math.max(2000, Number(localStorage.getItem('health-water-goal')) || 2000)); const locale = getLanguage(); const text = copy[locale]; const unit = locale === 'fa' ? 'میلی‌لیتر' : 'ml';
    const total = rows.filter(x => x.section === 'water' && x.date === today()).reduce((sum, x) => sum + Number(x.fields.amount || 0), 0); const percent = Math.min(100, Math.round(total / goal * 100));
    const changeGoal = (value: string) => { const next = Number(value); if (next < 2000) return; setGoal(next); localStorage.setItem('health-water-goal', String(next)) };
    const add = async (amount: number) => { setSaving(true); try { const now = new Date().toISOString(); await repo.saveEntry({ id: crypto.randomUUID(), section: 'water', title: `water:${amount}`, date: today(), notes: '', fields: { amount: String(amount) }, attachmentIds: [], createdAt: now, updatedAt: now }); await done() } finally { setSaving(false) } };
    return <section className="water-tracker panel"><div className="water-copy"><h2>{text.today}</h2><strong>{total.toLocaleString(locale)} {unit}</strong><label className="water-goal"><span>{text.goal}</span><input type="number" min="2000" step="250" inputMode="numeric" value={goal} onChange={event => changeGoal(event.target.value)} /><small>{unit}</small></label><div className="water-actions">{[200, 250, 500].map(amount => <button key={amount} disabled={saving} onClick={() => void add(amount)}>+ {amount} {unit}</button>)}</div></div><div className="bottle" aria-label={`${percent}%`}><div className="bottle-cap" /><div className="bottle-body"><div className="water-fill" style={{ height: `${percent}%` }} /><span>{percent}%</span></div></div></section>
}
