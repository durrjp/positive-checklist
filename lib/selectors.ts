import { Task } from '../store/types';
import { isCompletedToday } from './today';

export function getTasksForGoal(tasks: Task[], goalId: string): Task[] {
  return tasks.filter((task) => task.goalId === goalId);
}

export function sortTasksCompletedLast(tasks: Task[], now: Date = new Date()): Task[] {
  return [...tasks].sort((a, b) => {
    const aDone = isCompletedToday(a, now);
    const bDone = isCompletedToday(b, now);
    if (aDone === bDone) return 0;
    return aDone ? 1 : -1;
  });
}
