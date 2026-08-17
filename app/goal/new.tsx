import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { EmojiPicker } from '../../components/EmojiPicker';
import { addDays, toLocalDateString } from '../../lib/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type ForDay = 'today' | 'tomorrow';

export default function AddGoalScreen() {
  const router = useRouter();
  const addGoal = useAppStore((state) => state.addGoal);
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const [forDay, setForDay] = useState<ForDay>('today');

  const canSubmit = text.trim().length > 0;

  const handleCreate = () => {
    if (!canSubmit) return;
    const now = new Date();
    const forDate = toLocalDateString(forDay === 'today' ? now : addDays(now, 1));
    addGoal({ text: text.trim(), emoji, forDate });
    router.back();
  };

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <View style={styles.titleRow}>
        <Text style={styles.title}>New Goal</Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.cancelLink}>Cancel</Text>
        </Pressable>
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What's one small thing?"
        placeholderTextColor={colors.textSecondaryAlt}
        style={styles.input}
      />
      <Text style={styles.label}>When</Text>
      <View style={styles.dayToggle}>
        <DayOption label="Today" selected={forDay === 'today'} onPress={() => setForDay('today')} />
        <DayOption label="Tomorrow" selected={forDay === 'tomorrow'} onPress={() => setForDay('tomorrow')} />
      </View>
      <Text style={[styles.label, { marginTop: 16 }]}>Emoji (optional)</Text>
      <EmojiPicker value={emoji} onChange={setEmoji} />
      <Pressable
        onPress={handleCreate}
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.button,
          !canSubmit && styles.buttonDisabled,
          pressed && canSubmit && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Add Goal</Text>
      </Pressable>
    </View>
  );
}

function DayOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayOption,
        selected && styles.dayOptionSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.dayOptionText, selected && styles.dayOptionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.surface, padding: 18, paddingTop: 12 },
  handle: { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { ...typography.cardTitle, color: colors.textPrimary },
  cancelLink: { ...typography.body, color: colors.accent },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    color: colors.textPrimary,
    marginBottom: 14,
    ...typography.body,
  },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: 8 },
  dayToggle: { flexDirection: 'row', gap: 8 },
  dayOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayOptionSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayOptionText: { ...typography.body, color: colors.textPrimary },
  dayOptionTextSelected: { color: colors.surface, fontWeight: '600' },
  button: { marginTop: 18, backgroundColor: colors.accent, padding: 12, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { backgroundColor: colors.textPrimary },
  buttonText: { ...typography.body, color: colors.surface, fontWeight: '600' },
  pressed: { opacity: 0.6 },
});
