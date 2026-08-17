import { addDays, toLocalDateString } from './date';
import { DailyGoal } from '../store/types';

export function getTodayGoals(goals: DailyGoal[], now: Date = new Date()): DailyGoal[] {
  const today = toLocalDateString(now);
  return goals.filter((goal) => goal.forDate === today);
}

export function getTomorrowGoals(goals: DailyGoal[], now: Date = new Date()): DailyGoal[] {
  const tomorrow = toLocalDateString(addDays(now, 1));
  return goals.filter((goal) => goal.forDate === tomorrow);
}

export function getPastGoals(goals: DailyGoal[], now: Date = new Date()): DailyGoal[] {
  const today = toLocalDateString(now);
  return goals
    .filter((goal) => goal.forDate < today)
    .sort((a, b) => (a.forDate < b.forDate ? 1 : a.forDate > b.forDate ? -1 : 0));
}

export function sortGoalsCompletedLast(goals: DailyGoal[]): DailyGoal[] {
  return [...goals].sort((a, b) => {
    const aDone = a.completedAt !== null;
    const bDone = b.completedAt !== null;
    if (aDone === bDone) return 0;
    return aDone ? 1 : -1;
  });
}
