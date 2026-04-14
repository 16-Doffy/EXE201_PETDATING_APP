import { Redirect, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AdminLayout() {
  const { state, isAdmin } = useApp();

  if (!state.user?.id) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!isAdmin) {
    return <Redirect href="/settings" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
