export type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export interface Goal {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Task {
  id: string;
  goalId: string;
  text: string;
  createdAt: string;
  scheduledDays: DayOfWeek[] | null;
  lastCompletedAt: string | null;
}

export interface CompletionEvent {
  id: string;
  taskId: string;
  goalId: string;
  completedAt: string;
}
