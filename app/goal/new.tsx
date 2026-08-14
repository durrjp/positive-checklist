import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ColorPicker } from '../../components/ColorPicker';
import { IconPicker, GOAL_ICON_OPTIONS } from '../../components/IconPicker';
import { colors, goalColorPalette } from '../../theme/colors';

export default function AddGoalScreen() {
  const router = useRouter();
  const addGoal = useAppStore((state) => state.addGoal);
  const [name, setName] = useState('');
  const [color, setColor] = useState(goalColorPalette[0].tint);
  const [icon, setIcon] = useState(GOAL_ICON_OPTIONS[0]);

  const canSubmit = name.trim().length > 0;

  const handleCreate = () => {
    if (!canSubmit) return;
    addGoal({ name: name.trim(), color, icon });
    router.back();
  };

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <Text style={styles.title}>New Big Goal</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name your goal..."
        placeholderTextColor={colors.textSecondaryAlt}
        style={styles.input}
      />
      <Text style={styles.label}>Color</Text>
      <ColorPicker value={color} onChange={setColor} />
      <Text style={[styles.label, { marginTop: 16 }]}>Icon</Text>
      <IconPicker value={icon} onChange={setIcon} />
      <Pressable onPress={handleCreate} disabled={!canSubmit} style={[styles.button, !canSubmit && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>Create Goal</Text>
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
