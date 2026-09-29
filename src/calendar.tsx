import { t } from './i18n';
import { useEffect, useState } from 'react';

export type CalendarKind = 'gregorian' | 'persian' | 'islamic';
const labels: Record<CalendarKind, string> = { gregorian: 'میلادی', persian: 'هجری شمسی', islamic: 'قمری' };
export const calendarChanged = 'health-calendar-change';
export const getCalendarKind = (): CalendarKind => { const value = localStorage.getItem('health-calendar'); return value === 'persian' || value === 'islamic' ? value : 'gregorian' };
export function formatDate(value: string, kind: CalendarKind) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || kind === 'gregorian') return value;
  const date = new Date(`${value}T12:00:00`);
  const locale = kind === 'persian' ? 'fa-IR-u-ca-persian-nu-latn' : 'ar-SA-u-ca-islamic-nu-latn';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function useCalendarKind() {
  const [kind, setKind] = useState<CalendarKind>(getCalendarKind);
  useEffect(() => { const sync = () => setKind(getCalendarKind()); const storage = (e: StorageEvent) => { if (e.key === 'health-calendar' || e.key === null) sync() }; window.addEventListener(calendarChanged, sync); window.addEventListener('storage', storage); return () => { window.removeEventListener(calendarChanged, sync); window.removeEventListener('storage', storage) } }, []);
  return kind;
}
export function FormattedDate({ value }: { value: string }) { const kind = useCalendarKind(); return <time dateTime={value}>{formatDate(value, kind)}</time> }
export function CalendarSettings() {
  const kind = useCalendarKind();
  const change = (next: CalendarKind) => { localStorage.setItem('health-calendar', next); window.dispatchEvent(new Event(calendarChanged)); };
  return <div className="calendar-picker"><label htmlFor="calendar">{t('تقویم')}</label><select id="calendar" value={kind} onChange={e => change(e.target.value as CalendarKind)}>{(Object.keys(labels) as CalendarKind[]).map(x => <option value={x} key={x}>{t(labels[x])}</option>)}</select></div>;
}
