import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { colors, getGoalColorShade } from '../theme/colors';
import { typography } from '../theme/typography';
import { Goal, Task } from '../store/types';
import { isCompletedToday } from '../lib/today';
import { DAY_LABELS } from './DayPicker';
import { ConfettiBurst } from './ConfettiBurst';

interface TaskRowProps {
  task: Task;
  goal: Goal;
  showGoalLabel?: boolean;
  onToggle: () => void;
}

export function TaskRow({ task, goal, showGoalLabel = false, onToggle }: TaskRowProps) {
  const done = isCompletedToday(task);
  const scale = useSharedValue(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const shade = getGoalColorShade(goal.color);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (done) {
      onToggle();
      return;
    }
    scale.value = withSpring(1.25, { damping: 6 }, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfetti(true);
    playTapSound();
    onToggle();
  };

  return (
    <View style={styles.row}>
      <Pressable onPress={handlePress} hitSlop={8}>
        <Animated.View
          style={[styles.checkbox, { borderColor: shade }, done && { backgroundColor: shade }, animatedStyle]}
        >
          {done && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>
      </Pressable>
      <View style={styles.textColumn}>
        <Text style={[styles.taskText, done && styles.taskTextDone]}>{task.text}</Text>
        {showGoalLabel && (
          <Text style={[styles.goalLabel, { color: shade }]}>
            {goal.icon} {goal.name}
          </Text>
        )}
        {!showGoalLabel && task.scheduledDays && task.scheduledDays.length > 0 && (
          <Text style={styles.dayBadge}>{task.scheduledDays.map((d) => DAY_LABELS[d]).join(', ')}</Text>
        )}
      </View>
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
    </View>
  );
}

async function playTapSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/tap.wav'));
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // Sound is a polish detail; a playback failure shouldn't block completion.
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: colors.surface, fontSize: 13 },
  textColumn: { flex: 1 },
  taskText: { ...typography.body, color: colors.textPrimary },
  taskTextDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    textDecorationColor: colors.strikethrough,
    opacity: 0.55,
  },
  goalLabel: { ...typography.caption, marginTop: 2 },
  dayBadge: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
