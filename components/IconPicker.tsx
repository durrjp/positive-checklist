import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const GOAL_ICON_OPTIONS = [
  '🏡', '🤝', '🚶', '💪', '🧘', '🎨', '📚', '💰',
  '🌱', '🐾', '✍️', '🍳', '🧹', '💤', '🌿', '✨',
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <View style={styles.grid}>
      {GOAL_ICON_OPTIONS.map((icon) => (
        <Pressable
          key={icon}
          onPress={() => onChange(icon)}
          style={[styles.cell, icon === value && styles.selected]}
        >
          <Text style={styles.emoji}>{icon}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.accent, borderWidth: 2 },
  emoji: { fontSize: 20 },
});
