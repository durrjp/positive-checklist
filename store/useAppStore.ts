import { create } from 'zustand';
import { generateId } from '../lib/id';
import { isSameLocalDay } from '../lib/date';
import { CompletionEvent, DayOfWeek, Goal, Task } from './types';

interface AddGoalInput {
  name: string;
  color: string;
  icon: string;
}

interface AddTaskInput {
  goalId: string;
  text: string;
  scheduledDays: DayOfWeek[] | null;
}

interface AppState {
  goals: Goal[];
  tasks: Task[];
  completions: CompletionEvent[];
  addGoal: (input: AddGoalInput) => Goal;
  addTask: (input: AddTaskInput) => Task;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  goals: [],
  tasks: [],
  completions: [],

  addGoal: (input) => {
    const goal: Goal = {
      id: generateId(),
      name: input.name,
      color: input.color,
      icon: input.icon,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ goals: [...state.goals, goal] }));
    return goal;
  },

  addTask: (input) => {
    const task: Task = {
      id: generateId(),
      goalId: input.goalId,
      text: input.text,
      createdAt: new Date().toISOString(),
      scheduledDays: input.scheduledDays,
      lastCompletedAt: null,
    };
    set((state) => ({ tasks: [...state.tasks, task] }));
    return task;
  },

  completeTask: (taskId) => {
    const now = new Date();
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task || (task.lastCompletedAt && isSameLocalDay(task.lastCompletedAt, now))) {
      return;
    }
    const nowIso = now.toISOString();
    const event: CompletionEvent = {
      id: generateId(),
      taskId: task.id,
      goalId: task.goalId,
      completedAt: nowIso,
    };
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, lastCompletedAt: nowIso } : t)),
      completions: [...state.completions, event],
    }));
  },

  uncompleteTask: (taskId) => {
    const now = new Date();
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, lastCompletedAt: null } : t)),
      completions: state.completions.filter(
        (c) => !(c.taskId === taskId && isSameLocalDay(c.completedAt, now))
      ),
    }));
  },
}));
