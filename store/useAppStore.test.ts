import { useAppStore } from './useAppStore';

beforeEach(() => {
  useAppStore.setState({ dailyGoals: [] });
});

test('addGoal adds a goal with a generated id', () => {
  const goal = useAppStore.getState().addGoal({ text: 'Vacuum one room', emoji: '🧹', forDate: '2026-08-17' });
  expect(useAppStore.getState().dailyGoals).toHaveLength(1);
  expect(useAppStore.getState().dailyGoals[0]).toEqual(goal);
  expect(goal.id).toBeTruthy();
  expect(goal.completedAt).toBeNull();
});

test('completeGoal sets completedAt', () => {
  const goal = useAppStore.getState().addGoal({ text: 'Vacuum one room', emoji: '🧹', forDate: '2026-08-17' });

  useAppStore.getState().completeGoal(goal.id);

  const updated = useAppStore.getState().dailyGoals.find((g) => g.id === goal.id);
  expect(updated?.completedAt).toBeTruthy();
});

test('completeGoal is idempotent — does not overwrite an existing completedAt', () => {
  const goal = useAppStore.getState().addGoal({ text: 'Vacuum one room', emoji: '🧹', forDate: '2026-08-17' });

  useAppStore.getState().completeGoal(goal.id);
  const firstCompletedAt = useAppStore.getState().dailyGoals[0].completedAt;
  useAppStore.getState().completeGoal(goal.id);

  expect(useAppStore.getState().dailyGoals[0].completedAt).toBe(firstCompletedAt);
});

test('uncompleteGoal clears completedAt', () => {
  const goal = useAppStore.getState().addGoal({ text: 'Vacuum one room', emoji: '🧹', forDate: '2026-08-17' });
  useAppStore.getState().completeGoal(goal.id);

  useAppStore.getState().uncompleteGoal(goal.id);

  const updated = useAppStore.getState().dailyGoals.find((g) => g.id === goal.id);
  expect(updated?.completedAt).toBeNull();
});
