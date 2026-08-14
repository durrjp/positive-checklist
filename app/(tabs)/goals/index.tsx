import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../../store/useAppStore';
import { getTasksForGoal } from '../../../lib/selectors';
import { isCompletedToday } from '../../../lib/today';
import { GoalCard } from '../../../components/GoalCard';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';

export default function GoalsListScreen() {
  const router = useRouter();
  const goals = useAppStore((state) => state.goals);
  const tasks = useAppStore((state) => state.tasks);

  if (goals.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="No Big Goals yet"
          message="Start with one life area you'd like a little more ease in."
        />
        <Fab onPress={() => router.push('/goal/new')} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(goal) => goal.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const goalTasks = getTasksForGoal(tasks, item.id);
          const doneToday = goalTasks.filter((task) => isCompletedToday(task)).length;
          return (
            <GoalCard
              goal={item}
              subtitle={`${doneToday} tiny win${doneToday === 1 ? '' : 's'} today`}
              onPress={() => router.push(`/goals/${item.id}`)}
            />
          );
        }}
      />
      <Fab onPress={() => router.push('/goal/new')} />
    </View>
  );
}

function Fab({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.fab}>
      <Text style={styles.fabText}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
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
