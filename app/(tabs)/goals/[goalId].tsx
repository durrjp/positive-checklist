import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../../store/useAppStore';
import { getTasksForGoal, sortTasksCompletedLast } from '../../../lib/selectors';
import { isCompletedToday } from '../../../lib/today';
import { TaskRow } from '../../../components/TaskRow';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const goal = useAppStore((state) => state.goals.find((g) => g.id === goalId));
  const tasks = useAppStore((state) => state.tasks);
  const completeTask = useAppStore((state) => state.completeTask);
  const uncompleteTask = useAppStore((state) => state.uncompleteTask);

  if (!goal) return null;

  const goalTasks = sortTasksCompletedLast(getTasksForGoal(tasks, goal.id));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Text style={styles.header}>
        {goal.icon} {goal.name}
      </Text>
      {goalTasks.length === 0 ? (
        <EmptyState title="No Tiny Tasks yet" message="What's one small thing for this goal?" />
      ) : (
        <FlatList
          data={goalTasks}
          keyExtractor={(task) => task.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TaskRow
              task={item}
              goal={goal}
              onToggle={() => {
                const done = isCompletedToday(item);
                done ? uncompleteTask(item.id) : completeTask(item.id);
              }}
            />
          )}
        />
      )}
      <Pressable onPress={() => router.push(`/task/new?goalId=${goal.id}`)} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  list: { paddingBottom: 90 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: { color: colors.background, fontSize: 26, fontWeight: '300' },
});
