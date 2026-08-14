import { getDayOfWeek, isSameLocalDay } from './date';
import { Task } from '../store/types';

export function isScheduledToday(task: Task, now: Date = new Date()): boolean {
  if (!task.scheduledDays || task.scheduledDays.length === 0) {
    return true;
  }
  return task.scheduledDays.includes(getDayOfWeek(now));
}

export function isCompletedToday(task: Task, now: Date = new Date()): boolean {
  return task.lastCompletedAt !== null && isSameLocalDay(task.lastCompletedAt, now);
}

export function getTodayTasks(tasks: Task[], now: Date = new Date()): Task[] {
  return tasks.filter((task) => isScheduledToday(task, now));
}
