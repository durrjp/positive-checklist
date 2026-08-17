import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { getPastGoals } from '../lib/dailyGoals';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function HistoryScreen() {
  const router = useRouter();
  const dailyGoals = useAppStore((state) => state.dailyGoals);
  const pastGoals = getPastGoals(dailyGoals);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.backLink}>Back</Text>
        </Pressable>
        <Text style={styles.pageTitle}>History</Text>
        <View style={styles.backSpacer} />
      </View>

      {pastGoals.length === 0 ? (
        <EmptyState title="Nothing here yet" message="Past days will show up here once you've completed a few." />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {pastGoals.map((goal) => (
            <View key={goal.id} style={styles.row}>
              <Text style={styles.date}>{goal.forDate}</Text>
              <Text style={[styles.text, goal.completedAt && styles.textDone]}>
                {goal.completedAt ? '✓ ' : ''}
                {goal.emoji ? `${goal.emoji} ` : ''}
                {goal.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  backLink: { ...typography.body, color: colors.accent },
  pressed: { opacity: 0.6 },
  backSpacer: { width: 40 },
  pageTitle: { ...typography.pageTitle, color: colors.textPrimary },
  list: { paddingBottom: 40 },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },
  date: { ...typography.caption, color: colors.textSecondary, marginBottom: 2 },
  text: { ...typography.body, color: colors.textPrimary },
  textDone: { color: colors.textSecondary },
});
