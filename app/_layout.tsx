import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProvider } from '@/context/AppContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <AdminAuthProvider>
        <ThemeProvider value={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: Colors.background, card: Colors.surface, text: Colors.textPrimary, primary: Colors.primary, border: Colors.border } }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: Colors.background } }}>
            <Stack.Screen name="(onboarding)/index" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="pet/[id]" options={{ headerShown: true, headerTransparent: true, headerTintColor: Colors.textPrimary, headerBackTitle: 'Back', headerTitle: '' }} />
            <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </AdminAuthProvider>
    </AppProvider>
  );
}
