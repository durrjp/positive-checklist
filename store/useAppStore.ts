import { create } from 'zustand';
import { generateId } from '../lib/id';
import { DailyGoal } from './types';

interface AddGoalInput {
  text: string;
  emoji: string | null;
  forDate: string;
}

interface AppState {
  dailyGoals: DailyGoal[];
  addGoal: (input: AddGoalInput) => DailyGoal;
  completeGoal: (id: string) => void;
  uncompleteGoal: (id: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  dailyGoals: [],

  addGoal: (input) => {
    const goal: DailyGoal = {
      id: generateId(),
      text: input.text,
      emoji: input.emoji,
      forDate: input.forDate,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    set((state) => ({ dailyGoals: [...state.dailyGoals, goal] }));
    return goal;
  },

  completeGoal: (id) => {
    set((state) => ({
      dailyGoals: state.dailyGoals.map((goal) =>
        goal.id === id && !goal.completedAt
          ? { ...goal, completedAt: new Date().toISOString() }
          : goal
      ),
    }));
  },

  uncompleteGoal: (id) => {
    set((state) => ({
      dailyGoals: state.dailyGoals.map((goal) =>
        goal.id === id ? { ...goal, completedAt: null } : goal
      ),
    }));
  },
}));
