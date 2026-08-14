import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { DayOfWeek } from '../store/types';

export const DAY_ORDER: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
};

interface DayPickerProps {
  value: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

export function DayPicker({ value, onChange }: DayPickerProps) {
  const toggle = (day: DayOfWeek) => {
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day]);
  };

  return (
    <View style={styles.row}>
      {DAY_ORDER.map((day) => {
        const selected = value.includes(day);
        return (
          <Pressable key={day} onPress={() => toggle(day)} style={[styles.chip, selected && styles.chipSelected]}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{DAY_LABELS[day].slice(0, 2)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  chip: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12, color: colors.textSecondary },
  chipTextSelected: { color: colors.surface, fontWeight: '600' },
});
