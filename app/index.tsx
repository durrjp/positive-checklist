import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { getTodayGoals, getTomorrowGoals, sortGoalsCompletedLast } from '../lib/dailyGoals';
import { DailyGoalRow } from '../components/DailyGoalRow';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const router = useRouter();
  const dailyGoals = useAppStore((state) => state.dailyGoals);
  const completeGoal = useAppStore((state) => state.completeGoal);
  const uncompleteGoal = useAppStore((state) => state.uncompleteGoal);

  const todayGoals = sortGoalsCompletedLast(getTodayGoals(dailyGoals));
  const tomorrowGoals = getTomorrowGoals(dailyGoals);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Today</Text>
        <Pressable
          onPress={() => router.push('/history')}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.historyLink}>History</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {todayGoals.length === 0 ? (
          <EmptyState
            title="Nothing planned yet"
            message="What's one small thing you want to do today?"
          />
        ) : (
          todayGoals.map((goal) => (
            <DailyGoalRow
              key={goal.id}
              goal={goal}
              onToggle={() => (goal.completedAt ? uncompleteGoal(goal.id) : completeGoal(goal.id))}
            />
          ))
        )}

        <Text style={styles.sectionLabel}>Tomorrow</Text>
        {tomorrowGoals.length === 0 ? (
          <Text style={styles.tomorrowEmpty}>
            Nothing planned yet — add something whenever you're ready.
          </Text>
        ) : (
          tomorrowGoals.map((goal) => (
            <View key={goal.id} style={styles.tomorrowRow}>
              <Text style={styles.tomorrowText}>
                {goal.emoji ? `${goal.emoji} ` : ''}
                {goal.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/goal/new')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pageTitle: { ...typography.pageTitle, color: colors.textPrimary },
  historyLink: { ...typography.body, color: colors.accent },
  list: { paddingBottom: 90 },
  sectionLabel: { ...typography.label, color: colors.textSecondary, marginTop: 20, marginBottom: 10 },
  tomorrowEmpty: { ...typography.body, color: colors.textSecondary },
  tomorrowRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },
  tomorrowText: { ...typography.body, color: colors.textPrimary },
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
  fabPressed: { backgroundColor: colors.textPrimary },
  pressed: { opacity: 0.6 },
  fabText: {
    color: colors.background,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
