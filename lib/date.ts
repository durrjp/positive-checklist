import { DayOfWeek } from '../store/types';

const DAY_ORDER: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameLocalDay(isoTimestamp: string, compareTo: Date): boolean {
  return toLocalDateString(new Date(isoTimestamp)) === toLocalDateString(compareTo);
}

export function getDayOfWeek(date: Date): DayOfWeek {
  return DAY_ORDER[date.getDay()];
}
