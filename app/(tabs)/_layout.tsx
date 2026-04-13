import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '🏠',
    explore: '🔍',
    matches: '💖',
    messages: '💬',
    profile: '👤',
  };
  return (
    <View style={[styles.iconContainer, focused && styles.focused]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icons[name] || '•'}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} /> }}
      />
      <Tabs.Screen
        name="matches"
        options={{ title: 'Matches', tabBarIcon: ({ focused }) => <TabIcon name="matches" focused={focused} /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{ title: 'Messages', tabBarIcon: ({ focused }) => <TabIcon name="messages" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  },
  tabBarLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focused: { transform: [{ scale: 1.1 }] },
  icon: { fontSize: 22, opacity: 0.6 },
  iconActive: { opacity: 1 },
});
