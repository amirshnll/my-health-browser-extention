import { useEffect, useState } from 'react';

export type HeightUnit = 'cm' | 'ft';
export type WeightUnit = 'kg' | 'lb';
export type MeasurementUnits = { height: HeightUnit; weight: WeightUnit };
export type MeasurementKind = 'height' | 'weight';

export const unitsChanged = 'health-units-change';
export const getMeasurementUnits = (): MeasurementUnits => ({
  height: localStorage.getItem('health-height-unit') === 'ft' ? 'ft' : 'cm',
  weight: localStorage.getItem('health-weight-unit') === 'lb' ? 'lb' : 'kg'
});

export function saveMeasurementUnits(units: MeasurementUnits) {
  localStorage.setItem('health-height-unit', units.height);
  localStorage.setItem('health-weight-unit', units.weight);
  window.dispatchEvent(new Event(unitsChanged));
}

export function useMeasurementUnits() {
  const [units, setUnits] = useState<MeasurementUnits>(getMeasurementUnits);
  useEffect(() => { const sync = () => setUnits(getMeasurementUnits()); const storage = (event: StorageEvent) => { if (event.key === 'health-height-unit' || event.key === 'health-weight-unit' || event.key === null) sync() }; window.addEventListener(unitsChanged, sync); window.addEventListener('storage', storage); return () => { window.removeEventListener(unitsChanged, sync); window.removeEventListener('storage', storage) } }, []);
  return units;
}

const clean = (value: number, precision: number) => String(Number(value.toFixed(precision)));
export function fromCanonical(value: string, kind: MeasurementKind, units: MeasurementUnits) {
  const number = Number(value); if (!value || !Number.isFinite(number)) return value;
  if (kind === 'height') return units.height === 'ft' ? clean(number / 30.48, 2) : clean(number, 1);
  return units.weight === 'lb' ? clean(number * 2.2046226218, 1) : clean(number, 1);
}
export function toCanonical(value: string, kind: MeasurementKind, units: MeasurementUnits) {
  const number = Number(value); if (!value || !Number.isFinite(number)) return value;
  if (kind === 'height') return clean(units.height === 'ft' ? number * 30.48 : number, 4);
  return clean(units.weight === 'lb' ? number / 2.2046226218 : number, 4);
}
export const unitFor = (kind: MeasurementKind, units: MeasurementUnits) => kind === 'height' ? units.height : units.weight;
