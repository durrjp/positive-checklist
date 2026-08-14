import { getDayOfWeek } from './date';
import { getTodayTasks, isCompletedToday, isScheduledToday } from './today';
import { Task } from '../store/types';

const NOW = new Date('2026-08-14T10:00:00');
const TODAY_DOW = getDayOfWeek(NOW);
const OTHER_DOW = TODAY_DOW === 'sun' ? 'mon' : 'sun';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    goalId: 'g1',
    text: 'Sample task',
    createdAt: NOW.toISOString(),
    scheduledDays: null,
    lastCompletedAt: null,
    ...overrides,
  };
}

test('overarching task (scheduledDays null) is scheduled every day', () => {
  expect(isScheduledToday(makeTask({ scheduledDays: null }), NOW)).toBe(true);
});

test('task scheduled for today is scheduled today', () => {
  expect(isScheduledToday(makeTask({ scheduledDays: [TODAY_DOW] }), NOW)).toBe(true);
});

test('task scheduled for a different day is not scheduled today', () => {
  expect(isScheduledToday(makeTask({ scheduledDays: [OTHER_DOW] }), NOW)).toBe(false);
});

test('task completed today is completed today', () => {
  expect(isCompletedToday(makeTask({ lastCompletedAt: NOW.toISOString() }), NOW)).toBe(true);
});

test('task completed yesterday is not completed today', () => {
  const yesterday = new Date(NOW);
  yesterday.setDate(yesterday.getDate() - 1);
  expect(isCompletedToday(makeTask({ lastCompletedAt: yesterday.toISOString() }), NOW)).toBe(false);
});

test('getTodayTasks includes overarching and today-scheduled tasks regardless of completion, excludes other-day-tagged tasks', () => {
  const tasks: Task[] = [
    makeTask({ id: 'overarching', scheduledDays: null }),
    makeTask({ id: 'today-tagged', scheduledDays: [TODAY_DOW] }),
    makeTask({ id: 'other-day-tagged', scheduledDays: [OTHER_DOW] }),
    makeTask({ id: 'already-done', scheduledDays: null, lastCompletedAt: NOW.toISOString() }),
  ];

  const result = getTodayTasks(tasks, NOW).map((t) => t.id);

  expect(result).toEqual(['overarching', 'today-tagged', 'already-done']);
});
