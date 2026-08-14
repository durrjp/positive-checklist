import { getTasksForGoal, sortTasksCompletedLast } from './selectors';
import { Task } from '../store/types';

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 't',
    goalId: 'g1',
    text: 'Task',
    createdAt: new Date().toISOString(),
    scheduledDays: null,
    lastCompletedAt: null,
    ...overrides,
  };
}

test('getTasksForGoal returns only tasks matching the goal id', () => {
  const tasks = [
    makeTask({ id: 'a', goalId: 'g1' }),
    makeTask({ id: 'b', goalId: 'g2' }),
    makeTask({ id: 'c', goalId: 'g1' }),
  ];
  expect(getTasksForGoal(tasks, 'g1').map((t) => t.id)).toEqual(['a', 'c']);
});

test('sortTasksCompletedLast moves completed-today tasks to the bottom, preserving relative order', () => {
  const now = new Date('2026-08-14T10:00:00');
  const tasks = [
    makeTask({ id: 'done', lastCompletedAt: now.toISOString() }),
    makeTask({ id: 'pending-1' }),
    makeTask({ id: 'pending-2' }),
  ];
  expect(sortTasksCompletedLast(tasks, now).map((t) => t.id)).toEqual(['pending-1', 'pending-2', 'done']);
});
