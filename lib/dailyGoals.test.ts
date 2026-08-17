import { getPastGoals, getTodayGoals, getTomorrowGoals, sortGoalsCompletedLast } from './dailyGoals';
import { DailyGoal } from '../store/types';

const NOW = new Date('2026-08-17T10:00:00');
const TODAY = '2026-08-17';
const TOMORROW = '2026-08-18';
const YESTERDAY = '2026-08-16';

function makeGoal(overrides: Partial<DailyGoal> = {}): DailyGoal {
  return {
    id: 'g1',
    text: 'Sample goal',
    emoji: null,
    forDate: TODAY,
    createdAt: NOW.toISOString(),
    completedAt: null,
    ...overrides,
  };
}

test('getTodayGoals returns only goals scheduled for today', () => {
  const goals = [
    makeGoal({ id: 'today', forDate: TODAY }),
    makeGoal({ id: 'tomorrow', forDate: TOMORROW }),
    makeGoal({ id: 'yesterday', forDate: YESTERDAY }),
  ];
  expect(getTodayGoals(goals, NOW).map((g) => g.id)).toEqual(['today']);
});

test('getTomorrowGoals returns only goals scheduled for tomorrow', () => {
  const goals = [
    makeGoal({ id: 'today', forDate: TODAY }),
    makeGoal({ id: 'tomorrow', forDate: TOMORROW }),
  ];
  expect(getTomorrowGoals(goals, NOW).map((g) => g.id)).toEqual(['tomorrow']);
});

test('getPastGoals returns goals before today, most recent first', () => {
  const goals = [
    makeGoal({ id: 'today', forDate: TODAY }),
    makeGoal({ id: 'yesterday', forDate: YESTERDAY }),
    makeGoal({ id: 'two-days-ago', forDate: '2026-08-15' }),
  ];
  expect(getPastGoals(goals, NOW).map((g) => g.id)).toEqual(['yesterday', 'two-days-ago']);
});

test('sortGoalsCompletedLast moves completed goals to the bottom, preserving relative order', () => {
  const goals = [
    makeGoal({ id: 'done', completedAt: NOW.toISOString() }),
    makeGoal({ id: 'pending-1' }),
    makeGoal({ id: 'pending-2' }),
  ];
  expect(sortGoalsCompletedLast(goals).map((g) => g.id)).toEqual(['pending-1', 'pending-2', 'done']);
});
