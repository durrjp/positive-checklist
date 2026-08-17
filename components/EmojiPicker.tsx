import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const EMOJI_OPTIONS = [
  '🏡', '🤝', '🚶', '💪', '🧘', '🎨', '📚', '💰',
  '🌱', '🐾', '✍️', '🍳', '🧹', '💤', '🌿', '✨',
];

interface EmojiPickerProps {
  value: string | null;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <View style={styles.grid}>
      {EMOJI_OPTIONS.map((emoji) => (
        <Pressable
          key={emoji}
          onPress={() => onChange(emoji)}
          style={({ pressed }) => [
            styles.cell,
            emoji === value && styles.selected,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
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
  pressed: { opacity: 0.6 },
  emoji: { fontSize: 22 },
});
