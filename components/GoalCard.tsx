import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getGoalColorShade } from '../theme/colors';
import { typography } from '../theme/typography';
import { Goal } from '../store/types';

interface GoalCardProps {
  goal: Goal;
  subtitle: string;
  onPress: () => void;
}

export function GoalCard({ goal, subtitle, onPress }: GoalCardProps) {
  const shade = getGoalColorShade(goal.color);
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: goal.color }]}>
      <Text style={[styles.title, { color: shade }]}>
        {goal.icon} {goal.name}
      </Text>
      <Text style={[styles.subtitle, { color: shade }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { ...typography.cardTitle },
  subtitle: { ...typography.caption, marginTop: 4 },
});
