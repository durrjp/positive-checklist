import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { DailyGoal } from '../store/types';
import { ConfettiBurst } from './ConfettiBurst';

interface DailyGoalRowProps {
  goal: DailyGoal;
  onToggle: () => void;
}

export function DailyGoalRow({ goal, onToggle }: DailyGoalRowProps) {
  const done = goal.completedAt !== null;
  const scale = useSharedValue(1);
  const [showConfetti, setShowConfetti] = useState(false);

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
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Animated.View style={[styles.checkbox, done && styles.checkboxDone, animatedStyle]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </Animated.View>
      <View style={styles.textColumn}>
        <Text style={[styles.goalText, done && styles.goalTextDone]}>
          {goal.emoji ? `${goal.emoji} ` : ''}
          {goal.text}
        </Text>
      </View>
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
    </Pressable>
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
  rowPressed: { opacity: 0.7 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.accent },
  checkmark: { color: colors.surface, fontSize: 13 },
  textColumn: { flex: 1 },
  goalText: { ...typography.body, color: colors.textPrimary },
  goalTextDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    textDecorationColor: colors.strikethrough,
    opacity: 0.55,
  },
});
