import { useState } from 'react';
import { repo } from './db';
import type { Entry } from './types';
import { t, getLanguage } from './i18n';
const moods = [['😞', '1'], ['😕', '2'], ['😐', '3'], ['🙂', '4'], ['😄', '5']] as const;
const today = () => new Date().toISOString().slice(0, 10);
export function moodLabel(score: string) { const names: Record<string, string[]> = { fa: ['خیلی بد', 'بد', 'معمولی', 'خوب', 'عالی'], ar: ['سيئ جدًا', 'سيئ', 'عادي', 'جيد', 'ممتاز'], he: ['גרוע מאוד', 'גרוע', 'רגיל', 'טוב', 'מצוין'], fr: ['Très mal', 'Mal', 'Normal', 'Bien', 'Très bien'], it: ['Molto male', 'Male', 'Normale', 'Bene', 'Molto bene'], es: ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'], tr: ['Çok kötü', 'Kötü', 'Normal', 'İyi', 'Harika'], en: ['Very bad', 'Bad', 'Okay', 'Good', 'Great'] }; return (names[getLanguage()] || names.en)[Number(score) - 1] || '' }

export function moodTitle(entry: Entry) {
    const score = entry.title.match(/^mood:([1-5])$/)?.[1];
    return entry.section === 'mood' && score ? `${moods[Number(score) - 1][0]} ${moodLabel(score)}` : entry.title;
}
export function MoodEnhancement({ rows, done, dashboard = false }: { rows: Entry[]; done: () => Promise<void>; dashboard?: boolean }) {
    const [saving, setSaving] = useState(false);
    if (rows.some(x => x.section === 'mood' && x.date === today())) return null;
    const add = async (score: string) => { setSaving(true); try { const now = new Date().toISOString(); await repo.saveEntry({ id: crypto.randomUUID(), section: 'mood', title: `mood:${score}`, date: today(), notes: '', fields: { score }, attachmentIds: [], createdAt: now, updatedAt: now }); await done() } finally { setSaving(false) } };
    return <section className="mood-quick panel"><h2>{t(dashboard ? 'امروز چه حسی دارید؟' : 'ثبت خلق‌وخو')}</h2><div className="mood-buttons">{moods.map(([emoji, score]) => <button key={score} type="button" className="mood-button" disabled={saving} onClick={() => void add(score)}><span>{emoji}</span><small>{moodLabel(score)}</small></button>)}</div></section>
}
