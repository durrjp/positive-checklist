import { Pressable, StyleSheet, View } from 'react-native';
import { colors, goalColorPalette } from '../theme/colors';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <View style={styles.row}>
      {goalColorPalette.map((option) => (
        <Pressable
          key={option.tint}
          onPress={() => onChange(option.tint)}
          style={[styles.swatch, { backgroundColor: option.tint }, value === option.tint && styles.selected]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  selected: { borderWidth: 2, borderColor: colors.accent },
});
