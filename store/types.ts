export interface DailyGoal {
  id: string;
  text: string;
  emoji: string | null;
  forDate: string; // local date string, e.g. "2026-08-17" — the only scheduling concept
  createdAt: string; // ISO timestamp
  completedAt: string | null; // ISO timestamp; null = not done
}
