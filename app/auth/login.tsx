import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, BorderRadius, Spacing } from '@/constants/theme';
import { useState, useEffect } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const { startSession, completeOnboarding, state } = useApp();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (state.user) {
      if (state.hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)');
      }
    }
  }, []);

  const handleLogin = async () => {
    console.log('Login button pressed'); // Debug log
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', email); // Debug log
      // Call login API
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Try to parse response
      let data;
      try {
        data = await response.json();
      } catch {
        // If not JSON, create error data
        data = { message: `Server error: ${response.status}` };
      }

      if (response.ok) {
        // Save token and user
        const user = {id: data.user?.id || '1', email, name: data.user?.name || 'User', avatar: data.user?.avatar || '', roles: []};
        startSession(user);
        completeOnboarding();
        Alert.alert('Success', 'Logged in successfully! 🎉', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        // Backend failed (403, 401, 500, etc.) - use testing mode
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Show testing mode for any failure (network error or backend error)
      Alert.alert('Testing Mode 🚀', 'Backend not available. Use test credentials to explore the app.', [
        {
          text: 'Continue with Test Data',
          onPress: async () => {
            const testUser = {id: '1', email, name: 'Test User', avatar: '', roles: []};
            startSession(testUser);
            completeOnboarding();
            router.replace('/(tabs)');
          }
        },
        { text: 'Cancel', onPress: () => {}, style: 'cancel' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Dating</Text>
      <Text style={styles.subtitle}>Sign In to Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        placeholderTextColor={Colors.textSecondary}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        placeholderTextColor={Colors.textSecondary}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/auth/register')} 
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    backgroundColor: Colors.surface,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
  link: {
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
