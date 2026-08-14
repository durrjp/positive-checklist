import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { colors } from '../../theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="goals"
        options={{ title: 'Goals', tabBarIcon: () => <Text style={{ fontSize: 18 }}>🎯</Text> }}
      />
      <Tabs.Screen
        name="today"
        options={{ title: 'Today', tabBarIcon: () => <Text style={{ fontSize: 18 }}>☀️</Text> }}
      />
    </Tabs>
  );
}
