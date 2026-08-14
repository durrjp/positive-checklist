import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getTodayTasks, isCompletedToday } from '../../lib/today';
import { sortTasksCompletedLast } from '../../lib/selectors';
import { TaskRow } from '../../components/TaskRow';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';

export default function TodayScreen() {
  const tasks = useAppStore((state) => state.tasks);
  const goals = useAppStore((state) => state.goals);
  const completeTask = useAppStore((state) => state.completeTask);
  const uncompleteTask = useAppStore((state) => state.uncompleteTask);

  const todayTasks = sortTasksCompletedLast(getTodayTasks(tasks));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Text style={styles.header}>Today</Text>
      {todayTasks.length === 0 ? (
        <EmptyState
          title="That's everything scheduled for today"
          message="Anything else from here on is a bonus."
        />
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(task) => task.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const goal = goals.find((g) => g.id === item.goalId);
            if (!goal) return null;
            return (
              <TaskRow
                task={item}
                goal={goal}
                showGoalLabel
                onToggle={() => {
                  const done = isCompletedToday(item);
                  done ? uncompleteTask(item.id) : completeTask(item.id);
                }}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  list: { paddingBottom: 40 },
});
