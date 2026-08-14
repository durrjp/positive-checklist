import { useAppStore } from './useAppStore';

beforeEach(() => {
  useAppStore.setState({ goals: [], tasks: [], completions: [] });
});

test('addGoal adds a goal with a generated id', () => {
  const goal = useAppStore.getState().addGoal({ name: 'Be a better friend', color: '#C9B8B0', icon: '🤝' });
  expect(useAppStore.getState().goals).toHaveLength(1);
  expect(useAppStore.getState().goals[0]).toEqual(goal);
  expect(goal.id).toBeTruthy();
});

test('addTask adds a task under a goal', () => {
  const goal = useAppStore.getState().addGoal({ name: 'Move my body more', color: '#B9C4CC', icon: '🚶' });
  const task = useAppStore.getState().addTask({ goalId: goal.id, text: 'Walk around the block', scheduledDays: null });
  expect(useAppStore.getState().tasks).toEqual([task]);
  expect(task.lastCompletedAt).toBeNull();
});

test('completeTask sets lastCompletedAt and logs a completion event', () => {
  const goal = useAppStore.getState().addGoal({ name: 'Move my body more', color: '#B9C4CC', icon: '🚶' });
  const task = useAppStore.getState().addTask({ goalId: goal.id, text: 'Walk around the block', scheduledDays: null });

  useAppStore.getState().completeTask(task.id);

  const updated = useAppStore.getState().tasks.find((t) => t.id === task.id);
  expect(updated?.lastCompletedAt).toBeTruthy();
  expect(useAppStore.getState().completions).toHaveLength(1);
  expect(useAppStore.getState().completions[0].taskId).toBe(task.id);
});

test('completeTask is idempotent for the same day', () => {
  const goal = useAppStore.getState().addGoal({ name: 'Move my body more', color: '#B9C4CC', icon: '🚶' });
  const task = useAppStore.getState().addTask({ goalId: goal.id, text: 'Walk around the block', scheduledDays: null });

  useAppStore.getState().completeTask(task.id);
  useAppStore.getState().completeTask(task.id);

  expect(useAppStore.getState().completions).toHaveLength(1);
});

test('uncompleteTask clears lastCompletedAt and removes the completion event', () => {
  const goal = useAppStore.getState().addGoal({ name: 'Move my body more', color: '#B9C4CC', icon: '🚶' });
  const task = useAppStore.getState().addTask({ goalId: goal.id, text: 'Walk around the block', scheduledDays: null });
  useAppStore.getState().completeTask(task.id);

  useAppStore.getState().uncompleteTask(task.id);

  const updated = useAppStore.getState().tasks.find((t) => t.id === task.id);
  expect(updated?.lastCompletedAt).toBeNull();
  expect(useAppStore.getState().completions).toHaveLength(0);
});
