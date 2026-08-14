import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { DayPicker } from '../../components/DayPicker';
import { colors } from '../../theme/colors';
import { DayOfWeek } from '../../store/types';

export default function AddTaskScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const addTask = useAppStore((state) => state.addTask);
  const [text, setText] = useState('');
  const [days, setDays] = useState<DayOfWeek[]>([]);

  const canSubmit = text.trim().length > 0 && !!goalId;

  const handleCreate = () => {
    if (!canSubmit || !goalId) return;
    addTask({ goalId, text: text.trim(), scheduledDays: days.length > 0 ? days : null });
    router.back();
  };

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <Text style={styles.title}>New Tiny Task</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What's one small thing?"
        placeholderTextColor={colors.textSecondaryAlt}
        style={styles.input}
      />
      <Text style={styles.label}>Days (optional — leave blank for every day)</Text>
      <DayPicker value={days} onChange={setDays} />
      <Pressable onPress={handleCreate} disabled={!canSubmit} style={[styles.button, !canSubmit && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.surface, padding: 18, paddingTop: 12 },
  handle: { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  input: { backgroundColor: colors.background, borderRadius: 10, padding: 12, color: colors.textPrimary, marginBottom: 14 },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.44, color: colors.textSecondary, marginBottom: 8 },
  button: { marginTop: 18, backgroundColor: colors.accent, padding: 12, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.surface, fontSize: 14, fontWeight: '600' },
});
